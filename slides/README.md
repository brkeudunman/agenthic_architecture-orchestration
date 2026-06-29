# Domain 1 Slides — Agentic Architecture & Orchestration

A [Slidev](https://sli.dev) deck for the Anthropic Claude Certification study guide
(Domain 1). Built from the lessons in [`../docs/learn/`](../docs/learn) and the
practice bank in [`../docs/practice/`](../docs/practice).

The deck covers task statements 1.1–1.7 (one section each) and ends with an
**interactive 10-question quiz** — click an option to grade it and reveal the
answer-key reasoning.

## Prerequisites

- Node.js 18+ and npm

## Run locally

```bash
cd slides
npm install
npm run dev        # opens http://localhost:3030 with hot reload
```

Navigate with arrow keys / `Space`. Press `o` for slide overview, `d` for dark mode,
`p` for the laser pointer/presenter tools.

## Build the web version

```bash
npm run build          # static SPA in dist/ (base = /), good for local/Netlify
npm run preview        # serve dist/ locally to spot-check

# For GitHub Pages served at https://<user>.github.io/<repo>/:
npm run build:pages    # sets --base /claude-cert-domain1/
```

If you deploy under a different repo/path, change the `--base` value in the
`build:pages` script (or in `.github/workflows/deploy.yml`) to match.

## Export to PDF

```bash
npm run export         # writes dist/claude-cert-domain1.pdf
```

The first export downloads a headless Chromium via `playwright-chromium`
(already a dev dependency). If it complains, run `npx playwright install chromium`.

## Deploy to GitHub Pages

This repo is not yet a git repository. To publish the deck:

```bash
git init
git add .
git commit -m "Add Domain 1 study guide + Slidev deck"
# create a GitHub repo, then:
git remote add origin git@github.com:<user>/<repo>.git
git push -u origin main
```

A workflow at [`../.github/workflows/deploy.yml`](../.github/workflows/deploy.yml)
builds `slides/` and publishes to Pages on every push to `main`. In the repo's
**Settings → Pages**, set **Source = GitHub Actions**. Match the workflow's
`--base` to your repo name.

**No-git alternative:** run `npm run build` and drag the `dist/` folder onto
[Netlify Drop](https://app.netlify.com/drop).

## Structure

```
slides/
  slides.md            # entry deck: cover, agenda, src-includes, closing
  pages/01–07*.md      # one lesson per file (section + content + Exam Traps + "test yourself")
  pages/08-practice-quiz.md
  components/
    ExamTrap.vue       # amber callout for exam traps
    KeyConcept.vue     # blue callout (kept distinct from Exam Traps)
    Quiz.vue           # interactive question component
  data/questions.ts    # the 10 quiz questions (from docs/practice)
  style.css            # global table/code tweaks
```

## Editing

`../docs/` stays the canonical source of truth. The slide pages reformat that
prose into slide-sized units, so edits to the docs should be mirrored into the
matching `pages/*.md` (and `data/questions.ts` for the quiz). Inline code
identifiers stay in backticks (`stop_reason`, `PreToolUse`, `fork_session`, …)
to get Shiki highlighting, consistent with the docs conventions.
