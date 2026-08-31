import React from 'react';
import { MealLog, FastingSession, UserProfile, AppTheme } from '../../types';
import { BarChart3, Flame, Trophy, Activity, Sparkles, TrendingUp } from 'lucide-react';
import { THEMES } from '../../constants/themes';

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
  const currentTheme = userProfile.theme || 'pastel';
  const isLight = currentTheme !== 'dark';
  const theme = THEMES[currentTheme] || THEMES.pastel;

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
        <h2 className={`text-lg font-bold flex items-center ${isLight ? 'text-slate-800' : 'text-white'}`}>
          <BarChart3 className={`w-5 h-5 mr-2 ${currentTheme === 'pastel' ? 'text-purple-600' : 'text-blue-500'}`} />
          대사 & 영양 분석 리포트
        </h2>
        <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
          나의 간헐적 단식 성과와 영양 섭취 밸런스
        </p>
      </div>

      {/* Fasting Achievement Score Card */}
      <div className={`glass-card rounded-3xl p-4.5 transition-all ${
        currentTheme === 'pastel'
          ? 'bg-gradient-to-tr from-purple-50 via-pink-50/50 to-white border-purple-200 shadow-md shadow-purple-500/10'
          : currentTheme === 'wood'
          ? 'bg-gradient-to-tr from-[#f5ede4] to-white border-[#ebdcd0]'
          : isLight
          ? 'bg-slate-50 border-slate-200'
          : 'bg-gradient-to-tr from-blue-900/40 via-[#0d1527] to-[#121c32] border-white/10'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-2xl flex items-center justify-center ${
              isLight ? 'bg-purple-100 text-purple-600' : 'bg-blue-500/20 text-blue-400'
            }`}>
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h3 className={`text-sm font-bold ${isLight ? 'text-slate-800' : 'text-white'}`}>단식 목표 달성률</h3>
              <span className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>누적 세션 성공 현황</span>
            </div>
          </div>
          <span className={`text-2xl font-extrabold font-mono ${
            currentTheme === 'pastel' ? 'text-purple-600' : 'text-blue-500'
          }`}>{successRate}%</span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className={`p-2 rounded-2xl ${isLight ? 'bg-white shadow-xs' : 'bg-white/5'}`}>
            <span className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>총 단식 횟수</span>
            <p className={`font-bold text-sm ${isLight ? 'text-slate-800' : 'text-white'}`}>{totalSessions}회</p>
          </div>
          <div className={`p-2 rounded-2xl ${isLight ? 'bg-white shadow-xs' : 'bg-white/5'}`}>
            <span className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>목표 완주</span>
            <p className="font-bold text-emerald-600 text-sm">{completedSessions}회</p>
          </div>
          <div className={`p-2 rounded-2xl ${isLight ? 'bg-white shadow-xs' : 'bg-white/5'}`}>
            <span className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>수분 섭취량</span>
            <p className="font-bold text-cyan-600 text-sm">{todayWaterMl}ml</p>
          </div>
        </div>
      </div>

      {/* Calorie Intake Goal */}
      <div className="glass-card rounded-3xl p-4.5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-2xl bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <h3 className={`text-sm font-bold ${isLight ? 'text-slate-800' : 'text-white'}`}>일일 칼로리 예산</h3>
              <span className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>권장 섭취량 대비</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-sm font-bold text-orange-500 font-mono">{totalCalories}</span>
            <span className="text-xs text-slate-400"> / {calorieTarget} kcal</span>
          </div>
        </div>

        {/* Bar */}
        <div className={`w-full h-2.5 rounded-full overflow-hidden mb-1.5 ${isLight ? 'bg-slate-100' : 'bg-slate-800'}`}>
          <div
            className="h-full bg-gradient-to-r from-orange-400 to-amber-400 rounded-full transition-all duration-500"
            style={{ width: `${caloriePercent}%` }}
          />
        </div>
        <div className={`flex justify-between text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
          <span>{caloriePercent}% 섭취</span>
          <span>남은 예산: {Math.max(0, calorieTarget - totalCalories)} kcal</span>
        </div>
      </div>

      {/* Macro Ratio Breakdown */}
      <div className="glass-card rounded-3xl p-4.5">
        <div className="flex items-center space-x-2 mb-3">
          <Activity className="w-4 h-4 text-emerald-500" />
          <h3 className={`text-sm font-bold ${isLight ? 'text-slate-800' : 'text-white'}`}>탄•단•지 매크로 영양소 비율</h3>
        </div>

        {/* Stacked macro bar */}
        <div className={`w-full h-3 rounded-full overflow-hidden flex mb-3 ${isLight ? 'bg-slate-100' : 'bg-slate-800'}`}>
          <div style={{ width: `${carbsPct}%` }} className="bg-blue-400" title={`탄수화물 ${carbsPct}%`} />
          <div style={{ width: `${proteinPct}%` }} className="bg-emerald-400" title={`단백질 ${proteinPct}%`} />
          <div style={{ width: `${fatPct}%` }} className="bg-pink-400" title={`지방 ${fatPct}%`} />
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className={`p-2 rounded-2xl border ${
            isLight ? 'bg-blue-50/60 border-blue-100' : 'bg-blue-500/10 border-blue-500/20'
          }`}>
            <div className="flex items-center justify-center space-x-1 mb-0.5">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              <span className={`text-[10px] ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>탄수화물</span>
            </div>
            <p className="font-bold text-blue-500 font-mono text-sm">{totalCarbs}g ({carbsPct}%)</p>
          </div>

          <div className={`p-2 rounded-2xl border ${
            isLight ? 'bg-emerald-50/60 border-emerald-100' : 'bg-emerald-500/10 border-emerald-500/20'
          }`}>
            <div className="flex items-center justify-center space-x-1 mb-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className={`text-[10px] ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>단백질</span>
            </div>
            <p className="font-bold text-emerald-600 font-mono text-sm">{totalProtein}g ({proteinPct}%)</p>
          </div>

          <div className={`p-2 rounded-2xl border ${
            isLight ? 'bg-pink-50/60 border-pink-100' : 'bg-pink-500/10 border-pink-500/20'
          }`}>
            <div className="flex items-center justify-center space-x-1 mb-0.5">
              <span className="w-2 h-2 rounded-full bg-pink-400" />
              <span className={`text-[10px] ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>지방</span>
            </div>
            <p className="font-bold text-pink-500 font-mono text-sm">{totalFat}g ({fatPct}%)</p>
          </div>
        </div>
      </div>

      {/* AI Daily Metabolic Insight */}
      <div className={`glass-card rounded-3xl p-4.5 border ${
        currentTheme === 'pastel'
          ? 'bg-purple-50/70 border-purple-200 text-slate-700'
          : isLight
          ? 'bg-slate-50 border-slate-200 text-slate-700'
          : 'bg-gradient-to-r from-blue-900/20 to-indigo-900/20 border-blue-500/20'
      }`}>
        <div className={`flex items-center space-x-2 text-xs font-bold mb-2 ${
          currentTheme === 'pastel' ? 'text-purple-700' : isLight ? 'text-blue-700' : 'text-blue-300'
        }`}>
          <Sparkles className="w-4 h-4" />
          <span>FastiMeal AI 일일 코칭 총평</span>
        </div>
        <p className="text-xs leading-relaxed">
          {proteinPct >= 30
            ? '오늘 식단은 양질의 단백질 비중이 높아 근손실 없이 지방을 연소하기에 매우 최적화되어 있습니다! 충분한 수분을 유지하며 다음 공복 사이클을 이어가세요.'
            : '단백질 섭취 비율을 조금 더 높이고 가공 탄수화물을 줄이시면 혈당 스파이크를 줄이고 단식 유지력을 극대화할 수 있습니다.'}
        </p>
        <div className={`mt-2.5 pt-2 border-t flex items-center text-[11px] ${
          isLight ? 'border-purple-200/60 text-slate-500' : 'border-white/5 text-slate-400'
        }`}>
          <TrendingUp className="w-3.5 h-3.5 mr-1 text-emerald-500" />
          <span>체지방 연소 & 세포 정화(오토파지) 시너지 가속 중</span>
        </div>
      </div>
    </div>
  );
};
