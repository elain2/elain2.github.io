**Kayoung Lee**

Senior iOS Engineer  ·  Swift · SwiftUI · UIKit · AVFoundation

elain202@gmail.com  ·  Portfolio: https://elain2.github.io/?company=apple-appstore

**PROFESSIONAL SUMMARY**

iOS engineer with 7+ years building user-facing features at scale for LY Corporation (LINE), a platform serving hundreds of millions of users across Asia. Led iOS development for LINE AI and Voom Camera — shipping complex, high-quality UIs powered by Swift, Combine, AVFoundation, and SwiftUI. Deep expertise in asynchronous programming, networking protocols, and Apple's latest frameworks. Proven ability to work cross-functionally with design, product, OS, and services teams to deliver polished experiences on time. Passionate about crafting the kind of beautifully crafted, detail-oriented interfaces that Apple products are known for.

**WORK EXPERIENCE**

**LY Corporation (LINE / Yahoo Japan)**  · Seoul, Korea	2019 – Present

**iOS Project Lead, LINE AI**  — AI Assistant in LINE Messenger   2025 – Present

▸  Architected the iOS client module for LINE's in-app AI assistant, handling response streaming, conversation state, and network/cache optimisation for a chat surface with hundreds of millions of DAUs.

▸  Implemented URLSession-based Server-Sent Events (SSE) streaming to render partial AI responses in real time, significantly reducing perceived latency and improving conversational feel.

▸  Developed a Markdown Parser and an NSAttributedString-based Renderer to accurately display Markdown-formatted responses from the LLM.

▸  Defined robust error, retry, and cancellation policies for unreliable network conditions; coordinated API contract alignment with backend engineers and product managers.

▸  Led LINE AI Dev (iOS); concurrently serving on the LINE AI Task Force since August 2025\.

*Swift · Combine · URLSession · Server-Sent Events · MVVM · TLA (The LINE Architecture) · Coordinator pattern*

**Team Lead, LINE Voom Camera (iOS)**  — Short-Form Video, Global (JP/TW/TH)   2023 – 2026

▸  Owned VoomCameraViewController — the AVFoundation-based capture session, live preview rendering, and device-specific format/resolution selection for LINE's global short-form video product.

▸  Designed real-time preview effects pipeline using Metal and Core Image; implemented camera permission flows and edge-case exception handling.

▸  Architected the Storyboard data model — a single, serialisable source of truth for the full editing state (clips, music, dubbing, stickers, filters, volume) — with NSCoding and schema versioning.

▸  Built VOOMVideoComposer for multi-track video/audio composition using AVMutableComposition and AVAssetExportSession.

▸  Implemented draft persistence (LightsDraft, DraftKeyManager) and VOOM Assets CDN template download/metadata management.

▸  Ensured thread safety between background and main queues using GCD and OperationQueue; optimised memory for large multi-track edits.

*Swift · Objective-C · AVFoundation · CoreMedia · Metal · Core Image · AVMutableComposition · NSSecureCoding · GCD · OperationQueue · FileManager*

**Vision Pro — Immersive Memory**  — visionOS · LY HACK DAY 2024 Communication Award

▸  Designed and built a visionOS experience that lets LINE users relive shared memories in a 3D gallery using Apple Vision Pro; presented at LY Corporation's internal Hack Day in Japan.

▸  Placed photos in a RealityKit 3D scene with gaze- and gesture-driven interaction; integrated PhotoKit and AVFoundation for media asset handling.

▸  Won the Communication Award — recognised for its viability for immediate integration into the LINE service.

*Swift · SwiftUI · RealityKit · ARKit · PhotoKit · visionOS spatial UI*

**Internal Library — KeyBasedObjectManager**  2023

▸  Designed a Swift/Objective-C runtime library for key-based object lifecycle management — preventing duplicate creation and memory leaks of heavyweight shared resources (AI models, camera sessions).

▸  Used NSMapTable weak-reference storage with OSLock for thread safety; covered all behaviour with XCTest unit tests.

▸  Now a shared library used by Voom Camera.

*Swift · Objective-C runtime · NSMapTable · NSHashTable · OSLock · XCTest*

**iOS Engineer, LINE Avatar & Avatar Customisation**  2019 – 2022

▸  Launched LINE Avatar for iOS in 2019 — a personalised avatar feature shipped to global users.

▸  Introduced the MVVM architecture pattern and redesigned the data model for the Avatar Customisation module in 2020–2021, improving testability and reducing UI coupling.

*Swift · Objective-C · UIKit · MVVM*

**TECHNICAL SKILLS**

**Languages:** Swift (primary) · Objective-C · JavaScript / TypeScript  · C++/C  · Python (familiar)

**UI Frameworks:** UIKit · SwiftUI · RealityKit · ARKit · visionOS Spatial UI

**Media & Vision:** AVFoundation · CoreMedia · Metal · Core Image · PhotoKit

**Networking:** URLSession · Server-Sent Events (SSE) · REST API design & contract alignment

**Concurrency:** Combine · GCD · OperationQueue · async/await

**Architecture:** MVVM · Coordinator · TLA (The Layered Architecture) · Modular component design

**Data & Storage:** NSSecureCoding · NSMapTable · FileManager · UserDefaults · CDN integration

**Testing:** XCTest · Unit testing · Concurrency-safe test design

**Tools:** Xcode · Instruments · Git · CI/CD pipelines

**EDUCATION**

**Bachelor of Science in Computer Science and Engineering**  — Inha University, Korea · 2015 – 2019

▸  Relevant coursework: data structures, operating systems, computer graphics, software engineering

▸  Exchange student at the IT University of Copenhagen (2016)

**ADDITIONAL**

▸  WWDC 2023 — featured speaker on YouTube channels covering Apple's developer announcements (reached thousands of Korean iOS developers)

▸  PoC with LLM and launching on iOS environment  — shortform AI generator PoC; profile picture AI recommendation PoC

▸  NEXT LINE Competition (2022) — LINE Sticker SDK category