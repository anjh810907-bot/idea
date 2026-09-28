import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { buildExpertCodingPrompt, buildRevisionPrompt } from './utils/promptGenerator';

dotenv.config();

const app = express();

app.use(express.json());

// Enable CORS for API requests
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Lazy-initialized Gemini client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

/**
 * Resilient Gemini caller with exponential backoff retry and alternate model failover
 * for handling temporary high demand spikes (503 / 429) gracefully.
 */
async function callGeminiWithRetry(
  ai: GoogleGenAI,
  promptConfig: {
    systemInstruction?: string;
    contents: string;
    responseMimeType?: string;
    temperature?: number;
  },
  maxRetries = 2
): Promise<string> {
  const models = ['gemini-3.8-flash', 'gemini-flash-latest'];
  let lastError: any;

  for (const model of models) {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: promptConfig.contents,
          config: {
            ...(promptConfig.systemInstruction ? { systemInstruction: promptConfig.systemInstruction } : {}),
            ...(promptConfig.responseMimeType ? { responseMimeType: promptConfig.responseMimeType } : {}),
            ...(typeof promptConfig.temperature === 'number' ? { temperature: promptConfig.temperature } : {}),
          },
        });
        return response.text || '';
      } catch (err: any) {
        lastError = err;
        const status = err?.status || err?.code || (err?.error && err.error.code);
        const message = String(err?.message || '');
        const isTransient =
          status === 503 ||
          status === 429 ||
          message.includes('503') ||
          message.includes('429') ||
          message.includes('high demand') ||
          message.includes('UNAVAILABLE') ||
          message.includes('RESOURCE_EXHAUSTED');

        if (isTransient) {
          if (attempt < maxRetries) {
            const delay = (attempt + 1) * 800;
            console.warn(`[Gemini API] Temporary spike on ${model} (attempt ${attempt + 1}/${maxRetries}), retrying in ${delay}ms...`);
            await new Promise((resolve) => setTimeout(resolve, delay));
            continue;
          }
          console.warn(`[Gemini API] Model ${model} is experiencing temporary high demand, trying next model or fallback...`);
          break;
        } else {
          break;
        }
      }
    }
  }

  throw lastError;
}

// Memory submissions fallback
interface StudentSubmission {
  id: string;
  studentNumber: string;
  shareUrl: string;
  studentName?: string;
  appName?: string;
  submittedAt: string;
  syncedToGoogleSheet: boolean;
}

const memorySubmissions: StudentSubmission[] = [];

// Create API Router to handle both `/api/*` and direct routes
const apiRouter = express.Router();

// 1. Health check & API status
apiRouter.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

apiRouter.get('/gemini/status', (req, res) => {
  const key = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  const hasKey = Boolean(key && key.length > 5);
  res.json({
    available: true,
    hasKey,
    model: 'gemini-3.8-flash',
    message: hasKey
      ? 'Gemini 3.8 Flash AI 엔진이 활성화되어 있습니다.'
      : 'API Key 미설정 시에도 내장된 스마트 템플릿 엔진으로 고품질 프롬프트를 자동 생성합니다.',
  });
});

