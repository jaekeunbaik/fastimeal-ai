import React from 'react';
import { MealLog, AppTheme } from '../../types';
import { MealDetailCard } from './MealDetailCard';
import { Utensils, Plus, Camera } from 'lucide-react';

interface MealTimelineProps {
  meals: MealLog[];
  currentTheme?: AppTheme;
  onOpenUploader: () => void;
  onDeleteMeal: (mealId: string) => void;
}

export const MealTimeline: React.FC<MealTimelineProps> = ({
  meals,
  currentTheme = 'pastel',
  onOpenUploader,
  onDeleteMeal,
}) => {
  const isLight = currentTheme !== 'dark';

  return (
    <div className="w-full max-w-md mx-auto px-4 py-3 space-y-4">
      {/* Section Title & Add Photo Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold flex items-center space-x-1.5">
            <Camera className="w-4 h-4 text-purple-600 dark:text-emerald-400" />
            <span>오늘의 식단 사진 피드</span>
          </h2>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            총 {meals.length}개의 사진 기록
          </p>
        </div>

        <button
          onClick={onOpenUploader}
          className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white flex items-center space-x-1 shadow-md shadow-purple-500/20 transition-all active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>사진 추가</span>
        </button>
      </div>

      {/* Meals Feed or Empty State */}
      {meals.length === 0 ? (
        <div className="glass-card rounded-3xl p-8 text-center flex flex-col items-center justify-center border">
          <div className="w-16 h-16 rounded-3xl bg-purple-100 dark:bg-white/5 text-purple-600 dark:text-purple-300 flex items-center justify-center mb-3 shadow-xs">
            <Camera className="w-8 h-8" />
          </div>
          <h3 className="text-sm font-bold mb-1 text-slate-800 dark:text-white">
            아직 올라온 식단 사진이 없어요
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mb-4 leading-relaxed">
            오늘 먹은 음식 사진을 계속 찍어서 올려보세요. 타임라인에 예쁘게 기록됩니다! 📸
          </p>
          <button
            onClick={onOpenUploader}
            className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs flex items-center space-x-1.5 shadow-lg shadow-purple-500/25 active:scale-95 transition-all"
          >
            <Camera className="w-4 h-4" />
            <span>첫 식단 사진 올리기</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {meals.map((meal) => (
            <MealDetailCard
              key={meal.logId}
              meal={meal}
              currentTheme={currentTheme}
              onDelete={onDeleteMeal}
            />
          ))}

          {/* Bottom Add Photo Quick CTA */}
          <button
            onClick={onOpenUploader}
            className={`w-full py-3.5 rounded-2xl border-2 border-dashed font-bold text-xs flex items-center justify-center space-x-1.5 transition-all ${
              isLight
                ? 'border-purple-200 text-purple-700 bg-purple-50/40 hover:bg-purple-50'
                : 'border-white/10 text-slate-300 hover:bg-white/5'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>+ 또 다른 식단 사진 올리기</span>
          </button>
        </div>
      )}
    </div>
  );
};
