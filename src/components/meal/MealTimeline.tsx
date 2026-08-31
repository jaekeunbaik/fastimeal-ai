import React from 'react';
import { MealLog, AppTheme } from '../../types';
import { MealDetailCard } from './MealDetailCard';
import { PlusCircle, Utensils, Sparkles, Flame } from 'lucide-react';
import { THEMES } from '../../constants/themes';

interface MealTimelineProps {
  meals: MealLog[];
  currentTheme?: AppTheme;
  onDeleteMeal: (logId: string) => void;
  onOpenUploader: () => void;
}

export const MealTimeline: React.FC<MealTimelineProps> = ({
  meals,
  currentTheme = 'pastel',
  onDeleteMeal,
  onOpenUploader,
}) => {
  const isLight = currentTheme !== 'dark';
  const theme = THEMES[currentTheme] || THEMES.pastel;

  const totalCalories = meals.reduce((sum, m) => sum + (m.aiAnalysis?.total_nutrition?.calories || 0), 0);
  const totalCarbs = meals.reduce((sum, m) => sum + (m.aiAnalysis?.total_nutrition?.carbs_g || 0), 0);
  const totalProtein = meals.reduce((sum, m) => sum + (m.aiAnalysis?.total_nutrition?.protein_g || 0), 0);
  const totalFat = meals.reduce((sum, m) => sum + (m.aiAnalysis?.total_nutrition?.fat_g || 0), 0);

  return (
    <div className="w-full max-w-md mx-auto px-4 py-2 pb-24">
      {/* Header & Total Summary Bar */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className={`text-lg font-bold flex items-center ${isLight ? 'text-slate-800' : 'text-white'}`}>
            <Utensils className={`w-4 h-4 mr-2 ${currentTheme === 'pastel' ? 'text-purple-600' : 'text-blue-500'}`} />
            사진 식단 타임라인
          </h2>
          <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            타임스탬프 순 자동 정렬 및 AI 영양 분석 피드
          </p>
        </div>

        <button
          onClick={onOpenUploader}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-2xl text-white text-xs font-semibold shadow-md transition-all active:scale-95 ${
            currentTheme === 'pastel'
              ? 'bg-purple-600 hover:bg-purple-500 shadow-purple-500/20'
              : currentTheme === 'wood'
              ? 'bg-[#8a6240] hover:bg-[#735134] shadow-amber-900/20'
              : currentTheme === 'mono'
              ? 'bg-slate-900 hover:bg-slate-800'
              : 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/20'
          }`}
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>기록 추가</span>
        </button>
      </div>

      {/* Daily Nutrition Macro Bar */}
      {meals.length > 0 && (
        <div className="glass-card rounded-3xl p-4 mb-4">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className={`font-bold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>오늘 총 섭취 영양</span>
            <span className="text-orange-500 font-mono font-bold flex items-center">
              <Flame className="w-3.5 h-3.5 mr-0.5" />
              {totalCalories} kcal
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className={`p-2 rounded-2xl border ${
              isLight ? 'bg-purple-50/50 border-purple-100' : 'bg-white/5 border-white/5'
            }`}>
              <span className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>탄수화물</span>
              <p className="font-bold text-blue-500 font-mono">{totalCarbs}g</p>
            </div>
            <div className={`p-2 rounded-2xl border ${
              isLight ? 'bg-emerald-50/50 border-emerald-100' : 'bg-white/5 border-white/5'
            }`}>
              <span className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>단백질</span>
              <p className="font-bold text-emerald-600 font-mono">{totalProtein}g</p>
            </div>
            <div className={`p-2 rounded-2xl border ${
              isLight ? 'bg-pink-50/50 border-pink-100' : 'bg-white/5 border-white/5'
            }`}>
              <span className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>지방</span>
              <p className="font-bold text-pink-500 font-mono">{totalFat}g</p>
            </div>
          </div>
        </div>
      )}

      {/* Section Title */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-base font-bold flex items-center space-x-1.5">
            <Utensils className="w-4 h-4 text-purple-600 dark:text-emerald-400" />
            <span>사진 식단 다이어리</span>
          </h2>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            시간 순 정렬 및 식단 영양 기록 피드
          </p>
        </div>

        <button
          onClick={onOpenUploader}
          className="px-3 py-1.5 rounded-full text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white flex items-center space-x-1 shadow-sm transition-all active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>기록 추가</span>
        </button>
      </div>

      {/* Meals Feed or Empty State */}
      {meals.length === 0 ? (
        <div className="glass-card rounded-3xl p-8 text-center flex flex-col items-center justify-center border">
          <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-white/5 text-purple-600 dark:text-purple-300 flex items-center justify-center mb-3 shadow-xs">
            <Utensils className="w-7 h-7" />
          </div>
          <h3 className="text-sm font-bold mb-1 text-slate-800 dark:text-white">
            아직 기록된 식단이 없습니다
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mb-4 leading-relaxed">
            오늘 먹은 식사나 음료 사진을 찍어 나만의 건강한 식단 다이어리를 기록해보세요.
          </p>
          <button
            onClick={onOpenUploader}
            className="px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-purple-500/20 active:scale-95 transition-all"
          >
            <span>📸 첫 식단 사진 올리기</span>
          </button>
        </div>
      ) : (
        <div className="space-y-1">
          {meals.map((meal) => (
            <MealDetailCard
              key={meal.logId}
              meal={meal}
              currentTheme={currentTheme}
              onDelete={onDeleteMeal}
            />
          ))}
        </div>
      )}
    </div>
  );
};