// 2. Generate master prompt using Gemini with seamless fallback
apiRouter.post('/gemini/generate-prompt', async (req, res) => {
  const { blueprint } = req.body;
  if (!blueprint) {
    return res.status(400).json({ error: '블루프린트 데이터가 필요합니다.' });
  }

  const ai = getGeminiClient();
  if (ai) {
    try {
      const systemInstruction = `당신은 학생(어린이/청소년)을 위한 감성적이고 직관적인 웹앱 기획 전문가이자, Google AI Studio (구글 AI 스튜디오)에 최적화된 프롬프트를 제작하는 수석 풀스택 웹 개발자입니다.
반드시 지켜야 할 규칙:
1. 대상 사용자를 지칭할 때는 절대 '초등학생'이라는 단어를 쓰지 말고, 항상 '학생', '친구들', '청소년' 등의 친근하고 포용적인 단어만 사용하십시오.
2. 기획된 내용(목적, 대상, 16가지 중 선택된 기능과 세부 규칙, 화면 흐름, 마스코트 캐릭터와 응원 대사, 킬러 아이디어, 테마 색상)을 모두 반영하여, Google AI Studio에서 한 번에 완성형 코드를 출력할 수 있도록 정밀하고 구체적인 지시서를 마크다운 형식으로 작성하십시오.
3. 기술 스택은 Vite, React, TypeScript, Tailwind CSS, Lucide React 아이콘, LocalStorage를 기본으로 명시하십시오.`;

      const promptText = `아래 학생이 작성한 10단계 웹앱 기획 블루프린트를 기반으로, Google AI Studio(구글 AI 스튜디오)에 바로 복사하여 완성형 웹앱을 만들 수 있는 전문가 수준의 상세 프롬프트를 작성해 주세요.

[기획 블루프린트 데이터]:
${JSON.stringify(blueprint, null, 2)}

[요구 결과 형식]:
- # [AI 코딩 지시서] 앱 이름 및 슬로건
- 1. 프로젝트 개요 & 학생 눈높이 목적
- 2. 디자인 시스템, 파스텔 컬러, 마스코트 인터랙션(${blueprint.mascot?.name || '또리'} 캐릭터의 대사 및 역할)
- 3. 주요 화면 구성 및 사용자 흐름
- 4. 핵심 기능과 세부 동작 규칙(사용자가 입력한 세부 설정 질문 답변 반영)
- 5. 킬러 아이디어 및 축하/보상 연출 (파티클, 폭죽, 소리 등)
- 6. 기술 사양 (React, Tailwind, LocalStorage 데이터 영속성)
- 7. AI 코딩 도구를 향한 완성도 요구 가이드`;

      const generatedText = await callGeminiWithRetry(ai, {
        systemInstruction,
        contents: promptText,
        temperature: 0.7,
      });

      if (generatedText && generatedText.trim().length > 50) {
        return res.json({ prompt: generatedText, source: 'gemini' });
      }
    } catch (err: any) {
      console.warn('[Gemini Prompt Generator] High demand or transient spike, safely falling back to intelligent template engine.');
    }
  }

  // Resilient fallback (always succeeds with 200 OK)
  const fallback = buildExpertCodingPrompt(blueprint);
  res.json({
    prompt: fallback,
    source: 'fallback',
    notice: '스마트 기획 엔진으로 최적화된 프롬프트를 생성했습니다.',
  });
});

// 3. Recommend screens based on blueprint
apiRouter.post('/gemini/recommend-screens', async (req, res) => {
  const { blueprint } = req.body;
  const ai = getGeminiClient();

  if (ai) {
    try {
      const contents = `학생이 기획 중인 아래 앱 아이디어와 기능을 분석하여, 가장 직관적이고 재미있는 화면 4~5개를 이모지와 함께 한 줄 이름 배열로 추천해 주세요.
절대 '초등학생'이라는 단어를 쓰지 말고 '학생'을 기준으로 하세요.
아이디어: ${blueprint?.ideaText || '학생용 앱'}
선택 기능: ${(blueprint?.features || []).join(', ')}

반드시 다음과 같은 JSON 문자열 형식만 출력하세요:
["🏠 메인 홈 화면", "🎮 핵심 플레이 화면", "🎉 결과 & 보상 화면", "📊 나의 성장 기록"]`;

      const generatedText = await callGeminiWithRetry(ai, {
        contents,
        responseMimeType: 'application/json',
      });

      const parsed = JSON.parse(generatedText.trim() || '[]');
      if (Array.isArray(parsed) && parsed.length > 0) {
        return res.json({ screens: parsed, source: 'gemini' });
      }
    } catch (err: any) {
      console.warn('[Gemini Recommend Screens] High demand or transient spike, using curated smart recommendations.');
    }
  }

  const hasGame = blueprint?.features?.some((f: string) => ['quiz', 'score', 'pet-grow', 'lucky-draw'].includes(f));
  const hasTime = blueprint?.features?.some((f: string) => ['timer'].includes(f));
  const hasTodo = blueprint?.features?.some((f: string) => ['todo', 'daily-mission'].includes(f));

  const screens: string[] = ['🏠 반가운 홈 대시보드'];
  if (hasGame) screens.push('🎮 신나는 플레이 & 퀴즈 화면');
  if (hasTime) screens.push('⏱️ 몰입 집중 타이머 화면');
  if (hasTodo) screens.push('📋 오늘의 미션 체크리스트 화면');
  screens.push('🏆 명예의 전당 & 뱃지 보관함');
  screens.push('⚙️ 마스코트 대화 & 환경 설정');

  res.json({ screens, source: 'fallback' });
});

