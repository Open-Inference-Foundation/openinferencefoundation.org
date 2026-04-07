#!/bin/bash
set -euo pipefail

# ── Open Inference Foundation — AWS Deployment ────────────────────────
# Creates: Route 53 hosted zone, ACM cert, S3 bucket, CloudFront distro
# Then builds and deploys the Vite site.
#
# Prerequisites:
#   - AWS CLI configured (flowstack-deploy user)
#   - npm install already run
#
# After running this script:
#   1. Update nameservers at Unstoppable Domains to the Route 53 NS records
#   2. Wait for DNS propagation (up to 48h, usually <1h)
#   3. ACM cert will auto-validate once DNS propagates

DOMAIN="openinferencefoundation.org"
BUCKET="openinferencefoundation-site"
REGION="us-east-1"  # Required for CloudFront + ACM

echo "═══════════════════════════════════════════════════"
echo "  Deploying: $DOMAIN"
echo "═══════════════════════════════════════════════════"
echo ""

# ── Step 1: Route 53 Hosted Zone ──────────────────────────────────────
echo "▸ Step 1: Creating Route 53 hosted zone..."

ZONE_ID=$(aws route53 list-hosted-zones \
  --query "HostedZones[?Name=='${DOMAIN}.'].Id" \
  --output text 2>/dev/null | sed 's|/hostedzone/||')

if [ -z "$ZONE_ID" ]; then
  ZONE_RESULT=$(aws route53 create-hosted-zone \
    --name "$DOMAIN" \
    --caller-reference "oif-$(date +%s)" \
    --output json 2>/dev/null)

  ZONE_ID=$(echo "$ZONE_RESULT" | python3 -c "import sys,json; print(json.load(sys.stdin)['HostedZone']['Id'].split('/')[-1])")
  echo "  Created hosted zone: $ZONE_ID"
else
  echo "  Hosted zone exists: $ZONE_ID"
fi

# Print NS records for Unstoppable Domains update
echo ""
echo "  ┌─────────────────────────────────────────────────┐"
echo "  │ UPDATE THESE NS RECORDS AT UNSTOPPABLE DOMAINS: │"
echo "  └─────────────────────────────────────────────────┘"
aws route53 get-hosted-zone --id "$ZONE_ID" \
  --query 'DelegationSet.NameServers' --output text 2>/dev/null | tr '\t' '\n' | while read ns; do
  echo "    NS → $ns"
done
echo ""

# ── Step 2: ACM Certificate ──────────────────────────────────────────
echo "▸ Step 2: Requesting ACM certificate..."

CERT_ARN=$(aws acm list-certificates \
  --region "$REGION" \
  --query "CertificateSummaryList[?DomainName=='${DOMAIN}'].CertificateArn" \
  --output text 2>/dev/null)

