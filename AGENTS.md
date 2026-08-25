# heirloom-www

## Site

Astro static site, no JS framework islands. `npm install` once, then `npm run dev` / `npm run build` (output in `dist/`).

- Page: `src/pages/index.astro`; shared styles: `src/styles/global.css` (fonts and palette live as CSS custom properties at the top).
- Copy and wording follow the decisions in map issue [#1](https://github.com/0xnicholas/heirloom-www/issues/1) (hero copy + wording charter from #3; code sample from #2, see `docs/research/code-sample.md`).

## Agent skills

### Issue tracker

Issues are tracked as GitHub issues on `0xnicholas/heirloom-www`, via the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Default five canonical labels (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.
