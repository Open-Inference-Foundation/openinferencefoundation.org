/**
 * Dev-only stub for `mermaid`.
 *
 * The @flowstack/sdk lazy-imports `mermaid` for chat-markdown diagram rendering
 * (see MermaidDiagram). OIF never surfaces that rendering path, so we don't
 * install the ~3MB dependency. The production build externalizes 'mermaid'
 * (vite.config.ts → build.rollupOptions.external), but `vite` dev has no such
 * escape hatch and fails import-analysis on the unresolved module. This stub is
 * aliased in for dev only so the dynamic import resolves to a harmless no-op.
 */
export default {
  initialize() {},
  async render() {
    return { svg: '' };
  },
};
