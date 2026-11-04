# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Personal portfolio of Kayoung Lee (iOS engineer at LINE), deployed with GitHub Pages from `master` at https://elain2.github.io. It is a static site: vanilla HTML/CSS/JS, no bundler, no tests, no linter.

## Commands

```bash
python3 -m http.server 8000      # serve locally; pages fetch JSON, so file:// will not work
node scripts/build-data.js       # data/*.yaml -> data/*.json, then also runs build-projects.js
node scripts/build-projects.js   # projects/*.md frontmatter -> data/projects.json
python3 scripts/convert-videos.py <files|dirs>   # .mov/HEVC -> H.264 MP4 next to the source (needs ffmpeg)
```

**Do not run the build scripts without checking the diff afterwards.** `data/projects.json` is currently hand-maintained and ahead of `projects/*.md`. `build-projects.js` drops every `*_ko` field (`title_ko`, `description_ko`, `responsibilities_ko`, ...) plus `demoVideos` and local thumbnails, so a rebuild wipes the Korean copy. `scripts/dev.sh` runs `build-data.js`, so it has the same problem. Edit `data/projects.json` directly, or fix the build script first.

## Architecture

There are two front ends that share one data folder:

1. **Redesign, the live site (`index.html` + `project.html`, code in `redesign/`).** The "Surface → Deep" concept, which replaced the Apple look.
   - Scrolling dives from a white surface down to black at -40m.
   - `redesign/shared.js` holds what both pages use: `FEATURED` (the big project rows on the main page; the rest go to the archive list), data helpers, and the depth engine. The engine sets the page background by interpolating each `main > section`'s `data-bg` colour at the viewport centre. It also drives the depth gauge from `data-depth`, toggles `body.is-dark` / `is-under`, and adds bubbles. `startWater({ hold })` keeps each section's colour for that share of its height before blending (the detail page uses 0.6 for readability).
   - `redesign/main.js` renders the main page from `data/{projects,timeline,achievements,i18n/ko}.json` (paths are relative to the root page).
   - `project.html?id=<id>` + `redesign/project.js` / `project.css` is the project detail page. Its sections are hero (0m), role and about (-5m), media (-12m), technical notes (-24m), and previous/next (-40m). Sections with no content are skipped. The technical notes come from `projects/*.md`: Korean `<!-- lang:ko -->` blocks and `mermaid`/`mermaid-ko` diagrams are kept, the Responsibilities/About sections that repeat `projects.json` are dropped, and mermaid loads only when a diagram is present. The file list is `PROJECT_FILES` in `project.js`. Videos missing from the repo are removed at runtime. Demo videos must be H.264 MP4 (Chrome can't play HEVC .mov), so convert with `scripts/convert-videos.py`. The `.mov` sources stay in the repo.
   - Only images under `images/` are shown; remote stock thumbnails fall back to a text placeholder.
   - A script in the `<head>` of `index.html` forwards old links: `#/projects/<id>` goes to `project.html?id=<id>`, and `?company=`, `?c=` and other `#/...` links go to `classic.html`. `redesign/index.html` only redirects to the root, so the old `/redesign/` URL keeps working.
   - Copy is Korean only, in 합니다체. Detail pages fall back to English where a project has no `*_ko` field (most `responsibilities` and `detailedDescription`).
2. **Old site (`classic.html` + `js/app.js` + `css/style.css`).** Apple-styled single-page app with hash routing: `#/`, `#/projects`, `#/projects/<id>`. Still used for `?company=` links.
   - `DataStore` fetches `data/*.json`. Project detail bodies are fetched at runtime from `projects/*.md` (frontmatter stripped, rendered with marked.js + mermaid).
   - The project file list is hardcoded in `getProjectFiles()` in `js/app.js` (and `PROJECT_FILES` in `redesign/project.js`), so a new project needs an entry in both.
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
- `rock-shallows.jpg` (the photo before 고양이 사랑방) is `YOUNG-132.jpg` from the owner's Lightroom exports in `~/Documents/라이트룸 보정`. It was cropped the same way and resized to 1800px wide. Original exports there are full size, so resize before adding.
- `freedive-reef.jpg` was shot by someone else. Keep its "Leeknow" watermark and the "Photo by Leeknow" caption.
- Freediving appears only as mood and photos, not as written copy.

`images/projects/line-yuki-framework/thumbnail.svg` is an abstract illustration, not a product screenshot: a snowflake-shaped aperture (yuki = snow) between camera frame layers and the Avatar/Voom/Messenger products. Regenerate it with `node scripts/yuki-thumbnail.js images/projects/line-yuki-framework/thumbnail.svg`. It has no LINE logo, so keep it that way.

`images/projects/cat-ddong/` comes from the side project https://github.com/elain2/cat-ddong (live at https://elain2.github.io/cat-ddong/).

## Repo notes

- **Work on `master` and push it directly. No feature branches or PRs.** The owner asked for every change to go live on https://elain2.github.io right away. Pages rebuilds a minute or two after each push. The old `redesign/surface-to-deep` branch is already merged and is no longer used.
- Commit format is `<type>: <description>` (feat, fix, refactor, docs, chore, ...).
- A local `post-commit` hook (`ignoreScripts/commit-time.sh`, git-ignored) rewrites commit times that fall between 06:00 and 18:00. The "커밋 시간 조정" output after a commit is expected.
- `.claude/launch.json` is a local preview config (python http.server on port 8411) and is not committed.

## Next steps (as of 2026-11-04)

The redesign is live as the main page. The old site lives on as `classic.html`.

1. **English version of the redesign.** Reuse `data/i18n/en.json` and the non-`_ko` project fields, and add a KO/EN toggle in the top bar.
2. **Korean copy for detail pages.** Only `shortform-poc` has `responsibilities_ko` / `detailedDescription_ko`. The other 10 projects show English in those two blocks. Image captions are English only (`caption_ko` is supported).
3. **Retire the old site.** Once i18n is covered, remove `classic.html`, `css/style.css` and `js/app.js`. Decide whether to keep `?company=` customization (it currently forwards to `classic.html`) and port it.
4. **Fix `scripts/build-projects.js`** so it keeps `*_ko` fields, `demoVideos`, and local thumbnails. Then move the Korean copy back into `projects/*.md` so the markdown becomes the source of truth again.
5. **Replace remote Unsplash thumbnails** with real project images. Projects without local images show a text placeholder in the redesign.
6. **Copy polish.** The "나에 대해" section would be stronger with one concrete story of the owner's passion, which hasn't been collected yet. Review the Korean project descriptions in `data/projects.json`, which are translations of the English ones.
