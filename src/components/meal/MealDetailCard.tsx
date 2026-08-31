import React, { useState } from 'react';
import { MealLog, AppTheme } from '../../types';
import { Flame, Clock, Trash2, Sparkles, ChevronDown, ChevronUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { THEMES } from '../../constants/themes';

interface MealDetailCardProps {
  meal: MealLog;
  currentTheme?: AppTheme;
  onDelete: (logId: string) => void;
}

export const MealDetailCard: React.FC<MealDetailCardProps> = ({ meal, currentTheme = 'pastel', onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { aiAnalysis, consumedAt, isDuringFasting, mealType, imageUrl } = meal;
  const isLight = currentTheme !== 'dark';

  const dateObj = new Date(consumedAt);
  const timeStr = `${dateObj.getHours().toString().padStart(2, '0')}:${dateObj.getMinutes().toString().padStart(2, '0')}`;

  const typeLabels = {
    breakfast: '아침',
    lunch: '점심',
    dinner: '저녁',
    snack: '간식',
    drink: '음료',
  };

  return (
    <div className={`glass-card rounded-3xl overflow-hidden border transition-all mb-3.5 ${
      currentTheme === 'pastel'
        ? 'border-purple-100 bg-white/90 shadow-md shadow-purple-500/5 hover:border-purple-200'
        : currentTheme === 'wood'
        ? 'border-[#ebdcd0] bg-white/95 shadow-md shadow-amber-900/5 hover:border-[#ddcdbf]'
        : isLight
        ? 'border-slate-200 bg-white shadow-xs hover:border-slate-300'
        : 'border-white/10 bg-[#0f172a]/80 hover:border-white/20'
    }`}>
      {/* Top Media & Tags Header */}
      <div className="relative h-44 w-full bg-slate-200 dark:bg-slate-800">
        <img src={imageUrl} alt="Meal" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center space-x-1.5">
          <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-bold text-white border border-white/10 flex items-center">
            <Clock className="w-3 h-3 mr-1 text-slate-300" />
            {timeStr} • {typeLabels[mealType]}
          </span>
          {isDuringFasting && (
            <span className="px-2.5 py-1 rounded-full bg-amber-500/90 backdrop-blur-md text-[10px] font-bold text-white flex items-center shadow-md shadow-amber-500/30">
              <AlertCircle className="w-3 h-3 mr-1" />
              공복 섭취
            </span>
          )}
        </div>

        {/* Sugar Spike Risk Badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold backdrop-blur-md border ${
              aiAnalysis.sugar_spike_risk === 'LOW'
                ? 'bg-emerald-500/90 text-white border-emerald-400/30'
                : aiAnalysis.sugar_spike_risk === 'MEDIUM'
                ? 'bg-amber-500/90 text-white border-amber-400/30'
                : 'bg-rose-500/90 text-white border-rose-400/30'
            }`}
          >
            혈당 위험도: {aiAnalysis.sugar_spike_risk}
          </span>
        </div>

        {/* Bottom overlay total calories */}
        <div className="absolute bottom-2.5 left-3.5 right-3.5 flex items-center justify-between text-white">
          <div>
            <h3 className="text-base font-bold drop-shadow-md flex items-center">
              {aiAnalysis.foods[0]?.name || '식사 기록'}
              {aiAnalysis.foods.length > 1 && (
                <span className="text-xs text-slate-200 font-normal ml-1">외 {aiAnalysis.foods.length - 1}개</span>
              )}
            </h3>
          </div>
          <div className="flex items-center text-orange-300 font-mono font-extrabold text-lg drop-shadow-md">
            <Flame className="w-4 h-4 fill-current mr-0.5" />
            <span>{aiAnalysis.total_nutrition.calories}</span>
            <span className="text-xs text-slate-200 font-normal ml-0.5">kcal</span>
          </div>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-3.5">
        {/* Macro breakdown pills */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs mb-3">
          <div className={`p-1.5 rounded-xl border ${
            isLight ? 'bg-purple-50/60 border-purple-100' : 'bg-white/5 border-white/5'
          }`}>
            <span className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>탄수화물</span>
            <p className="font-bold text-blue-500 font-mono">{aiAnalysis.total_nutrition.carbs_g}g</p>
          </div>
          <div className={`p-1.5 rounded-xl border ${
            isLight ? 'bg-emerald-50/60 border-emerald-100' : 'bg-white/5 border-white/5'
          }`}>
            <span className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>단백질</span>
            <p className="font-bold text-emerald-600 font-mono">{aiAnalysis.total_nutrition.protein_g}g</p>
          </div>
          <div className={`p-1.5 rounded-xl border ${
            isLight ? 'bg-pink-50/60 border-pink-100' : 'bg-white/5 border-white/5'
          }`}>
            <span className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>지방</span>
            <p className="font-bold text-pink-500 font-mono">{aiAnalysis.total_nutrition.fat_g}g</p>
          </div>
        </div>

        {/* AI Quick Comment snippet */}
        <div className={`p-2.5 rounded-2xl text-xs mb-2 flex items-start space-x-2 ${
          currentTheme === 'pastel'
            ? 'bg-purple-50/80 border border-purple-200/70 text-slate-700'
            : currentTheme === 'wood'
            ? 'bg-[#f4ece4] border border-[#ddcdbf] text-[#524132]'
            : isLight
            ? 'bg-slate-50 border border-slate-200 text-slate-700'
            : 'bg-blue-500/10 border border-blue-500/20 text-slate-300'
        }`}>
          <Sparkles className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${
            currentTheme === 'pastel' ? 'text-purple-600' : isLight ? 'text-blue-600' : 'text-blue-400'
          }`} />
          <p className="leading-snug">{aiAnalysis.ai_coach_comment}</p>
        </div>

        {/* Expanded details */}
        {isExpanded && (
          <div className={`mt-3 pt-3 border-t space-y-2.5 animate-fade-in ${
            isLight ? 'border-slate-100' : 'border-white/10'
          }`}>
            <div>
              <span className={`text-[11px] font-bold block mb-1 ${
                isLight ? 'text-slate-600' : 'text-slate-400'
              }`}>상세 음식 구성:</span>
              <div className="space-y-1">
                {aiAnalysis.foods.map((food, idx) => (
                  <div key={idx} className={`flex justify-between items-center text-xs py-0.5 ${
                    isLight ? 'text-slate-700' : 'text-slate-300'
                  }`}>
                    <span>• {food.name} <span className="text-slate-400 text-[10px]">({food.portion})</span></span>
                    <span className="font-mono font-semibold text-slate-500">{food.calories} kcal</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={`p-2 rounded-xl text-[11px] flex items-center space-x-1.5 ${
              isLight ? 'bg-slate-50 text-slate-700' : 'bg-white/5 text-slate-300'
            }`}>
              {aiAnalysis.fasting_impact.breaks_fast ? (
                <AlertCircle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
              )}
              <span>{aiAnalysis.fasting_impact.status_message}</span>
            </div>
          </div>
        )}

        {/* Footer controls */}
        <div className={`flex items-center justify-between pt-2 mt-1 border-t text-xs ${
          isLight ? 'border-slate-100 text-slate-500' : 'border-white/5 text-slate-400'
        }`}>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`flex items-center space-x-1 transition-colors ${
              isLight ? 'hover:text-slate-800' : 'hover:text-white'
            }`}
          >
            <span>{isExpanded ? '간략히 보기' : '상세 영양 성분'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => onDelete(meal.logId)}
            className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
            title="기록 삭제"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
