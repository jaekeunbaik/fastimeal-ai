# FastiMeal AI (패스티밀 AI) 🥑⚡
> **AI 기반 간헐적 단식 & 멀티모달 식단 관리 올인원 모바일 앱 (Google Play Ready)**

![FastiMeal AI Banner](https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80)

---

## 🌟 주요 기능 (PRD 100% 반영)

1. **신체 대사 5단계 시각화 단식 타이머 (Metabolic Ring Timer)**
   - `0~2시간`: 혈당 상승 및 소화기 활동
   - `2~8시간`: 혈당 정상화 및 인슐린 수치 저하
   - `8~12시간`: 글리코겐 소진 및 소화기 휴식
   - `12~16시간`: 지방 연소 모드 (**Ketosis** 진입) 🔥
   - `16시간+`: 세포 정화 및 자가포식 (**Autophagy**) 활성화 ✨
   - 16:8, 18:6, 14:10 및 커스텀 인터벌 시간대 지원
   - 남은 시간 ↔ 경과 시간 원터치 토글 및 실시간 프로그레스 링 애니메이션

2. **멀티모달 Vision AI 식단 분석 엔진 (AI Core)**
   - 사진 1장으로 메뉴 식별, 칼로리, 탄단지, 혈당 스파이크 위험도(`LOW`/`MEDIUM`/`HIGH`) 자동 판별
   - **단식 중 섭취 감지 시**: "공복 깨짐 주의" 경고 및 타이머 리셋/식사창 전환 가이드 반환
   - **식사창 섭취 시**: 양질의 영양소 칭찬 및 단순당 주의 코칭 피드백
   - Google Gemini 1.5 Flash & OpenAI GPT-4o Vision API 연동 및 지능형 시뮬레이션 모드 지원

3. **사진 중심 타임라인 피드 & 수분 섭취 트래커**
   - 타임스탬프 순 일일 식단 사진 피드 및 상세 영양 카드
   - 250ml / 500ml 원터치 수분 트래커 및 물방울 프로그레스 게이지

4. **1:1 AI 다이어티션 코치 채팅 & 대사 리포트**
   - 현재 대사 단계 기반 실시간 맞춤형 Q&A 피드백
   - 탄•단•지 매크로 영양소 비율 및 일일 칼로리 예산 대시보드

---

## 🚀 로컬 실행 방법

```bash
# 디렉토리 이동
cd c:/ethan/git/fastimeal-ai

# 개발 서버 실행
npm run dev
```

브라우저에서 `http://localhost:5173`으로 접속하여 즉시 모든 기능을 체험할 수 있습니다.

---

## 📱 Google Play Store (Android) 배포 방법

본 프로젝트는 **Capacitor Android** 네이티브 패키징이 완비되어 있어 Android Studio에서 즉시 `.aab` (Android App Bundle)을 빌드하여 구글 플레이 콘솔에 업로드할 수 있습니다.

### 1. 최신 빌드 및 네이티브 동기화
```bash
npm run build
npx cap sync android
```

### 2. Android Studio 프로젝트 열기
```bash
npx cap open android
```

### 3. Google Play Store용 서명된 Bundle 생성
1. Android Studio 상단 메뉴: **Build** > **Generate Signed Bundle / APK...** 선택
2. **Android App Bundle (.aab)** 선택 후 `Next`
3. Keystore(키스토어) 생성 또는 기존 키 지정 후 비밀번호 입력
4. Build Variant를 `release`로 선택 후 **Create** 클릭
5. 생성된 `release/app-release.aab` 파일을 [Google Play Console](https://play.google.com/console) 프로덕션 또는 내부 테스트 트랙에 업로드!

---

## 🛠️ 기술 스택
- **Core**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 + Glassmorphism Dark UI System
- **Mobile Native**: Capacitor Core & Android (@capacitor/android)
- **Icons & Effects**: Lucide React + Canvas Confetti
- **AI Service**: Google Gemini Flash / OpenAI GPT-4o Vision
