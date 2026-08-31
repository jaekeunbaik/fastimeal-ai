import React from 'react';
import { MealLog, FastingSession, UserProfile } from '../../types';
import { BarChart3, Flame, Trophy, Activity, Sparkles, TrendingUp } from 'lucide-react';

interface DailyStatsSummaryProps {
  meals: MealLog[];
  sessions: FastingSession[];
  userProfile: UserProfile;
  todayWaterMl: number;
}

export const DailyStatsSummary: React.FC<DailyStatsSummaryProps> = ({
  meals,
  sessions,
  userProfile,
  todayWaterMl,
}) => {
  const totalCalories = meals.reduce((sum, m) => sum + (m.aiAnalysis?.total_nutrition?.calories || 0), 0);
  const totalCarbs = meals.reduce((sum, m) => sum + (m.aiAnalysis?.total_nutrition?.carbs_g || 0), 0);
  const totalProtein = meals.reduce((sum, m) => sum + (m.aiAnalysis?.total_nutrition?.protein_g || 0), 0);
  const totalFat = meals.reduce((sum, m) => sum + (m.aiAnalysis?.total_nutrition?.fat_g || 0), 0);

  const completedSessions = sessions.filter(s => s.status === 'COMPLETED').length;
  const totalSessions = sessions.length || 1;
  const successRate = Math.round((completedSessions / totalSessions) * 100);

  const calorieTarget = userProfile.dailyCalorieTarget || 1800;
  const caloriePercent = Math.min(100, Math.round((totalCalories / calorieTarget) * 100));

  const totalMacroGrams = totalCarbs + totalProtein + totalFat || 1;
  const carbsPct = Math.round((totalCarbs / totalMacroGrams) * 100);
  const proteinPct = Math.round((totalProtein / totalMacroGrams) * 100);
  const fatPct = Math.round((totalFat / totalMacroGrams) * 100);

  return (
    <div className="w-full max-w-md mx-auto px-4 py-2 pb-24 space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-white flex items-center">
          <BarChart3 className="w-5 h-5 text-blue-400 mr-2" />
          대사 & 영양 분석 리포트
        </h2>
        <p className="text-xs text-slate-400">나의 간헐적 단식 성과와 영양 섭취 밸런스</p>
      </div>

      {/* Fasting Achievement Score Card */}
      <div className="glass-card rounded-3xl p-4 border border-white/10 bg-gradient-to-tr from-blue-900/40 via-[#0d1527] to-[#121c32]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">단식 목표 달성률</h3>
              <span className="text-[11px] text-slate-400">누적 세션 성공 현황</span>
            </div>
          </div>
          <span className="text-2xl font-extrabold text-blue-400 font-mono">{successRate}%</span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-2 rounded-xl bg-white/5">
            <span className="text-[10px] text-slate-400">총 단식 횟수</span>
            <p className="font-bold text-white text-sm">{totalSessions}회</p>
          </div>
          <div className="p-2 rounded-xl bg-white/5">
            <span className="text-[10px] text-slate-400">목표 완주</span>
            <p className="font-bold text-emerald-400 text-sm">{completedSessions}회</p>
          </div>
          <div className="p-2 rounded-xl bg-white/5">
            <span className="text-[10px] text-slate-400">수분 섭취량</span>
            <p className="font-bold text-cyan-400 text-sm">{todayWaterMl}ml</p>
          </div>
        </div>
      </div>

      {/* Calorie Intake Goal */}
      <div className="glass-card rounded-3xl p-4 border border-white/10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">일일 칼로리 예산</h3>
              <span className="text-[11px] text-slate-400">권장 섭취량 대비</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-sm font-bold text-orange-400 font-mono">{totalCalories}</span>
            <span className="text-xs text-slate-400"> / {calorieTarget} kcal</span>
          </div>
        </div>

        {/* Bar */}
        <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden mb-1.5">
          <div
            className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full transition-all duration-500"
            style={{ width: `${caloriePercent}%` }}
          />
        </div>
        <div className="flex justify-between text-[11px] text-slate-400">
          <span>{caloriePercent}% 섭취</span>
          <span>남은 예산: {Math.max(0, calorieTarget - totalCalories)} kcal</span>
        </div>
      </div>

      {/* Macro Ratio Breakdown */}
      <div className="glass-card rounded-3xl p-4 border border-white/10">
        <div className="flex items-center space-x-2 mb-3">
          <Activity className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-white">탄•단•지 매크로 영양소 비율</h3>
        </div>

        {/* Stacked macro bar */}
        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden flex mb-3">
          <div style={{ width: `${carbsPct}%` }} className="bg-blue-500" title={`탄수화물 ${carbsPct}%`} />
          <div style={{ width: `${proteinPct}%` }} className="bg-emerald-500" title={`단백질 ${proteinPct}%`} />
          <div style={{ width: `${fatPct}%` }} className="bg-pink-500" title={`지방 ${fatPct}%`} />
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <div className="flex items-center justify-center space-x-1 mb-0.5">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-[10px] text-slate-300">탄수화물</span>
            </div>
            <p className="font-bold text-blue-400 font-mono text-sm">{totalCarbs}g ({carbsPct}%)</p>
          </div>

          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <div className="flex items-center justify-center space-x-1 mb-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[10px] text-slate-300">단백질</span>
            </div>
            <p className="font-bold text-emerald-400 font-mono text-sm">{totalProtein}g ({proteinPct}%)</p>
          </div>

          <div className="p-2 rounded-xl bg-pink-500/10 border border-pink-500/20">
            <div className="flex items-center justify-center space-x-1 mb-0.5">
              <span className="w-2 h-2 rounded-full bg-pink-500" />
              <span className="text-[10px] text-slate-300">지방</span>
            </div>
            <p className="font-bold text-pink-400 font-mono text-sm">{totalFat}g ({fatPct}%)</p>
          </div>
        </div>
      </div>

      {/* AI Daily Metabolic Insight */}
      <div className="glass-card rounded-3xl p-4 border border-blue-500/20 bg-gradient-to-r from-blue-900/20 to-indigo-900/20">
        <div className="flex items-center space-x-2 text-xs font-bold text-blue-300 mb-2">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span>FastiMeal AI 일일 코칭 총평</span>
        </div>
        <p className="text-xs text-slate-200 leading-relaxed">
          {proteinPct >= 30
            ? '오늘 식단은 양질의 단백질 비중이 높아 근손실 없이 지방을 연소하기에 매우 최적화되어 있습니다! 충분한 수분을 유지하며 다음 공복 사이클을 이어가세요.'
            : '단백질 섭취 비율을 조금 더 높이고 가공 탄수화물을 줄이시면 혈당 스파이크를 줄이고 단식 유지력을 극대화할 수 있습니다.'}
        </p>
        <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center text-[11px] text-slate-400">
          <TrendingUp className="w-3.5 h-3.5 mr-1 text-emerald-400" />
          <span>체지방 연소 & 세포 정화(오토파지) 시너지 가속 중</span>
        </div>
      </div>
    </div>
  );
};
