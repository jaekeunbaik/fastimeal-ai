import React from 'react';
import { MealLog } from '../../types';
import { MealDetailCard } from './MealDetailCard';
import { PlusCircle, Utensils, Sparkles, Flame } from 'lucide-react';

interface MealTimelineProps {
  meals: MealLog[];
  onDeleteMeal: (logId: string) => void;
  onOpenUploader: () => void;
}

export const MealTimeline: React.FC<MealTimelineProps> = ({
  meals,
  onDeleteMeal,
  onOpenUploader,
}) => {
  // 오늘 날짜 기준 식사만 계산 (또는 전체)
  const totalCalories = meals.reduce((sum, m) => sum + (m.aiAnalysis?.total_nutrition?.calories || 0), 0);
  const totalCarbs = meals.reduce((sum, m) => sum + (m.aiAnalysis?.total_nutrition?.carbs_g || 0), 0);
  const totalProtein = meals.reduce((sum, m) => sum + (m.aiAnalysis?.total_nutrition?.protein_g || 0), 0);
  const totalFat = meals.reduce((sum, m) => sum + (m.aiAnalysis?.total_nutrition?.fat_g || 0), 0);

  return (
    <div className="w-full max-w-md mx-auto px-4 py-2 pb-24">
      {/* Header & Total Summary Bar */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center">
            <Utensils className="w-4 h-4 text-blue-400 mr-2" />
            사진 식단 타임라인
          </h2>
          <p className="text-xs text-slate-400">타임스탬프 순 자동 정렬 및 AI 영양 분석 피드</p>
        </div>

        <button
          onClick={onOpenUploader}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition-all active:scale-95"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>기록 추가</span>
        </button>
      </div>

      {/* Daily Nutrition Macro Bar */}
      {meals.length > 0 && (
        <div className="glass-card rounded-2xl p-3.5 mb-4 border border-white/10">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-slate-300">오늘 총 섭취 영양</span>
            <span className="text-orange-400 font-mono font-bold flex items-center">
              <Flame className="w-3.5 h-3.5 mr-0.5" />
              {totalCalories} kcal
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
            <div className="p-1.5 rounded-lg bg-white/5">
              <span className="text-slate-400 text-[10px]">탄수화물</span>
              <p className="font-bold text-blue-400 font-mono">{totalCarbs}g</p>
            </div>
            <div className="p-1.5 rounded-lg bg-white/5">
              <span className="text-slate-400 text-[10px]">단백질</span>
              <p className="font-bold text-emerald-400 font-mono">{totalProtein}g</p>
            </div>
            <div className="p-1.5 rounded-lg bg-white/5">
              <span className="text-slate-400 text-[10px]">지방</span>
              <p className="font-bold text-pink-400 font-mono">{totalFat}g</p>
            </div>
          </div>
        </div>
      )}

      {/* Meals Feed */}
      {meals.length === 0 ? (
        <div className="text-center py-12 px-4 glass-card rounded-3xl border border-dashed border-slate-700 my-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3">
            <Sparkles className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">아직 기록된 식단이 없습니다</h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto mb-4 leading-relaxed">
            식사 또는 음료 사진을 찍어 올리시면 AI가 자동으로 칼로리와 탄단지를 분석해드립니다.
          </p>
          <button
            onClick={onOpenUploader}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-500/30 transition-transform active:scale-95"
          >
            📸 첫 식단 사진 올리기
          </button>
        </div>
      ) : (
        <div className="space-y-1">
          {meals.map((meal) => (
            <MealDetailCard key={meal.logId} meal={meal} onDelete={onDeleteMeal} />
          ))}
        </div>
      )}
    </div>
  );
};
