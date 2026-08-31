import React from 'react';
import { Trash2 } from 'lucide-react';
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
  const memo = meal.aiAnalysis?.ai_coach_comment || meal.aiAnalysis?.foods?.[0]?.name;

  return (
    <div className={`glass-card rounded-3xl overflow-hidden border transition-all ${
      isLight ? 'bg-white/95 border-slate-200/80 shadow-md' : 'border-white/10'
    }`}>
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-white/5">
        <div className="flex items-center space-x-2">
          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${badge.bg} ${badge.text}`}>
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

      {/* Large Instagram-style Photo */}
      {meal.imageUrl && (
        <div className="w-full h-64 bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <img
            src={meal.imageUrl}
            alt="Meal Photo"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      {/* Caption Memo */}
      {memo && memo !== '식단 사진 기록' && (
        <div className="px-4 py-3 text-xs leading-relaxed text-slate-700 dark:text-slate-200">
          <p>{memo}</p>
        </div>
      )}
    </div>
  );
};
