import { FeatureConfig, MascotConfig } from '../types';

export const IDEA_CHIPS = [
  {
    id: 'lunch-eval',
    title: '🍱 급식 메뉴 건의 & 평가',
    desc: '오늘 먹은 급식 별점 평가와 먹고 싶은 메뉴 건의 및 투표',
    category: '학교 생활',
    fullText: '급식 메뉴 건의 & 평가: 오늘 먹은 급식 메뉴에 별점과 후기를 남기고, 다음 식단에 나왔으면 하는 맛있는 음식을 건의하고 투표하는 웹앱을 만들고 싶어요!',
  },
  {
    id: 'class-chatbot',
    title: '🤖 우리반 문제해결챗봇',
    desc: '학교 생활 고민과 친구 관계 문제를 다정하게 상담해주는 AI 챗봇',
    category: '소통 & AI',
    fullText: '우리반 문제해결챗봇: 친구와의 사소한 갈등이나 공부 고민을 털어놓으면 지혜로운 조언과 따뜻한 위로를 건네주는 우리 반 전용 고민 상담 챗봇을 만들고 싶어요!',
  },
  {
    id: 'focus-timer',
    title: '⏱️ 집중공부 타이머',
    desc: '뽀모도로 공부 시간 측정과 미션 달성 귀여운 보상 시스템',
    category: '학습 & 집중',
    fullText: '집중공부 타이머: 25분 집중하고 5분 쉬는 뽀모도로 타이머와 함께, 공부한 시간만큼 귀여운 캐릭터 도장을 모으고 레벨업하는 타이머 앱을 만들고 싶어요!',
  },
  {
    id: 'role-picker',
    title: '📢 반역할 & 발표자 뽑기',
    desc: '공정하고 재미있는 청소 당번, 1인 1역할, 수업 발표자 랜덤 추첨',
    category: '학급 자치',
    fullText: '반역할 & 발표자 뽑기: 우리 반 1인 1역할 당번과 수업 시간 발표자를 공정하고 흥미진진하게 랜덤으로 쏙쏙 뽑아주는 뽑기 룰렛 웹앱을 만들고 싶어요!',
  },
  {
    id: 'notice-board',
    title: '📋 공지 상황판 : 숙제,준비물알림',
    desc: '오늘 할 일, 내일 챙길 준비물과 숙제를 한눈에 체크하는 게시판',
    category: '알림 & 기록',
    fullText: '공지 상황판 : 숙제,준비물알림: 매일 챙겨야 할 교과서와 준비물, 제출해야 할 숙제를 날짜별로 정리하고 체크리스트로 완료 표시할 수 있는 알림 상황판을 만들고 싶어요!',
  },
  {
    id: 'seat-picker',
    title: '🎲 짝꿍 뽑기 & 자리뽑기',
    desc: '새 학기 새 짝꿍과 교실 책상 자리를 공정하게 정하는 자리 배치기',
    category: '학급 자치',
    fullText: '짝꿍 뽑기 & 자리뽑기: 남녀 짝꿍이나 시야 배려를 고려해 재미있는 애니메이션과 함께 교실 자리를 공정하게 무작위로 배치해주는 자리뽑기 웹앱을 만들고 싶어요!',
  },
];

export const PURPOSES = [
  { id: 'study', label: '📖 공부 및 학습', desc: '더 쉽고 재미있게 공부해요' },
  { id: 'game', label: '🎮 재미있는 놀이와 게임', desc: '친구들과 신나게 즐겨요' },
  { id: 'info', label: '💡 유용한 정보 제공', desc: '꼭 필요한 정보를 한눈에 봐요' },
  { id: 'time', label: '⏰ 알찬 시간 관리', desc: '집중하고 계획적으로 생활해요' },
  { id: 'record', label: '📝 소중한 기록과 일기', desc: '잊지 않고 간직하고 싶어요' },
  { id: 'problem', label: '🛠️ 일상 생활 문제 해결', desc: '불편한 점을 똑똑하게 해결해요' },
  { id: 'creative', label: '🎨 창작과 나만의 취미', desc: '그림이나 글을 자유롭게 표현해요' },
];

