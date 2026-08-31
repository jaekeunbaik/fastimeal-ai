import React, { useState } from 'react';
import { Play, Square, Sparkles, Flame, Clock, Info, ChevronRight, CheckCircle2 } from 'lucide-react';
import { MetabolicStage } from '../../types';
import { METABOLIC_STAGES } from '../../constants/metabolism';

interface MetabolicRingTimerProps {
  isFasting: boolean;
  elapsedHours: number;
  remainingSeconds: number;
  formattedElapsed: string;
  formattedRemaining: string;
  targetHours: number;
  progressPercent: number;
  currentStage: MetabolicStage;
  onStartFasting: (targetHours?: number) => void;
  onStopFasting: () => void;
  onOpenStageDetails: () => void;
  onOpenPlanSelector: () => void;
  onAddWater: (amount: number) => void;
}

export const MetabolicRingTimer: React.FC<MetabolicRingTimerProps> = ({
  isFasting,
  elapsedHours,
  formattedElapsed,
  formattedRemaining,
  targetHours,
  progressPercent,
  currentStage,
  onStartFasting,
  onStopFasting,
  onOpenStageDetails,
  onOpenPlanSelector,
  onAddWater,
}) => {
  const [showRemaining, setShowRemaining] = useState(true);

  // SVG 원형 게이지 계산
  const size = 280;
  const strokeWidth = 14;
  const center = size / 2;
  const radius = center - strokeWidth - 6;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, progressPercent) / 100) * circumference;

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto px-4 py-2">
      {/* Plan Header & Selector */}
      <div className="w-full flex items-center justify-between mb-3">
        <button
          onClick={onOpenPlanSelector}
          className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
        >
          <span className="text-xs font-semibold text-slate-300">간헐적 단식 플랜:</span>
          <span className="text-xs font-bold text-blue-400">{targetHours}:{24 - targetHours}</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        </button>

        <button
          onClick={onOpenStageDetails}
          className="flex items-center space-x-1 text-xs text-slate-400 hover:text-blue-400 transition-colors px-2 py-1"
        >
          <Info className="w-3.5 h-3.5" />
          <span>대사 5단계 가이드</span>
        </button>
      </div>

      {/* Interactive Metabolic Circular Gauge */}
      <div className="relative flex items-center justify-center my-3">
        {/* Ambient Glow Background */}
        <div
          className="absolute inset-0 rounded-full blur-3xl opacity-25 transition-all duration-700 pointer-events-none"
          style={{ backgroundColor: currentStage.color }}
        />

        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background Track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke="#1e293b"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeLinecap="round"
          />

          {/* Metabolic Stage Sub-arcs (Background Segment Guides) */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke="#334155"
            strokeWidth={strokeWidth - 6}
            strokeDasharray="4 8"
            fill="transparent"
          />

          {/* Active Progress Arc */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke={isFasting ? currentStage.color : '#10b981'}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={isFasting ? strokeDashoffset : 0}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            style={{
              filter: `drop-shadow(0 0 8px ${isFasting ? currentStage.color : '#10b981'}88)`,
            }}
          />
        </svg>

        {/* Center Content */}
        <div
          onClick={() => isFasting && setShowRemaining(!showRemaining)}
          className="absolute flex flex-col items-center justify-center text-center cursor-pointer p-4 select-none"
        >
          {isFasting ? (
            <>
              {/* Metabolic Stage Tag */}
              <div
                className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold mb-1 shadow-sm"
                style={{
                  backgroundColor: `${currentStage.color}25`,
                  color: currentStage.color,
                  border: `1px solid ${currentStage.color}50`,
                }}
              >
                <Flame className="w-3 h-3 animate-pulse" />
                <span>{currentStage.name}</span>
              </div>

              {/* Timer Display */}
              <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-mono drop-shadow-md">
                {showRemaining ? formattedRemaining : formattedElapsed}
              </span>

              <div className="flex items-center space-x-1 text-[11px] text-slate-400 mt-1">
                <Clock className="w-3 h-3 text-slate-500" />
                <span>{showRemaining ? '목표까지 남은 시간' : '현재 단식 경과 시간'}</span>
              </div>

              {/* Progress Percentage Badge */}
              <div className="mt-2 flex items-center space-x-1.5">
                <span className="text-xs font-semibold text-slate-300">
                  {progressPercent.toFixed(0)}% 달성
                </span>
                {progressPercent >= 100 && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                )}
              </div>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2 border border-emerald-500/30 shadow-lg shadow-emerald-500/10">
                <Sparkles className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold text-white mb-1">식사 가능 시간</span>
              <p className="text-xs text-slate-400 max-w-[170px] leading-relaxed">
                영양 균형 잡힌 식사 후 단식을 시작해보세요
              </p>
            </>
          )}
        </div>
      </div>

      {/* Metabolic Stage Progress Bar Indicator (5 Stages Mini) */}
      <div className="w-full glass-card rounded-2xl p-3.5 mb-4 border border-white/5">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-semibold text-slate-300 flex items-center">
            <span className="w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: currentStage.color }} />
            {currentStage.name} ({currentStage.startHour}~{currentStage.endHour > 24 ? '16+' : currentStage.endHour}h)
          </span>
          <span className="text-[11px] text-slate-400">
            {elapsedHours.toFixed(1)}h 경과
          </span>
        </div>

        {/* 5 Segment Visualizer */}
        <div className="grid grid-cols-5 gap-1.5 mb-2">
          {METABOLIC_STAGES.map((st) => {
            const isCurrent = isFasting && currentStage.id === st.id;
            const isPassed = isFasting && elapsedHours >= st.endHour;
            return (
              <div
                key={st.id}
                onClick={onOpenStageDetails}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  isPassed
                    ? 'bg-blue-500 opacity-90'
                    : isCurrent
                    ? 'ring-2 ring-white/60 animate-pulse'
                    : 'bg-slate-700/60'
                }`}
                style={{
                  backgroundColor: isPassed || isCurrent ? st.color : undefined,
                }}
                title={st.name}
              />
            );
          })}
        </div>

        <p className="text-[11px] text-slate-400 leading-snug">
          💡 {currentStage.shortDesc}
        </p>
      </div>

      {/* Main Action Buttons & Quick 250ml Water */}
      <div className="w-full flex items-center space-x-2.5">
        {isFasting ? (
          <button
            onClick={onStopFasting}
            className="flex-1 py-3.5 px-4 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-400 font-semibold text-sm flex items-center justify-center space-x-2 transition-all active:scale-[0.98]"
          >
            <Square className="w-4 h-4 fill-current" />
            <span>단식 종료 (식사 시작)</span>
          </button>
        ) : (
          <button
            onClick={() => onStartFasting(targetHours)}
            className="flex-1 py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/25 transition-all active:scale-[0.98]"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>지금 단식 시작하기 ({targetHours}시간)</span>
          </button>
        )}

        {/* Quick Water Button */}
        <button
          onClick={() => onAddWater(250)}
          className="py-3.5 px-4 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-400 font-semibold text-sm flex items-center justify-center space-x-1.5 transition-all active:scale-[0.98]"
          title="물 250ml 원터치 기록"
        >
          <span>💧 +250ml</span>
        </button>
      </div>
    </div>
  );
};
