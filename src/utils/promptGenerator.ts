import { AppBlueprint, RevisionRequest } from '../types';
import { FEATURE_CONFIGS, MASCOTS } from '../data/wizardData';

/**
 * Builds an offline, high-precision, production-ready AI coding prompt.
 * Strictly adheres to the constraint: uses "학생" instead of "초등학생".
 */
export function buildExpertCodingPrompt(blueprint: AppBlueprint): string {
  const appName = blueprint.appName.trim() || '스마트 학생 웹앱';
  const appSlogan = blueprint.appSlogan.trim() || '학생을 위한 즐겁고 똑똑한 웹 어플리케이션';
  const mascot = blueprint.mascot || MASCOTS[0];
  const idea = blueprint.ideaText.trim() || blueprint.selectedIdeaChip || '학생을 위한 유용한 웹 서비스';
  const purposes = blueprint.purposes.length > 0 ? blueprint.purposes.join(', ') : '공부 및 학습, 일상 편의';
  const targetUsers = blueprint.targetUsers.length > 0 ? blueprint.targetUsers.join(', ') : '학생, 친구, 선생님';
  const specialIdea = blueprint.specialIdea.trim() || blueprint.selectedSpecialIdeaChip || '미션 달성 시 마스코트 축하 연출';

  // Format selected features and their Step 5 detailed rules
  const featureSections = blueprint.features.map((featId, idx) => {
    const config = FEATURE_CONFIGS.find((f) => f.id === featId);
    const featName = config ? config.name : featId;
    const details = blueprint.featureDetails[featId] || {};
    const detailList = Object.entries(details)
      .map(([k, v]) => `    - **${k}**: ${v}`)
      .join('\n');

    return `### ${idx + 1}. ${featName}
  - **기능 개요**: ${config ? config.description : '핵심 기능'}
  - **세부 설정 및 동작 규칙**:
${detailList || '    - 표준 친화적 인터랙션 및 즉시 반응형 인터페이스 적용'}`;
  }).join('\n\n');

  // Format screen flow
  const screens = (blueprint.screens && blueprint.screens.length > 0)
    ? blueprint.screens.join(', ')
    : '메인 홈 화면, 기능 실행 화면, 결과 & 축하 보상 화면, 기록/저장 보관함';

  const aiSuggestions = (blueprint.aiScreenSuggestions && blueprint.aiScreenSuggestions.length > 0)
    ? `\n  - **추천 화면 흐름**: ${blueprint.aiScreenSuggestions.join(' ➔ ')}`
    : '';

  const targetDirective = 'Google AI Studio(Build) 환경에서 실행 가능한 최신 React, TypeScript, Tailwind CSS, Lucide React 아이콘 기반의 모듈화된 완성형 웹 애플리케이션 코드로 작성해 줘.';

  return `# [AI 코딩 지시서] ${appName} (${appSlogan})

> **개발 환경**: Google AI Studio (Build) 웹 애플리케이션 개발 전용
> **목표**: 학생 눈높이에 맞춘 쉽고 직관적이며 재미있는 고품질 웹 애플리케이션 개발
> **도구 가이드**: ${targetDirective}

---

## 1. 프로젝트 개요 & 기획 배경
- **앱 이름**: ${appName}
- **슬로건**: ${appSlogan}
- **기획 아이디어 원문**:
  "${idea}"
- **앱의 목적**: ${purposes} ${blueprint.customPurpose ? `(추가: ${blueprint.customPurpose})` : ''}
- **주요 대상 사용자**: ${targetUsers} ${blueprint.customTargetUser ? `(추가: ${blueprint.customTargetUser})` : ''}

---

## 2. 디자인 시스템 & 마스코트 인터랙션
- **비주얼 스타일**: ${blueprint.designStyle || '둥글둥글 귀여운 파스텔 스타일 (모서리 rounded-2xl, 친근한 카드형 레이아웃)'}
- **대표 테마 컬러**: ${blueprint.themeColor || '따뜻한 햇살 옐로우 (#F59E0B) & 파스텔 배경 (#FEF3C7)'}
- **응원 마스코트**:
  - **이름 & 동물**: ${mascot.emoji} ${mascot.name} (${mascot.animal})
  - **대표 응원 대사**: "${mascot.cheerPhrase}"
  - **화면 내 역할**: 상단 헤더 및 중요 이벤트(성공, 완료, 레벨업) 시 말풍선으로 응원 메시지 표시, 클릭 시 통통 튀는 바운스 애니메이션
${blueprint.customDesignNotes ? `- **사용자 디자인 요청**: ${blueprint.customDesignNotes}\n` : ''}
---

## 3. 화면 구성 및 사용자 플로우 (Screens & UX Flow)
- **주요 화면 목록**: ${screens}${aiSuggestions}
${blueprint.screenFlowNotes ? `- **화면 전환 특이사항**: ${blueprint.screenFlowNotes}` : ''}
- **화면 레이아웃 원칙**:
  1. 모바일과 태블릿, PC 화면 모두에서 깨지지 않는 완전한 반응형(Responsive) 레이아웃
  2. 한 화면에 너무 많은 글자를 넣지 않고, 큼직한 아이콘과 버튼(최소 터치 영역 48px 이상)
  3. 현재 진행 상태를 알 수 있는 시각적 게이지 및 명확한 [이전] / [다음] 버튼 지원

---

## 4. 핵심 기능 및 상세 동작 규칙 (Detailed Features)
${featureSections || '기본 인터랙티브 기능 및 로컬 저장소 연동'}

---

## 5. 학생 기획자의 킬러 아이디어 (Delight & Surprise Factor)
🌟 **핵심 재미 요소**:
"${specialIdea}"
- 이 특별한 아이디어가 시각적/청각적으로 생생하게 체감될 수 있도록, 화면 내 파티클 폭죽(Canvas confetti 또는 CSS animation), 마스코트 축하 팝업, 축하 뱃지 획득 효과를 반드시 구현해 줘.

---

## 6. 기술 사양 및 데이터 영속성 요구사항
1. **기술 스택**: React, TypeScript, Tailwind CSS, Lucide React 아이콘
2. **데이터 저장**: \`localStorage\`를 활용하여 웹 브라우저를 새로고침하거나 껐다 켜도 사용자의 진행 상태, 점수, 할 일, 획득한 뱃지 데이터가 안전하게 유지되도록 구현
3. **효과음 & 애니메이션**: 브라우저 Web Audio API 기반의 가벼운 효과음(성공 팡파레, 클릭음)과 무소음 환경을 위한 음소거(Mute) 토글 버튼 제공
4. **접근성 및 안정성**: 학생이 조작하기 쉽도록 쉬운 한국어 안내 메시지 제공, 잘못된 입력 시 친절한 안내 팝업 출력

---

## 7. 개발 실행 요청
위 기획서의 모든 요소(마스코트, 기능 세부 규칙, 킬러 아이디어, 로컬 저장소, 반응형 카드 UI)를 빠짐없이 포함하여, **누락된 모듈이나 TODO 주석 없이 바로 실행 가능한 완성형 코드**를 작성해 주세요.`;
}

