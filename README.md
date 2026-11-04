# Kayoung Lee - Portfolio

Personal portfolio of Kayoung Lee, an iOS engineer at LINE who builds cameras and carries one.

**Live:** [elain2.github.io](https://elain2.github.io)

## Overview

The main page uses the **"Surface → Deep"** design. As you scroll, the page dives from a white surface down to black at -40m. A depth gauge, rising bubbles, and the owner's own photos set the mood.

The previous Apple-style site still runs at [`classic.html`](https://elain2.github.io/classic.html). For now it serves the project detail pages and the company-specific links.

- **Static site:** vanilla HTML/CSS/JS with no bundler and no build step to deploy
- **One data source:** both pages read the same `data/*.json`
- **Markdown project pages:** rendered with [marked.js](https://marked.js.org/) and [mermaid.js](https://mermaid.js.org/)
- **Company customization:** `?company=<key>` tailors the content (classic site)

## Project Structure

```
├── index.html            # Main page (Surface → Deep)
├── redesign/
│   ├── style.css         # Main page styles
│   ├── main.js           # Depth/background scroll effects, data rendering
│   └── index.html        # Redirects the old /redesign/ URL to /
├── classic.html          # Previous Apple-style SPA (#/, #/projects, #/projects/<id>)
├── css/style.css         # Classic site styles
├── js/app.js             # Classic site logic (routing, i18n, company overrides)
├── data/
│   ├── *.yaml            # Editable sources (profile, timeline, achievements, companies, i18n)
│   ├── *.json            # What the browser loads
│   └── i18n/{en,ko}.json
├── projects/*.md         # Project detail pages (frontmatter + Markdown)
├── images/
│   ├── photos/           # The owner's photos used on the main page
│   └── projects/         # Project images & videos
└── scripts/              # YAML/Markdown -> JSON build scripts
```

## Local Development

The pages fetch JSON, so open them through a local server instead of `file://`.

```bash
python3 -m http.server 8000
```

```bash
open http://localhost:8000
```

## Deployment

GitHub Pages serves the site from the root of the `master` branch. Commit to `master` and push. The site updates a minute or two later.

```bash
git push origin master
```

## Links for the Classic Site

Links made for the old site still work. The main page forwards them to `classic.html`.

```
https://elain2.github.io/?company=apple     -> classic.html?company=apple
https://elain2.github.io/#/projects/<id>    -> classic.html#/projects/<id>
```

Company overrides live in `data/companies.json`. They set the greeting, featured project order, highlighted skills, and a custom message.

## Adding a New Project

1. Create a Markdown file in `projects/`, for example `12-new-project.md`, with frontmatter:
   ```yaml
   ---
   id: new-project
   title: Project Title
   title_ko: 프로젝트 제목
   category: iOS Development
   thumbnail: images/projects/new-project/thumbnail.png
   tags:
     - Swift
     - iOS
   ---
   ```
2. Add the project entry to `data/projects.json` by hand. See the note below.
3. Add the file to `getProjectFiles()` in `js/app.js` so the detail page can load it.
4. To show it as a large row on the main page, add its `id` to `FEATURED` in `redesign/main.js`. Otherwise it appears in the archive list.

The main page only shows images stored under `images/`. Projects without one show a text placeholder.

> **Note:** `scripts/build-projects.js` currently drops the Korean fields (`*_ko`), `demoVideos`, and local thumbnails. Don't run it, or `scripts/build-data.js` (which calls it), without checking the diff of `data/projects.json` afterwards.

## License

MIT
