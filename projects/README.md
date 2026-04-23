# Projects 관리 가이드

포트폴리오 프로젝트를 Markdown 파일로 관리하는 방법입니다.

## 구조

```
/projects/
  01-line-ai-dev2.md
  02-line-vision-pro.md
  03-line-voom-camera.md
  ...
```

파일명 앞의 숫자(`01-`, `02-`)가 표시 순서를 결정합니다.

## 프로젝트 파일 형식

각 `.md` 파일은 YAML frontmatter와 본문으로 구성됩니다:

```markdown
---
id: project-id
title: 프로젝트 제목
category: iOS Development
thumbnail: https://example.com/image.jpg
tags:
  - iOS
  - Swift
  - UIKit
description: 짧은 설명 (한 줄)
role: iOS Developer
period: 2023 - 2026
contribution: 85
publication: 논문/발표 제목 (선택)
publicationUrl: https://... (선택)
demoVideo: https://youtu.be/... (선택)
event: 행사명 (선택)
---

## Responsibilities

- 역할/성과 1
- 역할/성과 2
- 역할/성과 3

## About

프로젝트에 대한 상세 설명을 작성합니다.
여러 줄로 작성해도 됩니다.
```

### 필수 필드

| 필드 | 설명 |
|------|------|
| `id` | 고유 ID (영문, 하이픈 사용) |
| `title` | 프로젝트 제목 |
| `category` | 카테고리 (iOS Development, AR/VR, Research 등) |
| `thumbnail` | 썸네일 이미지 URL |
| `tags` | 기술 태그 목록 |
| `description` | 짧은 설명 |
| `role` | 역할 |
| `period` | 기간 |

### 선택 필드

| 필드 | 설명 |
|------|------|
| `contribution` | 기여도 (0-100) |
| `publication` | 논문/발표 제목 |
| `publicationUrl` | 논문/발표 링크 |
| `demoVideo` | 데모 영상 URL |
| `event` | 관련 행사명 |

## JSON 빌드

Markdown 파일 수정 후, 다음 명령어로 JSON을 생성합니다:

```bash
node scripts/build-projects.js
```

성공하면 `data/projects.json`이 업데이트됩니다:

```
Parsed: 01-line-ai-dev2.md
Parsed: 02-line-vision-pro.md
...
Generated data/projects.json with 9 projects
```

## 새 프로젝트 추가

1. `projects/` 폴더에 새 파일 생성 (예: `10-new-project.md`)
2. 위 형식에 맞게 내용 작성
3. 빌드 실행: `node scripts/build-projects.js`
4. 커밋 & 푸시

## 프로젝트 순서 변경

파일명 앞의 숫자를 변경합니다:

```bash
# 기존
01-line-ai-dev2.md
02-line-vision-pro.md

# 순서 변경
01-line-vision-pro.md   # Vision Pro를 첫 번째로
02-line-ai-dev2.md
```

## 카테고리 목록

현재 지원되는 카테고리:

- `iOS Development`
- `AR/VR`
- `Research`
- `Game Design`
- `Computer Graphics`
- `IoT`
- `Web Development`

새 카테고리 추가 시 `js/app.js`의 `categories` 배열도 수정해야 합니다.

## 배포

```bash
# 1. Markdown 수정
# 2. JSON 빌드
node scripts/build-projects.js

# 3. 커밋 & 푸시
git add .
git commit -m "Update projects"
git push origin main:master
```
