export type AppTheme = 'pastel' | 'wood' | 'mono' | 'dark';

export interface ThemeConfig {
  id: AppTheme;
  name: string;
  emoji: string;
  desc: string;
  bgClass: string;
  appBg: string;
  cardBg: string;
  cardBorder: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accentColor: string;
  accentBg: string;
  accentBorder: string;
  ringBg: string;
  stageColors: {
    digest: string;
    insulin: string;
    glycogen: string;
    ketosis: string;
    autophagy: string;
  };
}

export const THEMES: Record<AppTheme, ThemeConfig> = {
  pastel: {
    id: 'pastel',
    name: '감성 파스텔',
    emoji: '🌸',
    desc: '화사하고 뽀송한 파스텔 라벤더 & 베이비 핑크 (학생/Z세대 인기 1위)',
    bgClass: 'theme-pastel',
    appBg: 'bg-[#fbf9fe]',
    cardBg: 'bg-white/80 backdrop-blur-md',
    cardBorder: 'border-purple-100 shadow-sm shadow-purple-500/5',
    textPrimary: 'text-slate-800',
    textSecondary: 'text-slate-600',
    textMuted: 'text-slate-400',
    accentColor: '#a855f7', // purple
    accentBg: 'bg-purple-50',
    accentBorder: 'border-purple-200',
    ringBg: '#f1f5f9',
    stageColors: {
      digest: '#fb923c',    // 소프트 피치 오렌지
      insulin: '#60a5fa',   // 파스텔 스카이블루
      glycogen: '#c084fc',  // 파스텔 라벤더
      ketosis: '#f472b6',   // 파스텔 로즈핑크
      autophagy: '#34d399', // 파스텔 민트
    },
  },
  wood: {
    id: 'wood',
    name: '코지 우드 & 베이지',
    emoji: '🪵',
    desc: '따뜻한 오트밀 베이지와 차분한 올리브 & 내추럴 우드 감성',
    bgClass: 'theme-wood',
    appBg: 'bg-[#faf6f0]',
    cardBg: 'bg-[#ffffff]/85 backdrop-blur-md',
    cardBorder: 'border-[#ebdcd0] shadow-sm shadow-amber-900/5',
    textPrimary: 'text-[#443627]',
    textSecondary: 'text-[#6e5d4f]',
    textMuted: 'text-[#9c8979]',
    accentColor: '#8a6240', // warm wood
    accentBg: 'bg-[#f4ece4]',
    accentBorder: 'border-[#ddcdbf]',
    ringBg: '#efe7dd',
    stageColors: {
      digest: '#d97706',    // 테라코타 앰버
      insulin: '#78716c',   // 웜 스톤
      glycogen: '#a8836f',  // 로스티드 모카
      ketosis: '#be5a38',   // 웜 브릭 레드
      autophagy: '#5e825a', // 세이지 올리브
    },
  },
  mono: {
    id: 'mono',
    name: '모던 미니멀 모노',
    emoji: '🖤',
    desc: '깔끔하고 세련된 블랙 & 퓨어 화이트 하이테크 룩',
    bgClass: 'theme-mono',
    appBg: 'bg-[#f8fafc]',
    cardBg: 'bg-white',
    cardBorder: 'border-slate-200 shadow-sm',
    textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-700',
    textMuted: 'text-slate-400',
    accentColor: '#0f172a', // deep slate
    accentBg: 'bg-slate-100',
    accentBorder: 'border-slate-300',
    ringBg: '#e2e8f0',
    stageColors: {
      digest: '#f59e0b',
      insulin: '#2563eb',
      glycogen: '#7c3aed',
      ketosis: '#db2777',
      autophagy: '#059669',
    },
  },
  dark: {
    id: 'dark',
    name: '미드나잇 다크',
    emoji: '🌙',
    desc: '세련된 네온 글래스모피즘 다크 모드',
    bgClass: 'theme-dark',
    appBg: 'bg-[#080c17]',
    cardBg: 'bg-[#131c31]/75 backdrop-blur-md',
    cardBorder: 'border-white/10 shadow-xl',
    textPrimary: 'text-white',
    textSecondary: 'text-slate-300',
    textMuted: 'text-slate-400',
    accentColor: '#3b82f6',
    accentBg: 'bg-blue-500/10',
    accentBorder: 'border-blue-500/30',
    ringBg: '#1e293b',
    stageColors: {
      digest: '#f59e0b',
      insulin: '#3b82f6',
      glycogen: '#8b5cf6',
      ketosis: '#ec4899',
      autophagy: '#10b981',
    },
  }
};
