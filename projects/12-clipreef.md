---
id: clipreef
title: Clipreef — Natural-Language Video Search & Shortform Maker
title_ko: Clipreef — 말로 찾는 영상 라이브러리와 숏폼 제작
category: macOS Development
thumbnail: images/projects/clipreef/01-library.jpg
tags:
  - macOS
  - Swift
  - SwiftUI
  - AVFoundation
  - Gemini
  - StoreKit 2
  - TypeScript
  - SQLite
description: A macOS app that lets you search your own video library in plain language and turns the matches into 9:16 shortform videos
description_ko: 내 영상 라이브러리를 말로 검색하고, 찾은 장면으로 9:16 숏폼까지 바로 만들어 주는 macOS 앱
role: Solo Developer (Planning · Design · Development · Release)
period: 2026.10 - Present
images:
  - url: images/projects/clipreef/01-library.jpg
    caption: Library — all videos stay on this Mac
  - url: images/projects/clipreef/02-search.jpg
    caption: Natural-language search with timecoded results
  - url: images/projects/clipreef/03-highlight.jpg
    caption: Highlight candidates and AI-tagged keyframes for one clip
  - url: images/projects/clipreef/04-script-shortform.jpg
    caption: Shortform assembled from a script
  - url: images/projects/clipreef/05-shortform-edit.jpg
    caption: Refining a shortform in plain words, with music and transition options
---

<!-- lang:en -->
## Tech Stack

| Area | Technology |
|---|---|
| App | Swift, SwiftUI, Swift Concurrency (async/await, TaskGroup) |
| Video | AVFoundation (frame extraction; AVMutableComposition for compositing, reframing and export) |
| Data | SQLite (own thin wrapper, additive column migrations) |
| AI | Google Gemini (frame tagging, query expansion, scene planning), Lyria (music generation), Claude (optional, user's own key) |
| Backend | TypeScript, Vercel serverless, Upstash Redis |
| Payments & security | StoreKit 2 in-app purchases, App Store Server Library receipt verification, App Attest |
| Platforms | macOS first; iOS/iPadOS built from the same core (sandbox + security-scoped bookmarks) |
| Testing & release | XCTest (400+), XCUITest E2E, Vitest, ffmpeg-based CLI e2e, XcodeGen, fastlane |
| Prototype | Python (standard library only) + ffmpeg |

## Technical Highlights

- **Python prototype → Swift rewrite, checked against golden data.** I validated the idea quickly in Python, then turned its output into golden files and tested that the Swift code produces exactly the same results, character for character. This kept the logic from drifting during the rewrite.
- **UI-free core library.** Search, tagging, database and assembly logic live in a SwiftPM library, so the macOS app, the iOS app and the CLI tools share the same code (about 18k lines of Swift).
- **Credit proxy.** The app ships no API keys; the server calls the AI on its behalf. It verifies in-app purchases, charges and refunds credits, and checks with App Attest that requests come from the genuine app. Frame images are never stored or logged on the server. Models can be swapped with a server setting, without shipping a new app build.
- **Cost-based pricing.** Costs are calculated per minute of video rather than per token. I compared per-model costs to pick the default model and priced credit packs at roughly 3× cost. No subscription: a one-time purchase plus credit top-ups.
- **Reliable long jobs.** Results are written to the database per video, so an interrupted run resumes where it stopped and skips videos already processed. Concurrency adjusts itself based on response times.
- **Privacy first.** Original videos never leave the device; only downscaled frame images are sent for tagging.

## Status

TestFlight beta (build 14), preparing for the Mac App Store.
<!-- /lang:en -->

<!-- lang:ko -->
## 기술 스택

| 영역 | 기술 |
|---|---|
| 앱 | Swift, SwiftUI, Swift Concurrency (async/await, TaskGroup) |
| 영상 처리 | AVFoundation (프레임 추출, AVMutableComposition 합성·리프레임·내보내기) |
| 데이터 | SQLite (직접 감싼 래퍼, 컬럼 추가식 마이그레이션) |
| AI | Google Gemini (프레임 태깅·질의 확장·장면 구성), Lyria (음악 생성), Claude (사용자 키 옵션) |
| 백엔드 | TypeScript, Vercel 서버리스, Upstash Redis |
| 결제·보안 | StoreKit 2 인앱결제, App Store Server Library 영수증 검증, App Attest |
| 플랫폼 | macOS 주력, 같은 코어로 iOS/iPadOS 빌드 (샌드박스 + security-scoped bookmark) |
| 테스트·배포 | XCTest(400개 이상), XCUITest E2E, Vitest, ffmpeg 기반 CLI e2e, XcodeGen, fastlane |
| 프로토타입 | Python (표준 라이브러리만) + ffmpeg |

## 기술적으로 신경 쓴 부분

- **Python 프로토타입 → Swift 재작성 + 정답 데이터 비교 테스트**: 먼저 Python으로 빠르게 검증한 뒤, 그 출력을 "정답 데이터(golden)"로 만들어 Swift 코드가 글자 단위로 같은 결과를 내는지 자동 검증했습니다. 재작성 과정에서 로직이 달라지는 걸 막았습니다.
- **UI 없는 코어 라이브러리 분리**: 검색·태깅·DB·조립 로직을 SwiftPM 라이브러리로 떼어 내서, macOS 앱·iOS 앱·CLI 도구가 같은 코드를 씁니다(Swift 약 1.8만 줄).
- **크레딧 프록시 설계**: 앱에 API 키를 넣지 않고 서버가 대신 AI를 호출합니다. 인앱결제 검증, 크레딧 차감·환불, App Attest로 정품 앱 확인까지 처리하고, 프레임 이미지는 서버에 저장하거나 로그로 남기지 않습니다. AI 모델은 서버 설정만 바꾸면 교체되어 앱을 다시 배포할 필요가 없습니다.
- **비용 기반 가격 설계**: 토큰 대신 "영상 시간" 단위로 원가를 계산하고, 모델별 비용을 비교해 기본 모델을 고르고, 크레딧 팩 가격(원가의 약 3배)을 정했습니다. 구독 없이 1회 구매 + 크레딧 충전 방식입니다.
- **긴 작업의 안정성**: 영상별로 결과를 바로 DB에 저장해서 중간에 끊겨도 이어서 할 수 있고, 이미 처리한 영상은 건너뜁니다. 동시 처리 개수는 응답 속도를 보고 자동으로 조절합니다.
- **프라이버시 우선**: 원본 영상은 기기 밖으로 나가지 않고, 줄인 프레임 이미지만 태깅할 때 전송합니다.

## 현재 상태

TestFlight 베타 배포 중(빌드 14), Mac App Store 출시 준비 중입니다.
<!-- /lang:ko -->
