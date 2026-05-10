# Kayoung Lee - Portfolio

Personal portfolio website showcasing iOS development projects, research work, and professional experience.

**Live:** [elain2.github.io](https://elain2.github.io)

## Features

- **Responsive Design** - Mobile-first, works on all devices
- **Bilingual Support** - English / Korean (i18n)
- **Company Customization** - Tailored content via URL parameters (`?company=apple`)
- **Markdown Projects** - Project details written in Markdown with Mermaid diagram support
- **Video Demos** - Embedded demo videos for select projects
- **Static Site** - No build step required, pure HTML/CSS/JS

## Tech Stack

- Vanilla JavaScript (ES6+)
- CSS3 with CSS Variables
- [marked.js](https://marked.js.org/) - Markdown parsing
- [mermaid.js](https://mermaid.js.org/) - Diagram rendering

## Project Structure

```
├── index.html          # Entry point
├── css/
│   └── style.css       # All styles
├── js/
│   └── app.js          # Application logic
├── data/
│   ├── profile.json    # Personal info & skills
│   ├── projects.json   # Project metadata
│   ├── timeline.json   # Career timeline
│   ├── achievements.json
│   ├── companies.json  # Company-specific customizations
│   └── i18n/
│       ├── en.json     # English translations
│       └── ko.json     # Korean translations
├── projects/           # Markdown files for each project
│   ├── 01-shortform-poc.md
│   ├── 02-line-ai-dev2.md
│   └── ...
└── images/
    └── projects/       # Project images & videos
```

## Local Development

```bash
# Start local server
python3 -m http.server 8000

# Open in browser
open http://localhost:8000
```

## Company Customization

Add URL parameter to show tailored content:

```
https://elain2.github.io/?company=apple
https://elain2.github.io/?c=google
```

Configure in `data/companies.json`:
- Featured project ordering
- Highlighted skills
- Custom greetings and descriptions
- Role mapping

## Adding a New Project

1. Create markdown file in `projects/` (e.g., `12-new-project.md`)
2. Add frontmatter with metadata:
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
3. Add project entry to `data/projects.json`
4. Update `getProjectFiles()` in `js/app.js`

## License

MIT
