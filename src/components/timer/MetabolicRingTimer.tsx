import React, { useState } from 'react';
import { Play, Square, Sparkles, Flame, Clock, Info, ChevronRight, CheckCircle2 } from 'lucide-react';
import { MetabolicStage, AppTheme } from '../../types';
import { METABOLIC_STAGES } from '../../constants/metabolism';
import { THEMES } from '../../constants/themes';

interface MetabolicRingTimerProps {
  isFasting: boolean;
  elapsedHours: number;
  remainingSeconds: number;
  formattedElapsed: string;
  formattedRemaining: string;
  targetHours: number;
  progressPercent: number;
  currentStage: MetabolicStage;
  currentTheme: AppTheme;
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
  currentTheme,
  onStartFasting,
  onStopFasting,
  onOpenStageDetails,
  onOpenPlanSelector,
  onAddWater,
}) => {
  const [showRemaining, setShowRemaining] = useState(true);
  const theme = THEMES[currentTheme] || THEMES.pastel;
  const isLight = currentTheme !== 'dark';

  // SVG 원형 게이지 계산
  const size = 280;
  const strokeWidth = 14;
  const center = size / 2;
  const radius = center - strokeWidth - 6;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, progressPercent) / 100) * circumference;

  // 테마에 맞는 대사 단계 색상 매핑
  const stageKeys = ['digest', 'insulin', 'glycogen', 'ketosis', 'autophagy'] as const;
  const stageColor = theme.stageColors[stageKeys[currentStage.id - 1]] || currentStage.color;

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto px-4 py-2">
      {/* Plan Header & Selector */}
      <div className="w-full flex items-center justify-between mb-3">
        <button
          onClick={onOpenPlanSelector}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-2xl border transition-all ${
            isLight
              ? 'bg-white/80 border-slate-200 shadow-xs hover:bg-white text-slate-700'
              : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300'
          }`}
        >
          <span className="text-xs font-semibold">간헐적 단식 플랜:</span>
          <span className="text-xs font-bold" style={{ color: theme.accentColor }}>{targetHours}:{24 - targetHours}</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        </button>

        <button
          onClick={onOpenStageDetails}
          className={`flex items-center space-x-1 text-xs transition-colors px-2 py-1 ${
            isLight ? 'text-slate-500 hover:text-slate-800' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Info className="w-3.5 h-3.5" />
          <span>대사 5단계 가이드</span>
        </button>
      </div>

      {/* Interactive Metabolic Circular Gauge */}
      <div className="relative flex items-center justify-center my-3">
        {/* Ambient Glow Background */}
        <div
          className="absolute inset-0 rounded-full blur-3xl opacity-20 transition-all duration-700 pointer-events-none"
          style={{ backgroundColor: stageColor }}
        />

        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background Track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke={theme.ringBg}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeLinecap="round"
          />

          {/* Metabolic Stage Sub-arcs (Background Segment Guides) */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke={isLight ? '#cbd5e1' : '#334155'}
            strokeWidth={strokeWidth - 6}
            strokeDasharray="4 8"
            fill="transparent"
          />

          {/* Active Progress Arc */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke={isFasting ? stageColor : (isLight ? '#34d399' : '#10b981')}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={isFasting ? strokeDashoffset : 0}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            style={{
              filter: `drop-shadow(0 0 8px ${isFasting ? stageColor : '#34d399'}66)`,
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
                className="flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold mb-1 shadow-xs"
                style={{
                  backgroundColor: `${stageColor}20`,
                  color: isLight && stageColor === '#f472b6' ? '#db2777' : stageColor,
                  border: `1px solid ${stageColor}40`,
                }}
              >
                <Flame className="w-3 h-3 animate-pulse" />
                <span>{currentStage.name}</span>
              </div>

              {/* Timer Display */}
              <span className={`text-3xl sm:text-4xl font-extrabold tracking-tight font-mono drop-shadow-xs ${
                isLight ? 'text-slate-800' : 'text-white'
              }`}>
                {showRemaining ? formattedRemaining : formattedElapsed}
              </span>

              <div className={`flex items-center space-x-1 text-[11px] mt-1 ${
                isLight ? 'text-slate-500' : 'text-slate-400'
              }`}>
                <Clock className="w-3 h-3 opacity-60" />
                <span>{showRemaining ? '목표까지 남은 시간' : '현재 단식 경과 시간'}</span>
              </div>

              {/* Progress Percentage Badge */}
              <div className="mt-2 flex items-center space-x-1.5">
                <span className={`text-xs font-semibold ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                  {progressPercent.toFixed(0)}% 달성
                </span>
                {progressPercent >= 100 && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                )}
              </div>
            </>
          ) : (
            <>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-2 shadow-md ${
                currentTheme === 'pastel'
                  ? 'bg-pink-100 text-pink-500 border border-pink-200'
                  : isLight
                  ? 'bg-emerald-100 text-emerald-600 border border-emerald-200'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}>
                <Sparkles className="w-6 h-6" />
              </div>
              <span className={`text-xl font-bold mb-1 ${isLight ? 'text-slate-800' : 'text-white'}`}>식사 가능 시간</span>
              <p className={`text-xs max-w-[170px] leading-relaxed ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                영양 균형 잡힌 식사 후 단식을 시작해보세요
              </p>
            </>
          )}
        </div>
      </div>

      {/* Metabolic Stage Progress Bar Indicator (5 Stages Mini) */}
      <div className="w-full glass-card rounded-3xl p-4 mb-4">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className={`font-bold flex items-center ${isLight ? 'text-slate-700' : 'text-slate-200'}`}>
            <span className="w-2.5 h-2.5 rounded-full mr-1.5" style={{ backgroundColor: stageColor }} />
            {currentStage.name} ({currentStage.startHour}~{currentStage.endHour > 24 ? '16+' : currentStage.endHour}h)
          </span>
          <span className={`text-[11px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            {elapsedHours.toFixed(1)}h 경과
          </span>
        </div>

        {/* 5 Segment Visualizer */}
        <div className="grid grid-cols-5 gap-1.5 mb-2.5">
          {METABOLIC_STAGES.map((st, idx) => {
            const isCurrent = isFasting && currentStage.id === st.id;
            const isPassed = isFasting && elapsedHours >= st.endHour;
            const c = theme.stageColors[stageKeys[idx]] || st.color;

            return (
              <div
                key={st.id}
                onClick={onOpenStageDetails}
                className={`h-2.5 rounded-full transition-all cursor-pointer ${
                  isPassed
                    ? 'opacity-90'
                    : isCurrent
                    ? 'ring-2 ring-purple-400 dark:ring-white animate-pulse'
                    : isLight ? 'bg-slate-200' : 'bg-slate-800'
                }`}
                style={{
                  backgroundColor: isPassed || isCurrent ? c : undefined,
                }}
                title={st.name}
              />
            );
          })}
        </div>

        <p className={`text-xs leading-snug ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
          💡 {currentStage.shortDesc}
        </p>
      </div>

      {/* Main Action Buttons & Quick 250ml Water */}
      <div className="w-full flex items-center space-x-2.5">
        {isFasting ? (
          <button
            onClick={onStopFasting}
            className={`flex-1 py-3.5 px-4 rounded-2xl font-bold text-xs flex items-center justify-center space-x-2 transition-all active:scale-[0.98] ${
              isLight
                ? 'bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 shadow-xs'
                : 'bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-400'
            }`}
          >
            <Square className="w-4 h-4 fill-current" />
            <span>단식 종료 (식사 시작)</span>
          </button>
        ) : (
          <button
            onClick={() => onStartFasting(targetHours)}
            className={`flex-1 py-3.5 px-4 rounded-2xl text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg transition-all active:scale-[0.98] ${
              currentTheme === 'pastel'
                ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-rose-400 hover:opacity-95 shadow-purple-500/25'
                : currentTheme === 'wood'
                ? 'bg-gradient-to-r from-[#8a6240] to-[#b3855e] hover:opacity-95 shadow-amber-900/20'
                : currentTheme === 'mono'
                ? 'bg-slate-900 hover:bg-slate-800 shadow-slate-900/25'
                : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-blue-500/25'
            }`}
          >
            <Play className="w-4 h-4 fill-current" />
            <span>지금 단식 시작하기 ({targetHours}시간)</span>
          </button>
        )}

        {/* Quick Water Button */}
        <button
          onClick={() => onAddWater(250)}
          className={`py-3.5 px-4 rounded-2xl font-bold text-xs flex items-center justify-center space-x-1.5 transition-all active:scale-[0.98] ${
            isLight
              ? 'bg-cyan-50 text-cyan-700 border border-cyan-200 hover:bg-cyan-100 shadow-xs'
              : 'bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-400'
          }`}
          title="물 250ml 원터치 기록"
        >
          <span>💧 +250ml</span>
        </button>
      </div>
    </div>
  );
};
