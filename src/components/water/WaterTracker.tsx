import React from 'react';
import { Droplets, Plus, Minus, CheckCircle } from 'lucide-react';
import { AppTheme } from '../../types';
import confetti from 'canvas-confetti';

interface WaterTrackerProps {
  todayWaterMl: number;
  targetWaterMl: number;
  currentTheme?: AppTheme;
  onAddWater: (amountMl: number) => void;
}

export const WaterTracker: React.FC<WaterTrackerProps> = ({
  todayWaterMl,
  targetWaterMl,
  currentTheme = 'pastel',
  onAddWater,
}) => {
  const percent = Math.min(100, Math.round((todayWaterMl / targetWaterMl) * 100));
  const isTargetAchieved = todayWaterMl >= targetWaterMl;
  const isLight = currentTheme !== 'dark';

  const handleAdd = (amount: number) => {
    onAddWater(amount);
    if (todayWaterMl + amount >= targetWaterMl && !isTargetAchieved) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.8 }
      });
    }
  };

  return (
    <div className={`w-full glass-card rounded-3xl p-4.5 relative overflow-hidden transition-all ${
      currentTheme === 'pastel'
        ? 'border-cyan-200/80 bg-gradient-to-b from-white/90 to-cyan-50/60 shadow-md shadow-cyan-500/5'
        : currentTheme === 'wood'
        ? 'border-[#ebdcd0] bg-[#ffffff]/90 shadow-md shadow-amber-900/5'
        : isLight
        ? 'border-slate-200 bg-white shadow-xs'
        : 'border-cyan-500/20 bg-gradient-to-b from-[#0e1c2e]/90 to-[#0c1524]/90'
    }`}>
      {/* Background Water Wave Glow */}
      <div
        className={`absolute bottom-0 left-0 right-0 transition-all duration-700 pointer-events-none ${
          isLight ? 'bg-cyan-500/10' : 'bg-cyan-500/10'
        }`}
        style={{ height: `${percent}%` }}
      />

      <div className="relative z-10 flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2.5">
          <div className={`w-9 h-9 rounded-2xl flex items-center justify-center ${
            isLight
              ? 'bg-cyan-100 text-cyan-600 border border-cyan-200 shadow-xs'
              : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
          }`}>
            <Droplets className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <h3 className={`text-sm font-bold flex items-center space-x-1.5 ${isLight ? 'text-slate-800' : 'text-white'}`}>
              <span>수분 섭취 트래커</span>
              {isTargetAchieved && (
                <span className="text-[10px] bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 px-2 py-0.5 rounded-full font-bold flex items-center">
                  <CheckCircle className="w-3 h-3 mr-0.5" /> 목표 달성!
                </span>
              )}
            </h3>
            <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              단식 중 가짜 허기를 달래고 신진대사를 촉진합니다
            </p>
          </div>
        </div>

        {/* Total stats */}
        <div className="text-right">
          <span className="text-lg font-extrabold text-cyan-600 dark:text-cyan-400 font-mono">{todayWaterMl}</span>
          <span className={`text-xs ${isLight ? 'text-slate-400' : 'text-slate-400'}`}> / {targetWaterMl}ml</span>
          <p className="text-[10px] text-cyan-600 dark:text-cyan-400 font-bold">{percent}%</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className={`relative w-full h-2.5 rounded-full overflow-hidden mb-3 ${
        isLight ? 'bg-slate-100' : 'bg-slate-800'
      }`}>
        <div
          className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500 rounded-full"
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Action Buttons (250ml, 500ml, -250ml) */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handleAdd(250)}
          className={`flex-1 py-2.5 px-3 rounded-2xl text-xs font-bold flex items-center justify-center space-x-1 transition-all active:scale-95 ${
            isLight
              ? 'bg-cyan-500 text-white hover:bg-cyan-600 shadow-md shadow-cyan-500/20'
              : 'bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300'
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>한 컵 (+250ml)</span>
        </button>

        <button
          onClick={() => handleAdd(500)}
          className={`py-2.5 px-3 rounded-2xl text-xs font-semibold flex items-center justify-center space-x-1 transition-all active:scale-95 ${
            isLight
              ? 'bg-cyan-50 text-cyan-700 border border-cyan-200 hover:bg-cyan-100'
              : 'bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 text-cyan-400'
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>텀블러 (+500ml)</span>
        </button>

        {todayWaterMl >= 250 && (
          <button
            onClick={() => handleAdd(-250)}
            className={`p-2.5 rounded-2xl text-xs transition-all active:scale-95 ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-500'
                : 'bg-white/5 hover:bg-white/10 text-slate-400'
            }`}
            title="250ml 취소"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