export const TARGET_USERS = [
  { id: 'me', label: '나 자신', emoji: '🧑' },
  { id: 'friends', label: '친한 친구들', emoji: '👫' },
  { id: 'students', label: '학생 전체', emoji: '🎒' },
  { id: 'teachers', label: '선생님', emoji: '👩‍🏫' },
  { id: 'family', label: '우리 가족', emoji: '🏡' },
  { id: 'everyone', label: '누구나 쉽게', emoji: '🌍' },
];

export const FEATURE_CONFIGS: FeatureConfig[] = [
  {
    id: 'quiz',
    name: '문제 맞히기 (퀴즈)',
    category: 'game',
    description: 'OX 퀴즈나 4지선다형으로 지식을 시험해요',
    iconName: 'HelpCircle',
    suggestedQuestions: [
      {
        key: 'questionType',
        question: '퀴즈 문제의 형태는 무엇인가요?',
        type: 'select',
        options: ['4지선다 객관식', 'OX 찬반 퀴즈', '직접 단어 입력 주관식', '혼합형'],
        defaultValue: '4지선다 객관식',
      },
      {
        key: 'questionCount',
        question: '한 게임당 몇 문제를 풀까요?',
        type: 'select',
        options: ['5문제', '10문제', '무제한 (틀릴 때까지)'],
        defaultValue: '5문제',
      },
      {
        key: 'timeLimit',
        question: '문제당 제한 시간이 있나요?',
        type: 'select',
        options: ['10초 카운트다운', '15초 카운트다운', '제한 시간 없음'],
        defaultValue: '10초 카운트다운',
      },
    ],
  },
  {
    id: 'timer',
    name: '타이머 / 스톱워치',
    category: 'utility',
    description: '시간을 재거나 집중 시간을 측정해요',
    iconName: 'Clock',
    suggestedQuestions: [
      {
        key: 'timerMode',
        question: '어떤 방식의 타이머가 필요한가요?',
        type: 'select',
        options: ['뽀모도로 (25분 집중 + 5분 휴식)', '카운트다운 타이머', '기록 측정 스톱워치'],
        defaultValue: '뽀모도로 (25분 집중 + 5분 휴식)',
      },
      {
        key: 'alarmEffect',
        question: '시간이 다 되었을 때 어떤 알림을 줄까요?',
        type: 'select',
        options: ['축하 효과음 & 화면 반짝임', '마스코트의 응원 메시지', '화면 가득 축하 팝업'],
        defaultValue: '축하 효과음 & 화면 반짝임',
      },
    ],
  },
  {
    id: 'score',
    name: '점수 & 콤보 시스템',
    category: 'game',
    description: '점수가 오르고 연속 성공 시 콤보 보너스를 줘요',
    iconName: 'Trophy',
    suggestedQuestions: [
      {
        key: 'scoreRule',
        question: '점수는 어떻게 올라가나요?',
        type: 'select',
        options: ['성공할 때마다 +100점', '남은 시간에 비례하여 추가 점수', '연속 성공 시 2배, 3배 콤보'],
        defaultValue: '연속 성공 시 2배, 3배 콤보',
      },
      {
        key: 'highestScore',
        question: '최고 점수를 기기에 저장할까요?',
        type: 'select',
        options: ['네, 최고 점수를 기록하고 축하해 줘요', '아니요, 이번 판 점수만 보여줘요'],
        defaultValue: '네, 최고 점수를 기록하고 축하해 줘요',
      },
    ],
  },
  {
    id: 'todo',
    name: '할 일 체크리스트 (투두)',
    category: 'core',
    description: '해야 할 일을 추가하고 하나씩 완료 체크해요',
    iconName: 'CheckSquare',
    suggestedQuestions: [
      {
        key: 'addMethod',
        question: '할 일은 어떻게 등록하나요?',
        type: 'select',
        options: ['직접 텍스트 입력 + 마감 시간', '간단 텍스트 입력만', '추천 할 일 버튼 클릭으로 추가'],
        defaultValue: '직접 텍스트 입력 + 마감 시간',
      },
      {
        key: 'completeEffect',
        question: '체크했을 때 어떤 재미난 효과를 줄까요?',
        type: 'select',
        options: ['줄 긋기 + 반짝이 폭죽 애니메이션', '마스코트가 엄지 척 칭찬하기', '경쾌한 딩동 소리와 게이지 상승'],
        defaultValue: '줄 긋기 + 반짝이 폭죽 애니메이션',
      },
    ],
  },
  {
    id: 'lucky-draw',
    name: '랜덤 뽑기 / 돌림판',
    category: 'utility',
    description: '선택하기 어려운 순간에 운에 맡겨요',
    iconName: 'Dices',
    suggestedQuestions: [
      {
        key: 'drawVisual',
        question: '어떤 모양으로 뽑을까요?',
        type: 'select',
        options: ['빙글빙글 돌아가는 행운의 룰렛(돌림판)', '두근두근 보물 상자 뽑기', '흔들리는 사다리 타기'],
        defaultValue: '빙글빙글 돌아가는 행운의 룰렛(돌림판)',
      },
      {
        key: 'itemInput',
        question: '뽑기 항목은 어떻게 정하나요?',
        type: 'select',
        options: ['사용자가 직접 항목 목록 입력/수정', '기본 추천 목록 제공 (음식, 역할 등)'],
        defaultValue: '사용자가 직접 항목 목록 입력/수정',
      },
    ],
  },
  {
    id: 'leaderboard',
    name: '명예의 전당 (순위표)',
    category: 'social',
    description: '누가 가장 높은 점수를 얻었는지 순위를 겨뤄요',
    iconName: 'Award',
    suggestedQuestions: [
      {
        key: 'rankingCriteria',
        question: '순위는 무엇으로 정하나요?',
        type: 'select',
        options: ['최고 점수 순위', '최단 클리어 시간 순위', '누적 활동 횟수 순위'],
        defaultValue: '최고 점수 순위',
      },
      {
        key: 'nicknameInput',
        question: '랭킹 등록 시 닉네임을 받나요?',
        type: 'select',
        options: ['3글자 닉네임 입력받기', '귀여운 동물 닉네임 자동 생성'],
        defaultValue: '3글자 닉네임 입력받기',
      },
    ],
  },
  {
    id: 'local-storage',
    name: '자동 저장 (기억하기)',
    category: 'core',
    description: '웹 브라우저를 닫아도 내 기록이 사라지지 않아요',
    iconName: 'Save',
    suggestedQuestions: [
      {
        key: 'saveContent',
        question: '무엇을 주로 저장할까요?',
        type: 'select',
        options: ['할 일 목록과 체크 상태', '게임 최고 기록과 뱃지 목록', '작성한 일기나 메모 전체'],
        defaultValue: '할 일 목록과 체크 상태',
      },
      {
        key: 'resetOption',
        question: '데이터를 초기화하는 기능도 넣을까요?',
        type: 'select',
        options: ['네, [전체 비우기] 버튼을 만들어 줘요', '아니요, 안전하게 계속 유지해요'],
        defaultValue: '네, [전체 비우기] 버튼을 만들어 줘요',
      },
    ],
  },
  {
    id: 'calculator',
    name: '계산기 & 자동 환산',
    category: 'utility',
    description: '숫자를 넣으면 자동으로 공식에 맞춰 뚝딱 계산해요',
    iconName: 'Calculator',
    suggestedQuestions: [
      {
        key: 'calcTarget',
        question: '어떤 계산을 하나요?',
        type: 'select',
        options: ['더하기/빼기/곱하기 기본 계산', '용돈 합계 및 남은 돈 계산', '할인율 또는 정답률 백분율 계산'],
        defaultValue: '용돈 합계 및 남은 돈 계산',
      },
    ],
  },
  {
    id: 'drawing',
    name: '그림 그리기 & 캔버스',
    category: 'game',
    description: '마우스나 터치로 색칠하고 그림을 그려요',
    iconName: 'Palette',
    suggestedQuestions: [
      {
        key: 'canvasTools',
        question: '어떤 그리기 도구를 지원할까요?',
        type: 'select',
        options: ['알록달록 색상 팔레트 + 굵기 조절 + 지우개', '스탬프 찍기 + 기본 펜', '단순 서명/낙서 펜'],
        defaultValue: '알록달록 색상 팔레트 + 굵기 조절 + 지우개',
      },
      {
        key: 'canvasExport',
        question: '그린 그림을 이미지로 저장할 수 있나요?',
        type: 'select',
        options: ['네, PNG 이미지 다운로드 지원', '화면 안에서만 감상'],
        defaultValue: '네, PNG 이미지 다운로드 지원',
      },
    ],
  },
  {
    id: 'badges',
    name: '칭찬 도장 & 업적 뱃지',
    category: 'game',
    description: '목표를 달성할 때마다 멋진 뱃지를 모아요',
    iconName: 'Medal',
    suggestedQuestions: [
      {
        key: 'badgeTypes',
        question: '어떤 업적 뱃지를 제공할까요?',
        type: 'select',
        options: ['첫 시작, 3일 연속, 100점 달성 등 5종 뱃지', '레벨별 마스터 칭호 부여', '비밀 조건 달성 히든 뱃지'],
        defaultValue: '첫 시작, 3일 연속, 100점 달성 등 5종 뱃지',
      },
    ],
  },
  {
    id: 'sound-fx',
    name: '효과음 & 배경음',
    category: 'game',
    description: '버튼을 누를 때마다 통통 튀는 소리가 나요',
    iconName: 'Volume2',
    suggestedQuestions: [
      {
        key: 'soundMute',
        question: '소리를 끄고 켜는 음소거 버튼이 필요한가요?',
        type: 'select',
        options: ['네, 우측 상단에 스피커 On/Off 버튼 필수', '아니요, 효과음만 가볍게 Web Audio로 재생'],
        defaultValue: '네, 우측 상단에 스피커 On/Off 버튼 필수',
      },
    ],
  },
  {
    id: 'pet-grow',
    name: '캐릭터 / 펫 육성',
    category: 'game',
    description: '앱을 많이 쓸수록 펫이 진화하고 대사를 해요',
    iconName: 'Sparkles',
    suggestedQuestions: [
      {
        key: 'petEvolution',
        question: '펫은 어떻게 성장하나요?',
        type: 'select',
        options: ['경험치 게이지가 차면 알 -> 아기 -> 어른으로 진화', '친밀도 하트가 차면서 새로운 모자를 씀', '다양한 감정 표현 대사 잠금 해제'],
        defaultValue: '경험치 게이지가 차면 알 -> 아기 -> 어른으로 진화',
      },
    ],
  },
  {
    id: 'search-filter',
    name: '검색 & 태그 필터',
    category: 'core',
    description: '원하는 항목을 글자나 카테고리로 빠르게 찾아요',
    iconName: 'Search',
    suggestedQuestions: [
      {
        key: 'filterCategories',
        question: '어떤 필터 태그를 둘까요?',
        type: 'select',
        options: ['전체 / 중요 / 완료 / 미완료', '과목별 (국어, 수학, 영어, 과학)', '날짜별 (오늘, 이번 주, 지난 기록)'],
        defaultValue: '전체 / 중요 / 완료 / 미완료',
      },
    ],
  },
  {
    id: 'share-quote',
    name: '결과 카드 공유 & 텍스트 복사',
    category: 'social',
    description: '내 멋진 결과를 클립보드로 복사해서 친구에게 보여줘요',
    iconName: 'Share2',
    suggestedQuestions: [
      {
        key: 'shareFormat',
        question: '공유할 때 어떤 텍스트가 만들어지나요?',
        type: 'select',
        options: ['점수 + 마스코트 칭찬 한마디 텍스트 복사', '예쁜 요약 카드 캡처 다운로드', '축하 메시지 팝업 링크'],
        defaultValue: '점수 + 마스코트 칭찬 한마디 텍스트 복사',
      },
    ],
  },
  {
    id: 'daily-mission',
    name: '오늘의 깜짝 미션',
    category: 'game',
    description: '매일 새로운 미션이 나타나서 도전 욕구를 높여요',
    iconName: 'Target',
    suggestedQuestions: [
      {
        key: 'missionRefresh',
        question: '미션은 언제 새로고침 되나요?',
        type: 'select',
        options: ['매일 자정 자동으로 3가지 미션 갱신', '원할 때 [미션 다시 뽑기] 버튼 지원', '고정 퀘스트 달성제'],
        defaultValue: '매일 자정 자동으로 3가지 미션 갱신',
      },
    ],
  },
  {
    id: 'theme-mode',
    name: '테마 색상 변경 & 다크모드',
    category: 'utility',
    description: '내가 좋아하는 파스텔 색상으로 테마를 바꿔요',
    iconName: 'SunMoon',
    suggestedQuestions: [
      {
        key: 'themeChoices',
        question: '어떤 테마들을 고를 수 있게 할까요?',
        type: 'select',
        options: ['파스텔 옐로우 / 민트 / 스카이 / 라벤더 / 다크', '낮 모드와 밤 모드 2종류', '귀여운 일러스트 배경 3종'],
        defaultValue: '파스텔 옐로우 / 민트 / 스카이 / 라벤더 / 다크',
      },
    ],
  },
];

