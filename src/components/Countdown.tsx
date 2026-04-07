import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { COMMUNITY_SALE_DATE } from '@/lib/contracts';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calcTimeLeft(): TimeLeft | null {
  const diff = COMMUNITY_SALE_DATE.getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center">
      <div
        className="font-mono text-2xl sm:text-3xl font-bold px-3 py-2 rounded-lg min-w-[60px]"
        style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' }}
      >
        {String(value).padStart(2, '0')}
      </div>
      <p className="text-[10px] uppercase tracking-wider mt-1" style={{ color: 'var(--color-text-tertiary)' }}>{label}</p>
    </div>
  );
}

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState(calcTimeLeft);

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(calcTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  const isLive = timeLeft === null;

  return (
    <section
      className="py-8 px-4 sm:px-6 border-b"
      style={{
        backgroundColor: isLive ? 'var(--color-accent-2-light)' : 'var(--color-accent-light)',
        borderColor: isLive ? 'var(--color-accent-2)' : 'var(--color-accent)',
      }}
    >
      <div className="max-w-4xl mx-auto text-center">
        {isLive ? (
          <>
            <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--color-accent-2)' }}>
              Community Sale is Live
            </p>
            <Link
              to="/buy"
              className="inline-block px-6 py-3 rounded-lg text-white font-semibold transition-colors"
              style={{ backgroundColor: 'var(--color-accent-2)' }}
            >
              Buy INFER Now
            </Link>
          </>
        ) : (
          <>
            <p className="text-sm font-semibold uppercase tracking-widest mb-1" style={{ color: 'var(--color-accent)' }}>
              Community Sale
            </p>
            <p className="text-xs mb-4" style={{ color: 'var(--color-text-secondary)' }}>
              May 23, 2026 at 10:00 AM ET
            </p>
            <div className="flex items-center justify-center gap-2 sm:gap-4 mb-4">
              <TimeUnit value={timeLeft.days} label="Days" />
              <span className="font-mono text-xl font-bold pt-[-8px]" style={{ color: 'var(--color-text-tertiary)' }}>:</span>
              <TimeUnit value={timeLeft.hours} label="Hours" />
              <span className="font-mono text-xl font-bold" style={{ color: 'var(--color-text-tertiary)' }}>:</span>
              <TimeUnit value={timeLeft.minutes} label="Min" />
              <span className="font-mono text-xl font-bold" style={{ color: 'var(--color-text-tertiary)' }}>:</span>
              <TimeUnit value={timeLeft.seconds} label="Sec" />
            </div>
            <Link
              to="/buy"
              className="inline-block px-5 py-2 rounded-lg font-semibold text-sm border transition-colors"
              style={{ borderColor: 'var(--color-accent)', color: 'var(--color-accent)' }}
            >
              Learn More
            </Link>
          </>
        )}
      </div>
    </section>
  );
}