/**
 * Generates follow-up revision prompt for testing or fixing bugs in v0/Bolt/Lovable
 */
export function buildRevisionPrompt(
  blueprint: AppBlueprint,
  revision: RevisionRequest
): string {
  const appName = blueprint.appName || '학생 웹앱';
  const categoryMap = {
    ui: '🎨 UI/디자인 수정',
    bug: '🐛 동작 오류 및 버그 해결',
    feature: '✨ 기능 추가 및 규칙 변경',
    speed: '⚡ 사용성 및 반응 속도 개선',
  };

  return `# [AI 코딩 수정 요청서] ${appName} 피드백 및 코드 개선

안녕하세요! 방금 제작해 준 **${appName}** 웹앱을 직접 테스트해 보았습니다.
학생 사용자가 더 편하고 재미있게 사용할 수 있도록 아래의 수정 사항을 즉시 반영해 주세요.

---

## 📌 수정 분야
**${categoryMap[revision.category] || '기능 개선'}**

## 🚨 발견한 문제 또는 변경 희망 사항
"${revision.problemDescription}"

## 🛠️ 구체적인 수정 지시 사항
${revision.specificRequest ? `"${revision.specificRequest}"` : '- 위 문제를 완벽히 해결하고 관련 UI와 애니메이션이 부드럽게 연동되도록 코드를 다듬어 줘.'}

---

## 💡 기존 앱의 핵심 맥락 (유지되어야 할 부분)
- **마스코트**: ${blueprint.mascot ? `${blueprint.mascot.emoji} ${blueprint.mascot.name} (${blueprint.mascot.animal})의 응원 대사 유지` : '기본 캐릭터 응원 인터랙션 유지'}
- **테마 색상**: ${blueprint.themeColor || '파스텔 테마'}
- **데이터 보존**: 기존 localStorage 저장 구조가 깨지지 않도록 호환성 유지
- **사용자 눈높이**: 학생이 이해하기 쉬운 큼직한 버튼과 직관적인 안내 문구 유지

위 수정 사항을 온전히 반영한 **전체 수정 코드 또는 변경된 컴포넌트 코드**를 바로 붙여넣을 수 있도록 작성해 주세요!`;
}
