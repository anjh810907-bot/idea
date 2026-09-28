import { AppBlueprint, RevisionRequest } from '../types';
import { buildExpertCodingPrompt, buildRevisionPrompt } from './promptGenerator';

/**
 * Checks server API status
 */
export async function checkGeminiStatus(): Promise<{ available: boolean; hasKey: boolean; message: string }> {
  try {
    const res = await fetch('/api/gemini/status', { method: 'GET' });
    if (!res.ok) {
      return { available: false, hasKey: false, message: '서버 연결 상태 확인 필요' };
    }
    const data = await res.json();
    return data;
  } catch {
    return { available: false, hasKey: false, message: '오프라인 스마트 생성 모드로 동작합니다.' };
  }
}

/**
 * Generates the full master AI prompt via Gemini API or resilient fallback
 */
export async function generateFullAppPrompt(blueprint: AppBlueprint): Promise<{ prompt: string; source: 'gemini' | 'fallback'; note?: string }> {
  try {
    const res = await fetch('/api/gemini/generate-prompt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ blueprint }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.prompt && data.prompt.length > 50) {
        return { prompt: data.prompt, source: 'gemini' };
      }
    }
  } catch (err) {
    console.warn('Gemini API call failed, switching to resilient fallback generator:', err);
  }

  // Resilient fallback
  const fallback = buildExpertCodingPrompt(blueprint);
  return {
    prompt: fallback,
    source: 'fallback',
    note: '스마트 템플릿 엔진을 통해 완성도 높은 오프라인 프롬프트를 생성했습니다.',
  };
}

/**
 * Recommends screens based on student idea & features
 */
export async function recommendScreensWithAI(blueprint: Partial<AppBlueprint>): Promise<string[]> {
  try {
    const res = await fetch('/api/gemini/recommend-screens', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ blueprint }),
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.screens) && data.screens.length > 0) {
        return data.screens;
      }
    }
  } catch (err) {
    console.warn('AI screen recommendation fallback:', err);
  }

  // Fallback intelligent screen flows
  const hasGame = blueprint.features?.some(f => ['quiz', 'score', 'pet-grow', 'lucky-draw'].includes(f));
  const hasTime = blueprint.features?.some(f => ['timer'].includes(f));
  const hasTodo = blueprint.features?.some(f => ['todo', 'daily-mission'].includes(f));

  const screens: string[] = ['🏠 반가운 홈 대시보드'];
  if (hasGame) screens.push('🎮 신나는 플레이 & 퀴즈 화면');
  if (hasTime) screens.push('⏱️ 몰입 집중 타이머 화면');
  if (hasTodo) screens.push('📋 오늘의 미션 체크리스트 화면');
  screens.push('🏆 명예의 전당 & 뱃지 보관함');
  screens.push('⚙️ 마스코트 대화 & 환경 설정');

  return screens;
}

/**
 * Recommends 3 catchy names with slogans based on the student blueprint
 */
export async function recommendNamesWithAI(blueprint: Partial<AppBlueprint>): Promise<Array<{ name: string; slogan: string; reason: string }>> {
  try {
    const res = await fetch('/api/gemini/recommend-names', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ blueprint }),
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.names) && data.names.length > 0) {
        return data.names;
      }
    }
  } catch (err) {
    console.warn('AI name recommendation fallback:', err);
  }

  // Fallback name options tailored to student concepts
  const mascot = blueprint.mascot?.name || '또리';
  const idea = blueprint.ideaText || '공부와 놀이';

  if (blueprint.features?.includes('timer')) {
    return [
      { name: '도토리 뽀모', slogan: '다람쥐와 함께 25분 뚝딱 집중하기', reason: '시간 관리와 귀여운 도토리 보상이 돋보여요.' },
      { name: '집중 퐁퐁', slogan: '재미있게 오르는 나의 집중력 지수', reason: '친근한 어감으로 매일 켜고 싶은 이름이에요.' },
      { name: '타임 메이트', slogan: '학생을 위한 든든한 하루 시간표 친구', reason: '직관적이고 신뢰감을 주는 이름이에요.' },
    ];
  }

  if (blueprint.features?.includes('quiz')) {
    return [
      { name: '퀴즈 팡팡', slogan: '문제를 풀 때마다 터지는 지식 폭죽', reason: '신나고 박진감 넘치는 퀴즈 게임 느낌을 줘요.' },
      { name: '지식 마스터', slogan: '오늘의 퀴즈 챔피언은 바로 나!', reason: '성취감과 명예의 전당 콘셉트에 잘 어울려요.' },
      { name: '브레인 스파크', slogan: '반짝이는 아이디어와 번뜩이는 상식', reason: '호기심 많은 학생들에게 인기가 많은 어감이에요.' },
    ];
  }

  return [
    { name: '아이디어 톡톡', slogan: '내 생각이 현실이 되는 마법의 앱', reason: '학생의 창의력과 상상력을 돋보이게 해줘요.' },
    { name: `${mascot}의 하루`, slogan: '마스코트와 함께 만드는 신나는 매일', reason: '선택한 귀여운 마스코트 캐릭터와 일체감이 뛰어나요.' },
    { name: '스마트 포켓', slogan: '언제 어디서나 꺼내 쓰는 나만의 도구함', reason: '다양한 편리 기능이 주머니 속에 쏙 들어간 느낌이에요.' },
  ];
}

/**
 * Generates revision prompt
 */
export async function generateRevisionPromptWithAI(
  blueprint: AppBlueprint,
  revision: RevisionRequest
): Promise<string> {
  try {
    const res = await fetch('/api/gemini/revision-prompt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ blueprint, revision }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.prompt) {
        return data.prompt;
      }
    }
  } catch (err) {
    console.warn('Gemini revision prompt fallback:', err);
  }

  return buildRevisionPrompt(blueprint, revision);
}
