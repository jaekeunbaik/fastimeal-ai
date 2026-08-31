import React from 'react';
import { Droplets, Plus, Minus, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface WaterTrackerProps {
  todayWaterMl: number;
  targetWaterMl: number;
  onAddWater: (amountMl: number) => void;
}

export const WaterTracker: React.FC<WaterTrackerProps> = ({
  todayWaterMl,
  targetWaterMl,
  onAddWater,
}) => {
  const percent = Math.min(100, Math.round((todayWaterMl / targetWaterMl) * 100));
  const isTargetAchieved = todayWaterMl >= targetWaterMl;

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
    <div className="w-full glass-card rounded-3xl p-4 border border-cyan-500/20 shadow-xl bg-gradient-to-b from-[#0e1c2e]/90 to-[#0c1524]/90 relative overflow-hidden">
      {/* Background Water Wave Glow */}
      <div
        className="absolute bottom-0 left-0 right-0 bg-cyan-500/10 transition-all duration-700 pointer-events-none"
        style={{ height: `${percent}%` }}
      />

      <div className="relative z-10 flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Droplets className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-1.5">
              <span>수분 섭취 트래커</span>
              {isTargetAchieved && (
                <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded-full font-bold flex items-center">
                  <CheckCircle className="w-3 h-3 mr-0.5" /> 목표 달성!
                </span>
              )}
            </h3>
            <p className="text-[11px] text-slate-400">단식 중 가짜 허기를 달래고 신진대사를 촉진합니다</p>
          </div>
        </div>

        {/* Total stats */}
        <div className="text-right">
          <span className="text-lg font-extrabold text-cyan-400 font-mono">{todayWaterMl}</span>
          <span className="text-xs text-slate-400"> / {targetWaterMl}ml</span>
          <p className="text-[10px] text-slate-400 font-semibold">{percent}%</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative w-full h-2.5 bg-slate-800 rounded-full overflow-hidden mb-3">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500 rounded-full"
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Action Buttons (250ml, 500ml, -250ml) */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handleAdd(250)}
          className="flex-1 py-2.5 px-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-bold flex items-center justify-center space-x-1 transition-all active:scale-95 shadow-md shadow-cyan-500/10"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>한 컵 (+250ml)</span>
        </button>

        <button
          onClick={() => handleAdd(500)}
          className="py-2.5 px-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 text-cyan-400 text-xs font-medium flex items-center justify-center space-x-1 transition-all active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>텀블러 (+500ml)</span>
        </button>

        {todayWaterMl >= 250 && (
          <button
            onClick={() => handleAdd(-250)}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-slate-400 hover:text-slate-200 text-xs transition-all active:scale-95"
            title="250ml 취소"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