// 4. Recommend 3 catchy names
apiRouter.post('/gemini/recommend-names', async (req, res) => {
  const { blueprint } = req.body;
  const ai = getGeminiClient();

  if (ai) {
    try {
      const contents = `학생을 위한 웹앱 기획안입니다. 학생들의 마음에 쏙 드는 귀엽고 개성 넘치며 직관적인 앱 이름 3개와 슬로건, 추천 이유를 제안해 주세요.
절대 '초등학생'이라는 단어는 사용하지 마세요.
아이디어: ${blueprint?.ideaText || '학생용 웹앱'}
기능: ${(blueprint?.features || []).join(', ')}
마스코트: ${blueprint?.mascot?.name || '친구'} (${blueprint?.mascot?.animal || '캐릭터'})

반드시 아래 JSON 형식으로만 응답해 주세요:
[
  { "name": "앱 이름1", "slogan": "통통 튀는 한 줄 슬로건1", "reason": "추천 이유1" },
  { "name": "앱 이름2", "slogan": "통통 튀는 한 줄 슬로건2", "reason": "추천 이유2" },
  { "name": "앱 이름3", "slogan": "통통 튀는 한 줄 슬로건3", "reason": "추천 이유3" }
]`;

      const generatedText = await callGeminiWithRetry(ai, {
        contents,
        responseMimeType: 'application/json',
      });

      const parsed = JSON.parse(generatedText.trim() || '[]');
      if (Array.isArray(parsed) && parsed.length > 0) {
        return res.json({ names: parsed, source: 'gemini' });
      }
    } catch (err: any) {
      console.warn('[Gemini Recommend Names] High demand or transient spike, using curated smart recommendations.');
    }
  }

  // Curated smart fallback tailored to student concepts
  const mascot = blueprint?.mascot?.name || '또리';
  const hasTimer = blueprint?.features?.includes('timer');
  const hasQuiz = blueprint?.features?.includes('quiz');

  let fallbackNames = [
    { name: '아이디어 톡톡', slogan: '내 생각이 현실이 되는 마법의 앱', reason: '학생의 창의력과 상상력을 돋보이게 해줘요.' },
    { name: `${mascot}의 하루`, slogan: '마스코트와 함께 만드는 신나는 매일', reason: '선택한 귀여운 캐릭터와 일체감이 뛰어나요.' },
    { name: '스마트 포켓', slogan: '언제 어디서나 꺼내 쓰는 나만의 도구함', reason: '다양한 편리 기능이 주머니 속에 쏙 들어간 느낌이에요.' },
  ];

  if (hasTimer) {
    fallbackNames = [
      { name: '도토리 뽀모', slogan: '다람쥐와 함께 25분 뚝딱 집중하기', reason: '시간 관리와 귀여운 보상이 돋보여요.' },
      { name: '집중 퐁퐁', slogan: '재미있게 오르는 나의 집중력 지수', reason: '친근한 어감으로 매일 켜고 싶은 이름이에요.' },
      { name: '타임 메이트', slogan: '학생을 위한 든든한 하루 시간표 친구', reason: '직관적이고 신뢰감을 주는 이름이에요.' },
    ];
  } else if (hasQuiz) {
    fallbackNames = [
      { name: '퀴즈 팡팡', slogan: '문제를 풀 때마다 터지는 지식 폭죽', reason: '신나고 박진감 넘치는 퀴즈 게임 느낌을 줘요.' },
      { name: '지식 마스터', slogan: '오늘의 퀴즈 챔피언은 바로 나!', reason: '성취감과 명예의 전당 콘셉트에 잘 어울려요.' },
      { name: '브레인 스파크', slogan: '반짝이는 아이디어와 번뜩이는 상식', reason: '호기심 많은 학생들에게 인기가 많은 어감이에요.' },
    ];
  }

  res.json({ names: fallbackNames, source: 'fallback' });
});

