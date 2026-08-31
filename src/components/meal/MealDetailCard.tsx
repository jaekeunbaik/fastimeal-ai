import React from 'react';
import { Trash2, Flame } from 'lucide-react';
import { MealLog, AppTheme } from '../../types';

interface MealDetailCardProps {
  meal: MealLog;
  currentTheme?: AppTheme;
  onDelete: (mealId: string) => void;
}

const TYPE_BADGES: Record<string, { label: string; bg: string; text: string }> = {
  breakfast: { label: '아침 🍳', bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-300' },
  lunch: { label: '점심 🍱', bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-300' },
  dinner: { label: '저녁 🥗', bg: 'bg-indigo-100 dark:bg-indigo-900/30', text: 'text-indigo-700 dark:text-indigo-300' },
  snack: { label: '간식 ☕', bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-300' },
  drink: { label: '음료 🥤', bg: 'bg-cyan-100 dark:bg-cyan-900/30', text: 'text-cyan-700 dark:text-cyan-300' },
};

export const MealDetailCard: React.FC<MealDetailCardProps> = ({
  meal,
  currentTheme = 'pastel',
  onDelete,
}) => {
  const isLight = currentTheme !== 'dark';
  const badge = TYPE_BADGES[meal.mealType] || TYPE_BADGES.lunch;

  const dateObj = new Date(meal.consumedAt);
  const timeStr = `${dateObj.getHours().toString().padStart(2, '0')}:${dateObj.getMinutes().toString().padStart(2, '0')}`;

  const food = meal.aiAnalysis?.foods?.[0];
  const menuName = food?.name || '식사 기록';
  const total = meal.aiAnalysis?.total_nutrition;
  const calories = total?.calories || food?.calories || 0;
  const carbs = total?.carbs_g || food?.carbs_g || 0;
  const protein = total?.protein_g || food?.protein_g || 0;
  const fat = total?.fat_g || food?.fat_g || 0;
  const memo = meal.aiAnalysis?.ai_coach_comment;

  return (
    <div className={`glass-card rounded-3xl p-4 border transition-all ${
      isLight ? 'bg-white/90 border-slate-200/80 shadow-sm' : 'border-white/10'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${badge.bg} ${badge.text}`}>
            {badge.label}
          </span>
          <span className={`text-xs font-mono font-bold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            {timeStr}
          </span>
        </div>

        <button
          onClick={() => onDelete(meal.logId)}
          className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
          title="삭제"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Main Content: Photo + Details */}
      <div className="flex space-x-3.5">
        {meal.imageUrl ? (
          <img
            src={meal.imageUrl}
            alt={menuName}
            className="w-20 h-20 rounded-2xl object-cover border border-slate-200 dark:border-white/10 shadow-xs shrink-0"
          />
        ) : (
          <div className="w-20 h-20 rounded-2xl bg-purple-50 dark:bg-white/5 border border-purple-100 dark:border-white/10 flex items-center justify-center text-2xl shrink-0">
            🍽️
          </div>
        )}

        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            <h4 className={`text-sm font-bold truncate ${isLight ? 'text-slate-800' : 'text-white'}`}>
              {menuName}
            </h4>
            <div className="flex items-center space-x-1.5 mt-0.5">
              <Flame className="w-3.5 h-3.5 text-orange-500 shrink-0" />
              <span className={`text-xs font-extrabold font-mono ${isLight ? 'text-slate-800' : 'text-white'}`}>
                {calories} kcal
              </span>
            </div>
          </div>

          {/* Macros */}
          <div className="flex items-center space-x-2 text-[10px] font-mono mt-1 text-slate-500 dark:text-slate-400">
            <span>탄 <strong>{carbs}g</strong></span>
            <span>·</span>
            <span>단 <strong>{protein}g</strong></span>
            <span>·</span>
            <span>지 <strong>{fat}g</strong></span>
          </div>
        </div>
      </div>

      {/* Memo Note if present */}
      {memo && memo !== '영양 밸런스를 맞춘 식단 기록입니다.' && (
        <div className={`mt-3 pt-2.5 border-t text-[11px] leading-snug ${
          isLight ? 'border-slate-100 text-slate-600' : 'border-white/5 text-slate-300'
        }`}>
          <p className="line-clamp-2">📝 {memo}</p>
        </div>
      )}
    </div>
  );
};
