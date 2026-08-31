import React from 'react';
import { Timer, Camera, BarChart3, Clock, Sparkles, Calendar as CalendarIcon } from 'lucide-react';
import { AppTheme } from '../../types';
import { THEMES } from '../../constants/themes';

export type NavTab = 'timer' | 'timeline' | 'calendar' | 'stats';

interface BottomNavigationProps {
  currentTab: NavTab;
  currentTheme: AppTheme;
  onSelectTab: (tab: NavTab) => void;
  onOpenMealUploader: () => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  currentTab,
  currentTheme,
  onSelectTab,
  onOpenMealUploader
}) => {
  const theme = THEMES[currentTheme] || THEMES.pastel;
  const isLight = currentTheme !== 'dark';

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 max-w-md mx-auto px-4 pb-4 pt-2">
      <nav className={`rounded-3xl p-1.5 flex items-center justify-around shadow-2xl relative backdrop-blur-xl border transition-all ${
        isLight
          ? 'bg-white/90 border-slate-200/80 shadow-purple-500/10'
          : 'bg-[#0d1424]/90 border-white/10'
      }`}>
        {/* Tab 1: Timer */}
        <button
          onClick={() => onSelectTab('timer')}
          className={`flex flex-col items-center justify-center flex-1 py-2 rounded-2xl transition-all ${
            currentTab === 'timer'
              ? currentTheme === 'pastel'
                ? 'text-purple-600 bg-purple-50 font-bold shadow-xs'
                : currentTheme === 'wood'
                ? 'text-[#8a6240] bg-[#f5ede4] font-bold shadow-xs'
                : currentTheme === 'mono'
                ? 'text-slate-900 bg-slate-100 font-bold shadow-xs'
                : 'text-blue-400 bg-blue-500/10 font-bold'
              : isLight ? 'text-slate-400 hover:text-slate-700' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Timer className="w-5 h-5 mb-0.5" />
          <span className="text-[11px]">단식 타이머</span>
        </button>

        {/* Tab 2: Timeline */}
        <button
          onClick={() => onSelectTab('timeline')}
          className={`flex flex-col items-center justify-center flex-1 py-2 rounded-2xl transition-all ${
            currentTab === 'timeline'
              ? currentTheme === 'pastel'
                ? 'text-purple-600 bg-purple-50 font-bold shadow-xs'
                : currentTheme === 'wood'
                ? 'text-[#8a6240] bg-[#f5ede4] font-bold shadow-xs'
                : currentTheme === 'mono'
                ? 'text-slate-900 bg-slate-100 font-bold shadow-xs'
                : 'text-blue-400 bg-blue-500/10 font-bold'
              : isLight ? 'text-slate-400 hover:text-slate-700' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Clock className="w-5 h-5 mb-0.5" />
          <span className="text-[11px]">식단 피드</span>
        </button>

        {/* Center Floating AI Camera Action */}
        <div className="flex-1 flex justify-center -mt-7">
          <button
            onClick={onOpenMealUploader}
            className={`w-14 h-14 rounded-full p-[2px] shadow-xl hover:scale-105 active:scale-95 transition-transform flex items-center justify-center group ${
              currentTheme === 'pastel'
                ? 'bg-gradient-to-tr from-purple-500 via-pink-400 to-rose-300 shadow-purple-400/30'
                : currentTheme === 'wood'
                ? 'bg-gradient-to-tr from-[#8a6240] via-[#ab7e57] to-[#d6b293] shadow-amber-900/30'
                : currentTheme === 'mono'
                ? 'bg-gradient-to-tr from-slate-900 to-slate-700 shadow-slate-900/30'
                : 'bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 shadow-blue-500/30'
            }`}
            title="AI 식단 분석 사진 촬영"
          >
            <div className={`w-full h-full rounded-full flex flex-col items-center justify-center text-white ${
              currentTheme === 'pastel'
                ? 'bg-gradient-to-tr from-purple-600 to-pink-500'
                : currentTheme === 'wood'
                ? 'bg-[#8a6240]'
                : currentTheme === 'mono'
                ? 'bg-slate-900'
                : 'bg-gradient-to-tr from-blue-600 to-indigo-600'
            }`}>
              <Camera className="w-5 h-5 group-hover:animate-bounce" />
              <span className="text-[8px] font-black uppercase tracking-wider flex items-center">
                AI <Sparkles className="w-2 h-2 ml-0.5" />
              </span>
            </div>
          </button>
        </div>

        {/* Tab 3: Calendar & Weight (NEW) */}
        <button
          onClick={() => onSelectTab('calendar')}
          className={`flex flex-col items-center justify-center flex-1 py-2 rounded-2xl transition-all ${
            currentTab === 'calendar'
              ? currentTheme === 'pastel'
                ? 'text-purple-600 bg-purple-50 font-bold shadow-xs'
                : currentTheme === 'wood'
                ? 'text-[#8a6240] bg-[#f5ede4] font-bold shadow-xs'
                : currentTheme === 'mono'
                ? 'text-slate-900 bg-slate-100 font-bold shadow-xs'
                : 'text-blue-400 bg-blue-500/10 font-bold'
              : isLight ? 'text-slate-400 hover:text-slate-700' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <CalendarIcon className="w-5 h-5 mb-0.5" />
          <span className="text-[11px]">달력·체중</span>
        </button>

        {/* Tab 4: Stats */}
        <button
          onClick={() => onSelectTab('stats')}
          className={`flex flex-col items-center justify-center flex-1 py-2 rounded-2xl transition-all ${
            currentTab === 'stats'
              ? currentTheme === 'pastel'
                ? 'text-purple-600 bg-purple-50 font-bold shadow-xs'
                : currentTheme === 'wood'
                ? 'text-[#8a6240] bg-[#f5ede4] font-bold shadow-xs'
                : currentTheme === 'mono'
                ? 'text-slate-900 bg-slate-100 font-bold shadow-xs'
                : 'text-blue-400 bg-blue-500/10 font-bold'
              : isLight ? 'text-slate-400 hover:text-slate-700' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BarChart3 className="w-5 h-5 mb-0.5" />
          <span className="text-[11px]">대사 분석</span>
        </button>
      </nav>
    </div>
  );
};
