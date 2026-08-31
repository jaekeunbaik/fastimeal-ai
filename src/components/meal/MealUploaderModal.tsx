import React, { useState, useRef } from 'react';
import { X, Camera, Image, Check, Sparkles } from 'lucide-react';
import { MealLog, AppTheme } from '../../types';
import { StorageService } from '../../services/storageService';

interface MealUploaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme?: AppTheme;
  onMealAdded: (meal: MealLog) => void;
}

const MEAL_TYPES: { type: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'drink'; label: string; emoji: string }[] = [
  { type: 'lunch', label: '점심', emoji: '🍱' },
  { type: 'dinner', label: '저녁', emoji: '🥗' },
  { type: 'breakfast', label: '아침', emoji: '🍳' },
  { type: 'snack', label: '간식/음료', emoji: '☕' },
];

export const MealUploaderModal: React.FC<MealUploaderModalProps> = ({
  isOpen,
  onClose,
  currentTheme = 'pastel',
  onMealAdded,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack' | 'drink'>('lunch');
  const [memo, setMemo] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const isLight = currentTheme !== 'dark';

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveMeal = () => {
    if (!selectedImage) {
      alert('식단 사진을 선택해주세요.');
      return;
    }

    const typeLabel = MEAL_TYPES.find(m => m.type === mealType)?.label || '식사';

    const newMeal: MealLog = {
      logId: `meal_${Date.now()}`,
      userId: 'user_local',
      imageUrl: selectedImage,
      consumedAt: new Date().toISOString(),
      isDuringFasting: false,
      mealType,
      aiAnalysis: {
        foods: [
          {
            name: memo.trim() || `${typeLabel} 기록`,
            portion: '1회',
            calories: 0,
            carbs_g: 0,
            protein_g: 0,
            fat_g: 0,
          }
        ],
        total_nutrition: {
          calories: 0,
          carbs_g: 0,
          protein_g: 0,
          fat_g: 0,
        },
        sugar_spike_risk: 'LOW',
        fasting_impact: {
          breaks_fast: false,
          status_message: '식단 사진 기록',
        },
        ai_coach_comment: memo.trim() || '',
      }
    };

    StorageService.addMeal(newMeal);
    onMealAdded(newMeal);
    handleClose();
  };

  const handleClose = () => {
    setSelectedImage(null);
    setMemo('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className={`w-full max-w-md max-h-[88vh] overflow-y-auto rounded-3xl p-5 border shadow-2xl transition-all flex flex-col ${
        isLight ? 'bg-white text-slate-800 border-purple-100' : 'bg-[#0e1628] text-white border-white/10'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between pb-3 border-b mb-3.5 ${
          isLight ? 'border-slate-100' : 'border-white/10'
        }`}>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold">식단 사진 올리기</h2>
              <p className="text-[11px] text-slate-400">사진을 선택하고 바로 저장하세요</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className={`p-1.5 rounded-full transition-colors ${
              isLight ? 'hover:bg-slate-100 text-slate-400' : 'hover:bg-white/10 text-slate-400'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <div className="space-y-3.5 flex-1">
          {/* 1. Photo Selection Box (Main Focus) */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`relative w-full h-64 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all ${
              selectedImage
                ? 'border-purple-500 shadow-md ring-2 ring-purple-400/30'
                : isLight
                ? 'border-purple-200 bg-purple-50/40 hover:bg-purple-50'
                : 'border-white/10 bg-white/5 hover:bg-white/10'
            }`}
          >
            {selectedImage ? (
              <>
                <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-md text-white text-xs font-bold flex items-center space-x-1">
                    <Camera className="w-3.5 h-3.5" />
                    <span>다른 사진으로 변경</span>
                  </span>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center text-center p-6">
                <div className="w-16 h-16 rounded-3xl bg-purple-100 text-purple-600 flex items-center justify-center mb-3 shadow-md">
                  <Image className="w-8 h-8" />
                </div>
                <span className="text-sm font-bold text-slate-800 dark:text-white">
                  식단 사진 촬영 또는 갤러리 선택
                </span>
                <span className="text-xs text-slate-400 mt-1">
                  여기를 누르면 바로 사진을 불러옵니다 📸
                </span>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          {/* 2. Quick Meal Type Chips */}
          <div>
            <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1.5">식사 구분</label>
            <div className="grid grid-cols-4 gap-1.5">
              {MEAL_TYPES.map((m) => (
                <button
                  key={m.type}
                  type="button"
                  onClick={() => setMealType(m.type)}
                  className={`py-2.5 rounded-2xl text-xs font-bold transition-all flex flex-col items-center space-y-0.5 border ${
                    mealType === m.type
                      ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                      : isLight
                      ? 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-purple-50'
                      : 'bg-white/5 text-slate-300 border-white/5'
                  }`}
                >
                  <span className="text-base">{m.emoji}</span>
                  <span>{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Simple Memo (Optional) */}
          <div>
            <label className="text-[11px] text-slate-500 font-semibold block mb-1">한 줄 메모 (선택)</label>
            <input
              type="text"
              placeholder="예: 샐러드랑 계란, 회사 동료와 점심 등"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold border transition-all focus:outline-none ${
                isLight
                  ? 'bg-slate-50 border-slate-200 text-slate-800 focus:border-purple-500 focus:bg-white'
                  : 'bg-slate-800 border-slate-700 text-white'
              }`}
            />
          </div>
        </div>

        {/* Action Button */}
        <div className={`pt-3.5 mt-3 border-t ${isLight ? 'border-slate-100' : 'border-white/10'}`}>
          <button
            onClick={handleSaveMeal}
            className={`w-full py-3.5 rounded-2xl font-extrabold text-xs flex items-center justify-center space-x-1.5 text-white shadow-lg active:scale-[0.98] transition-all ${
              currentTheme === 'pastel'
                ? 'bg-purple-600 hover:bg-purple-500 shadow-purple-500/25'
                : 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/25'
            }`}
          >
            <Check className="w-4 h-4" />
            <span>사진 올리기 완료</span>
          </button>
        </div>
      </div>
    </div>
  );
};
