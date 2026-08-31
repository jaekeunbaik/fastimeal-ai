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
    appBg: 'bg-[#fcf9fe]',
    cardBg: 'bg-white/88 backdrop-blur-md',
    cardBorder: 'border-purple-100 shadow-sm shadow-purple-500/5',
    textPrimary: 'text-slate-800',
    textSecondary: 'text-slate-600',
    textMuted: 'text-slate-400',
    accentColor: '#a855f7', // purple
    accentBg: 'bg-purple-50',
    accentBorder: 'border-purple-200',
    ringBg: '#f3e8ff',
    stageColors: {
      digest: '#fb923c',    // 소프트 피치
      insulin: '#60a5fa',   // 파스텔 스카이블루
      glycogen: '#c084fc',  // 파스텔 라벤더
      ketosis: '#f472b6',   // 파스텔 로즈
      autophagy: '#34d399', // 파스텔 민트
    },
  },
  wood: {
    id: 'wood',
    name: '코지 우드 & 베이지',
    emoji: '🪵',
    desc: '따스한 카페 라떼 오트밀 & 월넛 브라운 감성',
    bgClass: 'theme-wood',
    appBg: 'bg-[#f3ece2]', // 확실한 베이지 오트밀
    cardBg: 'bg-[#fcf7f0]/95 backdrop-blur-md',
    cardBorder: 'border-[#dfcebc] shadow-sm shadow-amber-950/10',
    textPrimary: 'text-[#3d2b1f]',
    textSecondary: 'text-[#5c4033]',
    textMuted: 'text-[#8d6e63]',
    accentColor: '#795548', // deep warm wood
    accentBg: 'bg-[#ebe0d3]',
    accentBorder: 'border-[#cfbca8]',
    ringBg: '#e6d7c7',
    stageColors: {
      digest: '#d97706',    // 앰버
      insulin: '#8d6e63',   // 웜 브라운
      glycogen: '#a1887f',  // 모카
      ketosis: '#c2410c',   // 테라코타 브릭
      autophagy: '#4d7c0f', // 올리브 포레스트
    },
  },
  mono: {
    id: 'mono',
    name: '모던 미니멀 모노',
    emoji: '🖤',
    desc: '선명한 퓨어 화이트 & 딥 블랙 하이테크 룩',
    bgClass: 'theme-mono',
    appBg: 'bg-[#f4f4f5]', // 쿨 실버 그레이
    cardBg: 'bg-white',
    cardBorder: 'border-zinc-300 shadow-sm',
    textPrimary: 'text-black',
    textSecondary: 'text-zinc-700',
    textMuted: 'text-zinc-400',
    accentColor: '#18181b', // pure charcoal black
    accentBg: 'bg-zinc-100',
    accentBorder: 'border-zinc-900',
    ringBg: '#e4e4e7',
    stageColors: {
      digest: '#d97706',
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
    desc: '세련된 네온 글래스모피즘 나이트 모드',
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