if [ -z "$CERT_ARN" ]; then
  CERT_ARN=$(aws acm request-certificate \
    --region "$REGION" \
    --domain-name "$DOMAIN" \
    --subject-alternative-names "www.${DOMAIN}" \
    --validation-method DNS \
    --output text \
    --query 'CertificateArn' 2>/dev/null)
  echo "  Requested cert: $CERT_ARN"

  # Wait a moment for ACM to generate validation records
  sleep 5

  # Add DNS validation records to Route 53
  echo "  Adding DNS validation records..."
  VALIDATION=$(aws acm describe-certificate \
    --region "$REGION" \
    --certificate-arn "$CERT_ARN" \
    --query 'Certificate.DomainValidationOptions' \
    --output json 2>/dev/null)

  # Build Route 53 change batch for validation
  CHANGES=$(echo "$VALIDATION" | python3 -c "
import sys, json
opts = json.load(sys.stdin)
changes = []
seen = set()
for opt in opts:
    rr = opt.get('ResourceRecord', {})
    name = rr.get('Name', '')
    if name and name not in seen:
        seen.add(name)
        changes.append({
            'Action': 'UPSERT',
            'ResourceRecordSet': {
                'Name': name,
                'Type': rr['Type'],
                'TTL': 300,
                'ResourceRecords': [{'Value': rr['Value']}]
            }
        })
print(json.dumps({'Changes': changes}))
")

  aws route53 change-resource-record-sets \
    --hosted-zone-id "$ZONE_ID" \
    --change-batch "$CHANGES" \
    --output text 2>/dev/null > /dev/null
  echo "  Validation records added to Route 53"
else
  echo "  Cert exists: $CERT_ARN"
fi

# ── Step 3: S3 Bucket ────────────────────────────────────────────────
echo ""
echo "▸ Step 3: Creating S3 bucket..."

if aws s3 ls "s3://${BUCKET}" 2>/dev/null > /dev/null; then
  echo "  Bucket exists: $BUCKET"
else
  aws s3 mb "s3://${BUCKET}" --region "$REGION" 2>/dev/null
  echo "  Created bucket: $BUCKET"
fi

# Bucket policy for CloudFront OAC (will be updated with CloudFront distribution ID)
echo "  Configuring bucket for static hosting..."
aws s3 website "s3://${BUCKET}" \
  --index-document index.html \
  --error-document index.html 2>/dev/null

# Block public access (CloudFront OAC will handle access)
aws s3api put-public-access-block \
  --bucket "$BUCKET" \
  --public-access-block-configuration "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=false,RestrictPublicBuckets=false" \
  2>/dev/null

# ── Step 4: CloudFront Distribution ──────────────────────────────────
echo ""
echo "▸ Step 4: Creating CloudFront distribution..."

DIST_ID=$(aws cloudfront list-distributions \
  --query "DistributionList.Items[?Aliases.Items[0]=='${DOMAIN}'].Id" \
  --output text 2>/dev/null)

if [ -z "$DIST_ID" ] || [ "$DIST_ID" = "None" ]; then
  # Create OAC
  OAC_ID=$(aws cloudfront create-origin-access-control \
    --origin-access-control-config "{
      \"Name\": \"oif-site-oac\",
      \"OriginAccessControlOriginType\": \"s3\",
      \"SigningBehavior\": \"always\",
      \"SigningProtocol\": \"sigv4\"
    }" \
    --query 'OriginAccessControl.Id' \
    --output text 2>/dev/null)

  DIST_CONFIG=$(cat <<DISTEOF
{
  "CallerReference": "oif-$(date +%s)",
  "Aliases": {
    "Quantity": 2,
    "Items": ["${DOMAIN}", "www.${DOMAIN}"]
  },
  "DefaultRootObject": "index.html",
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "S3-${BUCKET}",
        "DomainName": "${BUCKET}.s3.${REGION}.amazonaws.com",
        "OriginAccessControlId": "${OAC_ID}",
        "S3OriginConfig": {
          "OriginAccessIdentity": ""
        }
      }
    ]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-${BUCKET}",
    "ViewerProtocolPolicy": "redirect-to-https",
    "AllowedMethods": {
      "Quantity": 2,
      "Items": ["GET", "HEAD"],
      "CachedMethods": {
        "Quantity": 2,
        "Items": ["GET", "HEAD"]
      }
    },
    "ForwardedValues": {
      "QueryString": false,
      "Cookies": { "Forward": "none" }
    },
    "MinTTL": 0,
    "DefaultTTL": 86400,
    "MaxTTL": 31536000,
    "Compress": true
  },
  "CustomErrorResponses": {
    "Quantity": 1,
    "Items": [
      {
        "ErrorCode": 403,
        "ResponsePagePath": "/index.html",
        "ResponseCode": "200",
        "ErrorCachingMinTTL": 10
      }
    ]
  },
  "ViewerCertificate": {
    "ACMCertificateArn": "${CERT_ARN}",
    "SSLSupportMethod": "sni-only",
    "MinimumProtocolVersion": "TLSv1.2_2021"
  },
  "Enabled": true,
  "Comment": "Open Inference Foundation site",
  "PriceClass": "PriceClass_100",
  "HttpVersion": "http2and3"
}
DISTEOF
)

  DIST_RESULT=$(aws cloudfront create-distribution \
    --distribution-config "$DIST_CONFIG" \
    --output json 2>/dev/null)

  DIST_ID=$(echo "$DIST_RESULT" | python3 -c "import sys,json; print(json.load(sys.stdin)['Distribution']['Id'])")
  DIST_DOMAIN=$(echo "$DIST_RESULT" | python3 -c "import sys,json; print(json.load(sys.stdin)['Distribution']['DomainName'])")

  echo "  Created distribution: $DIST_ID"
  echo "  CloudFront domain: $DIST_DOMAIN"

  # Update S3 bucket policy to allow CloudFront OAC
  ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text 2>/dev/null)
  aws s3api put-bucket-policy --bucket "$BUCKET" --policy "{
    \"Version\": \"2012-10-17\",
    \"Statement\": [{
      \"Sid\": \"AllowCloudFrontServicePrincipal\",
      \"Effect\": \"Allow\",
      \"Principal\": {\"Service\": \"cloudfront.amazonaws.com\"},
      \"Action\": \"s3:GetObject\",
      \"Resource\": \"arn:aws:s3:::${BUCKET}/*\",
      \"Condition\": {
        \"StringEquals\": {
          \"AWS:SourceArn\": \"arn:aws:cloudfront::${ACCOUNT_ID}:distribution/${DIST_ID}\"
        }
      }
    }]
  }" 2>/dev/null
  echo "  Bucket policy updated for CloudFront OAC"

