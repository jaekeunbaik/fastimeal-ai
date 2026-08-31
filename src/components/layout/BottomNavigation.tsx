import React from 'react';
import { Timer, Camera, BarChart3, Clock, Sparkles } from 'lucide-react';

export type NavTab = 'timer' | 'timeline' | 'stats' | 'profile';

interface BottomNavigationProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenMealUploader: () => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  currentTab,
  onSelectTab,
  onOpenMealUploader
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 max-w-md mx-auto px-4 pb-4 pt-2">
      <nav className="glass-card rounded-2xl p-1.5 flex items-center justify-around shadow-2xl relative border border-white/10 bg-[#0d1424]/90 backdrop-blur-xl">
        {/* Tab 1: Timer */}
        <button
          onClick={() => onSelectTab('timer')}
          className={`flex flex-col items-center justify-center flex-1 py-1.5 rounded-xl transition-all ${
            currentTab === 'timer' ? 'text-blue-400 bg-blue-500/10 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Timer className="w-5 h-5 mb-0.5" />
          <span className="text-[11px]">단식 타이머</span>
        </button>

        {/* Tab 2: Timeline */}
        <button
          onClick={() => onSelectTab('timeline')}
          className={`flex flex-col items-center justify-center flex-1 py-1.5 rounded-xl transition-all ${
            currentTab === 'timeline' ? 'text-blue-400 bg-blue-500/10 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Clock className="w-5 h-5 mb-0.5" />
          <span className="text-[11px]">식단 피드</span>
        </button>

        {/* Center Floating AI Camera Action */}
        <div className="flex-1 flex justify-center -mt-6">
          <button
            onClick={onOpenMealUploader}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 p-[2px] shadow-xl shadow-blue-500/30 hover:scale-105 active:scale-95 transition-transform flex items-center justify-center group"
            title="AI 식단 분석 사진 촬영"
          >
            <div className="w-full h-full rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex flex-col items-center justify-center text-white">
              <Camera className="w-6 h-6 group-hover:animate-bounce" />
              <span className="text-[8px] font-black uppercase tracking-wider flex items-center">
                AI <Sparkles className="w-2 h-2 ml-0.5" />
              </span>
            </div>
          </button>
        </div>

        {/* Tab 3: Stats */}
        <button
          onClick={() => onSelectTab('stats')}
          className={`flex flex-col items-center justify-center flex-1 py-1.5 rounded-xl transition-all ${
            currentTab === 'stats' ? 'text-blue-400 bg-blue-500/10 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BarChart3 className="w-5 h-5 mb-0.5" />
          <span className="text-[11px]">대사 분석</span>
        </button>

        {/* Tab 4: Profile / Quick Settings */}
        <button
          onClick={() => onSelectTab('profile')}
          className={`flex flex-col items-center justify-center flex-1 py-1.5 rounded-xl transition-all ${
            currentTab === 'profile' ? 'text-blue-400 bg-blue-500/10 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-5 h-5 mb-0.5" />
          <span className="text-[11px]">AI 코치</span>
        </button>
      </nav>
    </div>
  );
};
