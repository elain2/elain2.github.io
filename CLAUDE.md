# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Personal portfolio of Kayoung Lee (iOS engineer at LINE), deployed with GitHub Pages from `master` at https://elain2.github.io. It is a static site: vanilla HTML/CSS/JS, no bundler, no tests, no linter.

## Commands

```bash
python3 -m http.server 8000      # serve locally; pages fetch JSON, so file:// will not work
node scripts/build-data.js       # data/*.yaml -> data/*.json, then also runs build-projects.js
node scripts/build-projects.js   # projects/*.md frontmatter -> data/projects.json
```

**Do not run the build scripts without checking the diff afterwards.** `data/projects.json` is currently hand-maintained and ahead of `projects/*.md`. `build-projects.js` drops every `*_ko` field (`title_ko`, `description_ko`, `responsibilities_ko`, ...) plus `demoVideos` and local thumbnails, so a rebuild wipes the Korean copy. `scripts/dev.sh` runs `build-data.js`, so it has the same problem. Edit `data/projects.json` directly, or fix the build script first.

## Architecture

There are two front ends that share one data folder:

1. **Redesign, the live main page (`index.html` + `redesign/style.css` + `redesign/main.js`).** The "Surface → Deep" concept, which replaced the Apple look.
   - Scrolling dives from a white surface down to black at -40m.
   - `main.js` sets the page background by interpolating each section's `data-bg` colour at the viewport centre. It also drives the depth gauge from `data-depth`, toggles `body.is-dark` / `is-under`, and adds bubbles.
   - It reads `data/{projects,timeline,achievements,i18n/ko}.json` (paths are relative to the root page). `FEATURED` in `main.js` picks the big project rows, and the rest go to the archive list.
   - Only images under `images/` are shown; remote stock thumbnails fall back to a text placeholder.
   - Project cards link to the old site's `classic.html#/projects/<id>` detail pages.
   - A script in the `<head>` of `index.html` forwards old links (`?company=`, `?c=`, `#/...`) to `classic.html`. `redesign/index.html` only redirects to the root, so the old `/redesign/` URL keeps working.
   - Copy is Korean only, in 합니다체.
2. **Old site (`classic.html` + `js/app.js` + `css/style.css`).** Apple-styled single-page app with hash routing: `#/`, `#/projects`, `#/projects/<id>`. Still used for project detail pages and `?company=` links.
   - `DataStore` fetches `data/*.json`. Project detail bodies are fetched at runtime from `projects/*.md` (frontmatter stripped, rendered with marked.js + mermaid).
   - The project file list is hardcoded in `getProjectFiles()` in `js/app.js`, so a new project needs an entry there too.
   - `I18n` toggles EN/KO (stored in `localStorage`). Keys come from `data/i18n/{en,ko}.json`, and project fields use `*_ko` variants.
   - `?company=<key>` (or `?c=`) loads overrides from `data/companies.json`: greeting, featured project order, highlighted skills, and custom message. `job-postings/` holds the postings these overrides were written for.

Data sources: `data/*.yaml` are the editable sources for `profile`, `timeline`, `achievements`, `companies`, and `i18n`. The JSON files are what the browser loads. `data/README.md` and `projects/README.md` document the formats.

## Design direction (redesign)

Agreed with the owner in interviews:
- Calm, lots of whitespace, cool tones, and photos/video as the hero, with a little playfulness (depth gauge, bubbles, "↑ 수면으로 올라가기").
- The impression to leave is "someone passionate about their work".
- Fonts: Pretendard, IBM Plex Mono for labels, and Instrument Serif italic for accents.

Photo rules:
- `images/photos/` holds the owner's own photos (Instagram @free.young.510). Their bottom ~8% was cropped to remove the owner's watermark. Anyone pictured gave permission.
- `freedive-reef.jpg` was shot by someone else. Keep its "Leeknow" watermark and the "Photo by Leeknow" caption.
- Freediving appears only as mood and photos, not as written copy.

`images/projects/cat-ddong/` comes from the side project https://github.com/elain2/cat-ddong (live at https://elain2.github.io/cat-ddong/).

## Repo notes

- **Work on `master` and push it directly. No feature branches or PRs.** The owner asked for every change to go live on https://elain2.github.io right away. Pages rebuilds a minute or two after each push. The old `redesign/surface-to-deep` branch is already merged and is no longer used.
- Commit format is `<type>: <description>` (feat, fix, refactor, docs, chore, ...).
- A local `post-commit` hook (`ignoreScripts/commit-time.sh`, git-ignored) rewrites commit times that fall between 06:00 and 18:00. The "커밋 시간 조정" output after a commit is expected.
- `.claude/launch.json` is a local preview config (python http.server on port 8411) and is not committed.

## Next steps (as of 2026-11-04)

The redesign is live as the main page. The old site lives on as `classic.html`.

1. **English version of the redesign.** Reuse `data/i18n/en.json` and the non-`_ko` project fields, and add a KO/EN toggle in the top bar.
2. **Project detail pages in the new style.** Cards currently jump to the old Apple-style detail view at `classic.html#/projects/<id>`. Render `projects/*.md` inside the redesign, keeping the depth/colour language.
3. **Retire the old site.** Once detail pages and i18n are covered, remove `classic.html`, `css/style.css` and `js/app.js`. Decide whether to keep `?company=` customization (it currently forwards to `classic.html`) and port it.
4. **Fix `scripts/build-projects.js`** so it keeps `*_ko` fields, `demoVideos`, and local thumbnails. Then move the Korean copy back into `projects/*.md` so the markdown becomes the source of truth again.
5. **Replace remote Unsplash thumbnails** with real project images. Projects without local images show a text placeholder in the redesign.
6. **Copy polish.** The "나에 대해" section would be stronger with one concrete story of the owner's passion, which hasn't been collected yet. Review the Korean project descriptions in `data/projects.json`, which are translations of the English ones.
