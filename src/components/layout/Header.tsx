import React from 'react';
import { Zap, Settings, Sparkles, Droplets, Palette } from 'lucide-react';
import { FastingState, AppTheme } from '../../types';
import { THEMES } from '../../constants/themes';

interface HeaderProps {
  fastingState: FastingState;
  currentTheme: AppTheme;
  onOpenSettings: () => void;
  onOpenStages: () => void;
  onOpenThemeSelector: () => void;
  todayWaterMl: number;
}

export const Header: React.FC<HeaderProps> = ({
  fastingState,
  currentTheme,
  onOpenSettings,
  onOpenStages,
  onOpenThemeSelector,
  todayWaterMl
}) => {
  const isFasting = fastingState === 'FASTING';
  const theme = THEMES[currentTheme] || THEMES.pastel;

  const isLight = currentTheme !== 'dark';

  return (
    <header className={`sticky top-0 z-30 w-full px-4 py-3 backdrop-blur-xl border-b transition-colors ${
      isLight ? 'bg-white/80 border-slate-200/80 shadow-xs' : 'bg-[#080c17]/80 border-white/5'
    } flex items-center justify-between`}>
      {/* Brand Title */}
      <div className="flex items-center space-x-2.5">
        <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shadow-md ${
          currentTheme === 'pastel'
            ? 'bg-gradient-to-tr from-purple-500 via-pink-400 to-rose-300 shadow-purple-500/20 text-white'
            : currentTheme === 'wood'
            ? 'bg-gradient-to-tr from-[#8a6240] to-[#c29b7a] shadow-amber-900/20 text-white'
            : currentTheme === 'mono'
            ? 'bg-slate-900 text-white shadow-slate-900/20'
            : 'bg-gradient-to-tr from-blue-600 to-cyan-400 shadow-blue-500/20 text-white'
        }`}>
          <Zap className="w-5 h-5 fill-current" />
        </div>
        <div>
          <div className="flex items-center space-x-1.5">
            <span className={`font-extrabold text-base tracking-tight ${isLight ? 'text-slate-800' : 'text-white'}`}>
              FastiMeal
            </span>
          </div>
          <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            대사 5단계 & 간헐적 단식 다이어리
          </p>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center space-x-2">
        {/* Fasting / Eating Status Tag */}
        <div 
          onClick={onOpenStages}
          className={`cursor-pointer px-3 py-1.5 rounded-full text-xs font-extrabold flex items-center space-x-1.5 border transition-all ${
          isFasting
            ? currentTheme === 'pastel'
              ? 'bg-purple-100/90 text-purple-700 border-purple-200 shadow-xs'
              : currentTheme === 'wood'
              ? 'bg-[#ebdcd0] text-[#6e5d4f] border-[#ddcdbf]'
              : currentTheme === 'mono'
              ? 'bg-zinc-200 text-black border-zinc-300'
              : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
            : isLight
            ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
            : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isFasting ? 'bg-purple-600 dark:bg-blue-400' : 'bg-emerald-500'}`} />
          <span>{isFasting ? '단식 중' : '식사 가능'}</span>
        </div>

        {/* Theme Switcher Quick Icon */}
        <button
          onClick={onOpenThemeSelector}
          className={`p-2 rounded-full transition-all flex items-center justify-center ${
            isLight ? 'hover:bg-slate-100 text-slate-600' : 'hover:bg-white/10 text-slate-300'
          }`}
          title="테마 색상 변경 (파스텔/우드/모노/다크)"
        >
          <span className="text-sm">{theme.emoji}</span>
        </button>

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          className={`p-2 rounded-full transition-colors ${
            isLight ? 'hover:bg-slate-100 text-slate-500 hover:text-slate-800' : 'hover:bg-white/10 text-slate-400 hover:text-white'
          }`}
          title="설정 및 API Key"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
