# heirloom-www

## Site

Astro static site, no JS framework islands. `npm install` once, then `npm run dev` / `npm run build` (output in `dist/`).

- Page: `src/pages/index.astro`; shared styles: `src/styles/global.css` (fonts and palette live as CSS custom properties at the top).
- Copy and wording are specced in `CONTEXT.md` + `docs/adr/` (wording charter: ADR-0003; positioning: ADR-0002; code sample: ADR-0004 + `docs/research/code-sample.md`). These derive from map issue [#1](https://github.com/0xnicholas/heirloom-www/issues/1).

## Agent skills

### Issue tracker

Issues are tracked as GitHub issues on `0xnicholas/heirloom-www`, via the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Default five canonical labels (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.