export const SCREEN_TEMPLATES = [
  { id: 'screen-home', name: '🏠 메인 홈 화면', desc: '타이틀, 마스코트 인사말, 시작 버튼' },
  { id: 'screen-action', name: '🎮 실행 & 플레이 화면', desc: '퀴즈, 타이머, 계산 등 핵심 기능 작동 공간' },
  { id: 'screen-result', name: '🎉 결과 & 보상 화면', desc: '점수 확인, 뱃지 획득, 폭죽 축하 효과' },
  { id: 'screen-history', name: '📊 기록 & 통계 화면', desc: '과거 기록 목록, 그래프, 칭찬 도장 모음' },
  { id: 'screen-settings', name: '⚙️ 설정 & 도움말', desc: '효과음 켜기/끄기, 데이터 초기화, 사용법' },
];

export const DESIGN_STYLES = [
  {
    id: 'cute-pastel',
    name: '둥글둥글 귀여운 파스텔',
    desc: '부드러운 라운드 모서리와 따뜻한 파스텔톤, 친근하고 말랑말랑한 느낌',
    badge: '추천 No.1',
    bgClass: 'bg-amber-50 border-amber-300 text-amber-900',
  },
  {
    id: 'arcade-game',
    name: '신나는 아케이드 게임풍',
    desc: '선명한 버튼, 네온 포인트, 레벨업 감성과 반짝이는 효과',
    badge: '인기 게임',
    bgClass: 'bg-indigo-50 border-indigo-300 text-indigo-900',
  },
  {
    id: 'clean-modern',
    name: '깔끔하고 정돈된 심플',
    desc: '여백이 살아있고 글자가 큼직하여 쓰기 편한 직관적인 디자인',
    badge: '깔끔한 도구',
    bgClass: 'bg-emerald-50 border-emerald-300 text-emerald-900',
  },
  {
    id: 'retro-pixel',
    name: '레트로 픽셀 & 도트 감성',
    desc: '옛날 포켓몬이나 레트로 게임기 같은 독특하고 재미난 비주얼',
    badge: '개성 만점',
    bgClass: 'bg-purple-50 border-purple-300 text-purple-900',
  },
];

