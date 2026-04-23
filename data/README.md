# 데이터 관리 가이드

포트폴리오 데이터를 YAML 파일로 관리하는 방법입니다.

## 구조

```
/data/
  profile.yaml      # 프로필 정보
  companies.yaml    # 회사별 설정
  achievements.yaml # 수상/성과
  timeline.yaml     # 경력 타임라인
  i18n/
    en.yaml         # 영문 번역
    ko.yaml         # 한글 번역

/projects/
  01-line-ai-dev2.md
  02-line-vision-pro.md
  ...               # 프로젝트별 Markdown 파일
```

## YAML 파일 수정

### profile.yaml

```yaml
name: Kayoung Lee
email: elain202@gmail.com
phone: "[REDACTED]"

skills:
  - iOS
  - Swift
  - SwiftUI
  # 스킬 추가/제거
```

### companies.yaml

회사별 포트폴리오 커스터마이징 (`?company=apple` 형태로 접근):

```yaml
apple:
  greeting: "Hi Apple Team, I'm"
  greetingKo: "안녕하세요 Apple 팀, 저는"
  highlightSkills:
    - iOS
    - Swift
  featuredProjectIds:
    - line-vision-pro
    - line-ai-dev2
  customMessage: "메시지"
```

### i18n/*.yaml

다국어 번역 (키: 값 형태):

```yaml
nav.home: Home
nav.projects: Projects
hero.title: iOS Developer at LINE
```

## 빌드

YAML 수정 후 JSON 생성:

```bash
node scripts/build-data.js
```

출력:
```
Building data files...

Converted: data/achievements.yaml
Converted: data/companies.yaml
...

Converted 6 YAML files to JSON

Building projects...
...
Generated data/projects.json with 10 projects
```

## 프로젝트 수정

프로젝트는 `/projects/` 폴더의 Markdown 파일로 관리합니다.
자세한 내용은 [projects/README.md](../projects/README.md)를 참조하세요.

## 주의사항

- YAML 문법: 들여쓰기는 공백 2칸 사용
- 특수문자가 포함된 값은 따옴표로 감싸기: `"Hello, I'm"`
- 빈 배열: `[]`
- null 값: `null`

## 배포

```bash
# 1. YAML/Markdown 수정
# 2. JSON 빌드
node scripts/build-data.js

# 3. 커밋 & 푸시
git add .
git commit -m "Update data"
git push origin main:master
```