else
  DIST_DOMAIN=$(aws cloudfront get-distribution --id "$DIST_ID" \
    --query 'Distribution.DomainName' --output text 2>/dev/null)
  echo "  Distribution exists: $DIST_ID ($DIST_DOMAIN)"
fi

# ── Step 5: Route 53 DNS Records ─────────────────────────────────────
echo ""
echo "▸ Step 5: Adding A records (alias to CloudFront)..."

aws route53 change-resource-record-sets \
  --hosted-zone-id "$ZONE_ID" \
  --change-batch "{
    \"Changes\": [
      {
        \"Action\": \"UPSERT\",
        \"ResourceRecordSet\": {
          \"Name\": \"${DOMAIN}\",
          \"Type\": \"A\",
          \"AliasTarget\": {
            \"HostedZoneId\": \"Z2FDTNDATAQYW2\",
            \"DNSName\": \"${DIST_DOMAIN}\",
            \"EvaluateTargetHealth\": false
          }
        }
      },
      {
        \"Action\": \"UPSERT\",
        \"ResourceRecordSet\": {
          \"Name\": \"www.${DOMAIN}\",
          \"Type\": \"A\",
          \"AliasTarget\": {
            \"HostedZoneId\": \"Z2FDTNDATAQYW2\",
            \"DNSName\": \"${DIST_DOMAIN}\",
            \"EvaluateTargetHealth\": false
          }
        }
      }
    ]
  }" --output text 2>/dev/null > /dev/null

echo "  A records created: ${DOMAIN} → ${DIST_DOMAIN}"
echo "  A records created: www.${DOMAIN} → ${DIST_DOMAIN}"

# ── Step 6: Build & Deploy ───────────────────────────────────────────
echo ""
echo "▸ Step 6: Building site..."
cd "$(dirname "$0")/.."
npm run build

echo ""
echo "▸ Step 7: Uploading to S3..."
aws s3 sync dist/ "s3://${BUCKET}" \
  --delete \
  --cache-control "public, max-age=31536000, immutable" \
  --exclude "index.html" \
  --exclude "*.json" \
  2>/dev/null

# index.html and JSON with short cache (so deploys are instant)
aws s3 cp dist/index.html "s3://${BUCKET}/index.html" \
  --cache-control "public, max-age=0, must-revalidate" \
  2>/dev/null

# Copy any JSON files with short cache
find dist -name "*.json" -exec sh -c '
  aws s3 cp "$1" "s3://'"${BUCKET}"'/$(echo "$1" | sed "s|^dist/||")" \
    --cache-control "public, max-age=0, must-revalidate" 2>/dev/null
' _ {} \;

echo "  Uploaded $(find dist -type f | wc -l | tr -d ' ') files"

# ── Step 8: Invalidate CloudFront Cache ──────────────────────────────
echo ""
echo "▸ Step 8: Invalidating CloudFront cache..."
aws cloudfront create-invalidation \
  --distribution-id "$DIST_ID" \
  --paths "/*" \
  --output text 2>/dev/null > /dev/null
echo "  Cache invalidation started"

# ── Done ─────────────────────────────────────────────────────────────
echo ""
echo "═══════════════════════════════════════════════════"
echo "  DEPLOYMENT COMPLETE"
echo "═══════════════════════════════════════════════════"
echo ""
echo "  Site URL:     https://${DOMAIN}"
echo "  CloudFront:   https://${DIST_DOMAIN}"
echo "  S3 Bucket:    s3://${BUCKET}"
echo "  Distribution: ${DIST_ID}"
echo "  Hosted Zone:  ${ZONE_ID}"
echo "  ACM Cert:     ${CERT_ARN}"
echo ""
echo "  ⚠ ACTION REQUIRED:"
echo "  Update nameservers at Unstoppable Domains to:"
aws route53 get-hosted-zone --id "$ZONE_ID" \
  --query 'DelegationSet.NameServers' --output text 2>/dev/null | tr '\t' '\n' | while read ns; do
  echo "    $ns"
done
echo ""
echo "  DNS propagation takes up to 48h (usually <1h)."
echo "  ACM cert validates automatically once NS records propagate."
echo ""
