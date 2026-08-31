import React, { useState } from 'react';
import { MealLog } from '../../types';
import { Flame, Clock, Trash2, Sparkles, ChevronDown, ChevronUp, AlertCircle, CheckCircle2 } from 'lucide-react';

interface MealDetailCardProps {
  meal: MealLog;
  onDelete: (logId: string) => void;
}

export const MealDetailCard: React.FC<MealDetailCardProps> = ({ meal, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { aiAnalysis, consumedAt, isDuringFasting, mealType, imageUrl } = meal;

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
    <div className="glass-card rounded-3xl overflow-hidden border border-white/10 shadow-xl transition-all hover:border-white/20 mb-3.5 bg-[#0f172a]/80">
      {/* Top Media & Tags Header */}
      <div className="relative h-44 w-full bg-slate-800">
        <img src={imageUrl} alt="Meal" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-black/40" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center space-x-1.5">
          <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-bold text-white border border-white/10 flex items-center">
            <Clock className="w-3 h-3 mr-1 text-slate-400" />
            {timeStr} • {typeLabels[mealType]}
          </span>
          {isDuringFasting && (
            <span className="px-2.5 py-1 rounded-full bg-amber-500/80 backdrop-blur-md text-[10px] font-bold text-white flex items-center shadow-md shadow-amber-500/30">
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
                ? 'bg-emerald-500/80 text-white border-emerald-400/30'
                : aiAnalysis.sugar_spike_risk === 'MEDIUM'
                ? 'bg-amber-500/80 text-white border-amber-400/30'
                : 'bg-rose-500/80 text-white border-rose-400/30'
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
                <span className="text-xs text-slate-300 font-normal ml-1">외 {aiAnalysis.foods.length - 1}개</span>
              )}
            </h3>
          </div>
          <div className="flex items-center text-orange-400 font-mono font-extrabold text-lg drop-shadow-md">
            <Flame className="w-4 h-4 fill-current mr-0.5" />
            <span>{aiAnalysis.total_nutrition.calories}</span>
            <span className="text-xs text-slate-300 font-normal ml-0.5">kcal</span>
          </div>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-3.5">
        {/* Macro breakdown pills */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs mb-3">
          <div className="p-1.5 rounded-xl bg-white/5 border border-white/5">
            <span className="text-[10px] text-slate-400">탄수화물</span>
            <p className="font-bold text-blue-400 font-mono">{aiAnalysis.total_nutrition.carbs_g}g</p>
          </div>
          <div className="p-1.5 rounded-xl bg-white/5 border border-white/5">
            <span className="text-[10px] text-slate-400">단백질</span>
            <p className="font-bold text-emerald-400 font-mono">{aiAnalysis.total_nutrition.protein_g}g</p>
          </div>
          <div className="p-1.5 rounded-xl bg-white/5 border border-white/5">
            <span className="text-[10px] text-slate-400">지방</span>
            <p className="font-bold text-pink-400 font-mono">{aiAnalysis.total_nutrition.fat_g}g</p>
          </div>
        </div>

        {/* AI Quick Comment snippet */}
        <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-slate-300 mb-2 flex items-start space-x-2">
          <Sparkles className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
          <p className="leading-snug text-slate-300">{aiAnalysis.ai_coach_comment}</p>
        </div>

        {/* Expanded details */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-white/10 space-y-2.5 animate-fade-in">
            <div>
              <span className="text-[11px] font-bold text-slate-400 block mb-1">상세 음식 구성:</span>
              <div className="space-y-1">
                {aiAnalysis.foods.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs text-slate-300 py-0.5">
                    <span>• {item.name} ({item.portion})</span>
                    <span className="font-mono text-slate-400">{item.calories} kcal</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-2 rounded-xl bg-white/5 text-[11px] text-slate-300 flex items-center space-x-1.5">
              {aiAnalysis.fasting_impact.breaks_fast ? (
                <AlertCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              )}
              <span>{aiAnalysis.fasting_impact.status_message}</span>
            </div>
          </div>
        )}

        {/* Footer controls */}
        <div className="flex items-center justify-between pt-2 mt-1 border-t border-white/5 text-xs text-slate-400">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-1 text-slate-400 hover:text-white transition-colors"
          >
            <span>{isExpanded ? '간략히 보기' : '상세 영양 성분'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => onDelete(meal.logId)}
            className="p-1.5 rounded-lg hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-colors"
            title="기록 삭제"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