// 5. Revision prompt for post-generation debugging
apiRouter.post('/gemini/revision-prompt', async (req, res) => {
  const { blueprint, revision } = req.body;
  const ai = getGeminiClient();

  if (ai) {
    try {
      const contents = `학생이 웹앱을 만든 후 테스트하다가 다음과 같은 문제 또는 변경 요청을 발견했습니다.
이를 AI 코딩 도구에 곧바로 붙여넣어 수정할 수 있는 정밀한 '수정 지시 프롬프트'를 마크다운으로 작성해 주세요.
절대 '초등학생'이라는 단어는 쓰지 마세요.

기존 앱 정보:
- 앱 이름: ${blueprint?.appName || '학생 웹앱'}
- 마스코트: ${blueprint?.mascot?.name || '또리'}
- 문제 유형: ${revision?.category || '일반'}
- 학생의 문제 설명: "${revision?.problemDescription || ''}"
- 구체적 희망 사항: "${revision?.specificRequest || ''}"`;

      const generatedText = await callGeminiWithRetry(ai, {
        contents,
      });

      if (generatedText && generatedText.trim().length > 30) {
        return res.json({ prompt: generatedText, source: 'gemini' });
      }
    } catch (err: any) {
      console.warn('[Gemini Revision Prompt] High demand or transient spike, using curated smart template.');
    }
  }

  const prompt = buildRevisionPrompt(blueprint, revision);
  res.json({ prompt, source: 'fallback' });
});

// 6. Share submission endpoint
apiRouter.post('/share-submission', async (req, res) => {
  try {
    const { studentNumber, shareUrl, studentName, appName, customScriptUrl } = req.body;
    if (!studentNumber || !shareUrl) {
      return res.status(400).json({ error: '번호와 공유링크를 모두 입력해 주세요.' });
    }

    const scriptUrl = customScriptUrl || process.env.GOOGLE_SHEET_WEBAPP_URL || process.env.VITE_GOOGLE_SHEET_WEBAPP_URL;
    let synced = false;
    let syncError: string | null = null;

    if (scriptUrl && typeof scriptUrl === 'string' && scriptUrl.startsWith('http')) {
      try {
        const fetchRes = await fetch(scriptUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            number: studentNumber,
            studentNumber,
            link: shareUrl,
            shareUrl,
            studentName: studentName || '',
            appName: appName || '',
            timestamp: new Date().toISOString(),
          }),
        });
        if (fetchRes.ok) {
          synced = true;
        } else {
          syncError = `HTTP ${fetchRes.status}`;
        }
      } catch (err: any) {
        syncError = err.message || 'Apps Script 호출 실패';
        console.warn('Google Sheet WebApp sync failed:', err);
      }
    }

    const newRecord: StudentSubmission = {
      id: String(Date.now()),
      studentNumber: String(studentNumber).trim(),
      shareUrl: String(shareUrl).trim(),
      studentName: studentName?.trim(),
      appName: appName?.trim(),
      submittedAt: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      syncedToGoogleSheet: synced,
    };
    memorySubmissions.unshift(newRecord);

    res.json({
      success: true,
      submission: newRecord,
      syncedToGoogleSheet: synced,
      hasScriptConfigured: Boolean(scriptUrl && scriptUrl.startsWith('http')),
      syncError,
      message: synced
        ? '구글 스프레드시트에 성공적으로 등록되었습니다!'
        : '작품 정보가 기록되었습니다. (구글 시트 연동 URL 설정 시 즉시 시트에 자동 삽입됩니다)',
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || '공유 제출 처리 실패' });
  }
});

apiRouter.get('/share-submissions', (req, res) => {
  const scriptUrl = process.env.GOOGLE_SHEET_WEBAPP_URL || process.env.VITE_GOOGLE_SHEET_WEBAPP_URL;
  res.json({
    submissions: memorySubmissions,
    hasScriptConfigured: Boolean(scriptUrl && scriptUrl.startsWith('http')),
  });
});

// Support both `/api/*` and direct `/...` routes so Vercel rewrites work seamlessly
app.use('/api', apiRouter);
app.use('/', apiRouter);

export default app;
