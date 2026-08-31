import React from 'react';
import { Zap, Settings, Sparkles, Droplets } from 'lucide-react';
import { FastingState } from '../../types';

interface HeaderProps {
  fastingState: FastingState;
  onOpenSettings: () => void;
  onOpenStages: () => void;
  todayWaterMl: number;
}

export const Header: React.FC<HeaderProps> = ({
  fastingState,
  onOpenSettings,
  onOpenStages,
  todayWaterMl
}) => {
  const isFasting = fastingState === 'FASTING';

  return (
    <header className="sticky top-0 z-30 w-full px-4 py-3 bg-[#080c17]/80 backdrop-blur-lg border-b border-white/5 flex items-center justify-between">
      {/* Brand Title */}
      <div className="flex items-center space-x-2.5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center space-x-1.5">
            <span className="font-extrabold text-base tracking-tight text-white">FastiMeal</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">AI</span>
          </div>
          <p className="text-[11px] text-slate-400">대사 5단계 & 스마트 AI 코칭</p>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center space-x-2">
        {/* Fasting / Eating Badge */}
        <button
          onClick={onOpenStages}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
            isFasting
              ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30 hover:bg-blue-500/25'
              : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25'
          }`}
        >
          <span className={`w-2 h-2 rounded-full animate-ping ${isFasting ? 'bg-blue-400' : 'bg-emerald-400'}`} />
          <span>{isFasting ? '단식 유지 중' : '식사 윈도우'}</span>
          <Sparkles className="w-3 h-3 ml-0.5 opacity-75" />
        </button>

        {/* Water mini indicator */}
        <div className="flex items-center space-x-1 px-2.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium">
          <Droplets className="w-3.5 h-3.5" />
          <span>{todayWaterMl}ml</span>
        </div>

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          title="설정 및 API Key"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