export const COLOR_PALETTES = [
  { id: 'sunshine', name: '따뜻한 햇살 옐로우', primary: '#F59E0B', secondary: '#FEF3C7', border: '#FCD34D' },
  { id: 'mint', name: '상쾌한 애플 민트', primary: '#10B981', secondary: '#D1FAE5', border: '#6EE7B7' },
  { id: 'sky', name: '맑은 하늘 스카이블루', primary: '#0284C7', secondary: '#E0F2FE', border: '#7DD3FC' },
  { id: 'berry', name: '달콤한 베리 라벤더', primary: '#8B5CF6', secondary: '#EDE9FE', border: '#C4B5FD' },
  { id: 'coral', name: '생기발랄 피치 코랄', primary: '#F43F5E', secondary: '#FFE4E6', border: '#FDA4AF' },
];

export const MASCOTS: MascotConfig[] = [
  {
    id: 'squirrel',
    name: '또리',
    animal: '다람쥐',
    emoji: '🐿️',
    cheerPhrase: '오늘도 도토리처럼 꽉 찬 하루를 만들어보자!',
    avatarBg: 'bg-amber-100 border-amber-300 text-amber-800',
  },
  {
    id: 'cat',
    name: '냥이',
    animal: '고양이',
    emoji: '🐱',
    cheerPhrase: '너의 멋진 아이디어, 내가 젤리 발바닥으로 응원할게!',
    avatarBg: 'bg-pink-100 border-pink-300 text-pink-800',
  },
  {
    id: 'robot',
    name: '핑퐁',
    animal: '스마트 로봇',
    emoji: '🤖',
    cheerPhrase: '삐빅! 기획 완벽도 100%! 멋진 앱이 완성될 거야!',
    avatarBg: 'bg-sky-100 border-sky-300 text-sky-800',
  },
  {
    id: 'dog',
    name: '뽀삐',
    animal: '강아지',
    emoji: '🐶',
    cheerPhrase: '꼬리를 살랑살랑 흔들며 힘차게 파이팅!',
    avatarBg: 'bg-emerald-100 border-emerald-300 text-emerald-800',
  },
  {
    id: 'chick',
    name: '삐약이',
    animal: '병아리',
    emoji: '🐥',
    cheerPhrase: '삐약! 작은 한 걸음이 위대한 앱을 만들어!',
    avatarBg: 'bg-yellow-100 border-yellow-300 text-yellow-800',
  },
  {
    id: 'hamster',
    name: '모찌',
    animal: '햄스터',
    emoji: '🐹',
    cheerPhrase: '볼이 빵빵해질 만큼 기분 좋은 성공을 선물할게!',
    avatarBg: 'bg-orange-100 border-orange-300 text-orange-800',
  },
];

export const SPECIAL_IDEA_CHIPS = [
  '🌰 목표를 달성할 때마다 다람쥐가 도토리를 모아 나무를 키워요!',
  '🎆 퀴즈 3연속 정답 시 화면 전체에 무지개 불꽃놀이 폭죽이 팡팡 터져요!',
  '🎵 뽀모도로 타이머 동안 빗소리/모닥불 등 잔잔한 ASMR 배경음을 재생해요!',
  '👑 하루 할 일을 모두 마치면 "오늘의 마스터" 황금 왕관을 씌워줘요!',
  '🎲 버튼을 누를 때마다 화면 테마 배경이 랜덤 무지개색으로 슝 바뀌어요!',
  '💬 문제를 틀려도 마스코트가 "괜찮아! 다음엔 맞힐 수 있어!"라고 위로해 줘요!',
];
