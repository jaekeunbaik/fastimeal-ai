import React, { useState, useRef } from 'react';
import { X, Camera, Image, Utensils, Check, Flame, Clock } from 'lucide-react';
import { MealLog, AppTheme, MealType } from '../../types';
import { StorageService } from '../../services/storageService';

interface MealUploaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme?: AppTheme;
  onMealAdded: (meal: MealLog) => void;
}

const MEAL_TYPES: { type: MealType; label: string; emoji: string }[] = [
  { type: 'LUNCH', label: '점심', emoji: '🍱' },
  { type: 'DINNER', label: '저녁', emoji: '🥗' },
  { type: 'BREAKFAST', label: '아침', emoji: '🍳' },
  { type: 'SNACK', label: '간식/음료', emoji: '☕' },
];

export const MealUploaderModal: React.FC<MealUploaderModalProps> = ({
  isOpen,
  onClose,
  currentTheme = 'pastel',
  onMealAdded,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mealType, setMealType] = useState<MealType>('LUNCH');
  const [menuName, setMenuName] = useState('');
  const [calories, setCalories] = useState('650');
  const [carbs, setCarbs] = useState('65');
  const [protein, setProtein] = useState('32');
  const [fat, setFat] = useState('18');
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
    if (!menuName.trim() && !selectedImage) {
      alert('식단 사진을 등록하거나 메뉴명을 입력해주세요.');
      return;
    }

    const newMeal: MealLog = {
      mealId: `meal_${Date.now()}`,
      userId: 'user_local',
      imageUrl: selectedImage || undefined,
      mealType,
      menuName: menuName.trim() || `${MEAL_TYPES.find(m => m.type === mealType)?.label || '식사'} 기록`,
      calories: Number(calories) || 500,
      carbs: Number(carbs) || 50,
      protein: Number(protein) || 25,
      fat: Number(fat) || 15,
      glycemicSpikeRisk: 'LOW',
      isFastingBroken: false,
      aiCoachComment: memo.trim() || '영양 밸런스를 맞춘 식단 기록입니다.',
      loggedAt: new Date().toISOString(),
    };

    StorageService.saveMeal(newMeal);
    onMealAdded(newMeal);
    handleClose();
  };

  const handleClose = () => {
    setSelectedImage(null);
    setMenuName('');
    setMemo('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className={`w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl p-5 border shadow-2xl transition-all flex flex-col ${
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
              <h2 className="text-base font-bold">식단 사진 기록</h2>
              <p className="text-[11px] text-slate-400">오늘 먹은 식사를 간편하게 기록하세요</p>
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
          {/* 1. Meal Type Selector */}
          <div>
            <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1.5">식사 구분</label>
            <div className="grid grid-cols-4 gap-1.5">
              {MEAL_TYPES.map((m) => (
                <button
                  key={m.type}
                  type="button"
                  onClick={() => setMealType(m.type)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center space-y-0.5 border ${
                    mealType === m.type
                      ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                      : isLight
                      ? 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-purple-50'
                      : 'bg-white/5 text-slate-300 border-white/5'
                  }`}
                >
                  <span className="text-sm">{m.emoji}</span>
                  <span>{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Photo Upload or Preview */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`relative w-full h-44 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all ${
              selectedImage
                ? 'border-purple-400'
                : isLight
                ? 'border-purple-200 bg-purple-50/40 hover:bg-purple-50'
                : 'border-white/10 bg-white/5 hover:bg-white/10'
            }`}
          >
            {selectedImage ? (
              <>
                <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-md text-white text-[10px] font-bold flex items-center space-x-1">
                  <Camera className="w-3 h-3" />
                  <span>사진 변경</span>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center text-center p-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mb-2 shadow-xs">
                  <Image className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  음식 사진 갤러리/카메라 선택
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">
                  사진을 누르면 바로 불러옵니다
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

          {/* 3. Menu Name & Calories Inputs */}
          <div className="space-y-2.5">
            <div>
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">메뉴 이름</label>
              <input
                type="text"
                placeholder="예: 닭가슴살 샐러드, 김치찌개, 삼겹살"
                value={menuName}
                onChange={(e) => setMenuName(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold border transition-all focus:outline-none ${
                  isLight
                    ? 'bg-slate-50 border-slate-200 text-slate-800 focus:border-purple-500 focus:bg-white'
                    : 'bg-slate-800 border-slate-700 text-white'
                }`}
              />
            </div>

            {/* Quick Nutrition (Calories, Carbs, Protein, Fat) */}
            <div className="grid grid-cols-4 gap-2">
              <div>
                <label className="text-[10px] text-slate-500 font-semibold block mb-1">칼로리(kcal)</label>
                <input
                  type="number"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  className={`w-full px-2 py-2 rounded-xl text-xs font-mono font-bold border text-center ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-800 border-slate-700 text-white'
                  }`}
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 font-semibold block mb-1">탄수화물(g)</label>
                <input
                  type="number"
                  value={carbs}
                  onChange={(e) => setCarbs(e.target.value)}
                  className={`w-full px-2 py-2 rounded-xl text-xs font-mono font-bold border text-center ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-800 border-slate-700 text-white'
                  }`}
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 font-semibold block mb-1">단백질(g)</label>
                <input
                  type="number"
                  value={protein}
                  onChange={(e) => setProtein(e.target.value)}
                  className={`w-full px-2 py-2 rounded-xl text-xs font-mono font-bold border text-center ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-800 border-slate-700 text-white'
                  }`}
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 font-semibold block mb-1">지방(g)</label>
                <input
                  type="number"
                  value={fat}
                  onChange={(e) => setFat(e.target.value)}
                  className={`w-full px-2 py-2 rounded-xl text-xs font-mono font-bold border text-center ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-800 border-slate-700 text-white'
                  }`}
                />
              </div>
            </div>

            {/* Memo */}
            <div>
              <label className="text-[10px] text-slate-500 font-semibold block mb-1">메모 (선택)</label>
              <input
                type="text"
                placeholder="식단에 대한 간단한 메모"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl text-xs border ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-800 border-slate-700 text-white'
                }`}
              />
            </div>
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
            <span>식단 저장하기</span>
          </button>
        </div>
      </div>
    </div>
  );
};
