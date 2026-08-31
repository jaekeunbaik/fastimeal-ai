import React, { useState, useRef } from 'react';
import { X, Camera, Upload, Sparkles, AlertTriangle, CheckCircle2, Flame, Loader2, ArrowRight } from 'lucide-react';
import { FastingState, MealLog, AIAnalysisResult } from '../../types';
import { analyzeFoodImage } from '../../services/aiVisionService';
import { StorageService } from '../../services/storageService';

interface MealUploaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  fastingState: FastingState;
  elapsedHours: number;
  onMealAdded: (meal: MealLog) => void;
  onStopFastingRequest?: () => void;
}

const PRESET_SAMPLES = [
  {
    name: '🥗 고단백 아보카도 샐러드',
    desc: '수비드 닭가슴살 + 아보카도 + 삶은달걀',
    url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: '☕ 아이스 아메리카노 (0kcal)',
    desc: '무가당 블랙 커피 (단식 유지)',
    url: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: '🥩 소고기 스테이크 & 구운 채소',
    desc: '부채살 스테이크 + 아스파라거스',
    url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: '🍰 딸기 조각 케이크 (단순당)',
    desc: '혈당 스파이크 고위험 디저트',
    url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80',
  }
];

export const MealUploaderModal: React.FC<MealUploaderModalProps> = ({
  isOpen,
  onClose,
  fastingState,
  elapsedHours,
  onMealAdded,
  onStopFastingRequest,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mealDescription, setMealDescription] = useState('');
  const [mealType, setMealType] = useState<'lunch' | 'dinner' | 'breakfast' | 'snack' | 'drink'>('lunch');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImageFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setSelectedImage(base64);
      runAnalysis(base64);
    };
    reader.readAsDataURL(file);
  };

  const handlePresetSelect = (preset: typeof PRESET_SAMPLES[0]) => {
    setSelectedImage(preset.url);
    setMealDescription(preset.name);
    runAnalysis(preset.url, preset.name);
  };

  const runAnalysis = async (imgUrlOrBase64: string, customDesc?: string) => {
    setIsAnalyzing(true);
    setErrorMsg(null);
    setAnalysisResult(null);

    const userProfile = StorageService.getUserProfile();
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    try {
      const result = await analyzeFoodImage({
        imageBase64: imgUrlOrBase64,
        fastingState,
        elapsedHours,
        currentTime,
        apiKey: userProfile.apiKey,
        provider: userProfile.aiProvider,
        customMealDescription: customDesc || mealDescription,
      });

      setAnalysisResult(result);
    } catch (err: any) {
      console.error('Analysis failed:', err);
      setErrorMsg('AI 분석 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveMeal = () => {
    if (!analysisResult || !selectedImage) return;

    const newMeal: MealLog = {
      logId: `meal_${Date.now()}`,
      userId: 'user-default-1',
      imageUrl: selectedImage,
      consumedAt: new Date().toISOString(),
      isDuringFasting: fastingState === 'FASTING',
      mealType,
      aiAnalysis: analysisResult,
    };

    StorageService.addMeal(newMeal);
    onMealAdded(newMeal);

    // 단식 중 칼로리 섭취로 공복이 깨진 경우 타이머 종료 제안
    if (fastingState === 'FASTING' && analysisResult.fasting_impact.breaks_fast) {
      if (onStopFastingRequest && confirm('공복이 해제되었습니다. 단식 타이머를 종료하고 식사 윈도우로 전환하시겠습니까?')) {
        onStopFastingRequest();
      }
    }

    // 초기화 및 닫기
    setSelectedImage(null);
    setAnalysisResult(null);
    setMealDescription('');
    onClose();
  };

  const isFasting = fastingState === 'FASTING';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto glass-card rounded-3xl p-5 border border-white/10 shadow-2xl bg-[#0d1424]/95 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center">
                AI Vision 식단 기록 & 분석
                <Sparkles className="w-3.5 h-3.5 text-blue-400 ml-1.5" />
              </h2>
              <p className="text-[11px] text-slate-400">사진 1장으로 칼로리, 탄단지, 혈당 스파이크 자동 판별</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Fasting context banner */}
        <div
          className={`p-3 rounded-xl mb-4 border flex items-center justify-between text-xs ${
            isFasting
              ? 'bg-blue-500/10 border-blue-500/30 text-blue-300'
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
          }`}
        >
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full animate-ping bg-current" />
            <span>현재 상태: <strong>{isFasting ? `단식 중 (${elapsedHours.toFixed(1)}h 경과)` : '식사 윈도우'}</strong></span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-white/10">AI 상태 동기화됨</span>
        </div>

        {/* Upload area or Image Preview */}
        {!selectedImage ? (
          <div className="space-y-4">
            {/* File dropzone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-2xl p-6 text-center cursor-pointer transition-all hover:bg-white/5 flex flex-col items-center justify-center space-y-2 group"
            >
              <div className="w-12 h-12 rounded-full bg-blue-500/10 group-hover:bg-blue-500/20 text-blue-400 flex items-center justify-center transition-colors">
                <Upload className="w-6 h-6" />
              </div>
              <span className="text-sm font-semibold text-white">음식 사진 촬영 또는 갤러리 업로드</span>
              <p className="text-xs text-slate-400">JPG, PNG 파일 지원</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageFile(file);
                }}
              />
            </div>

            {/* Quick Demo Presets */}
            <div>
              <span className="text-xs font-semibold text-slate-400 mb-2 block">⚡ 빠른 테스트 샘플 프리셋:</span>
              <div className="grid grid-cols-2 gap-2">
                {PRESET_SAMPLES.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePresetSelect(preset)}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-left transition-colors flex items-start space-x-2"
                  >
                    <img src={preset.url} alt={preset.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white truncate">{preset.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{preset.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Image Preview & Change button */}
            <div className="relative rounded-2xl overflow-hidden aspect-video border border-white/10 shadow-lg">
              <img src={selectedImage} alt="Food preview" className="w-full h-full object-cover" />
              {isAnalyzing && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white space-y-2">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
                  <span className="text-sm font-semibold">Vision AI가 영양소를 스캔 중입니다...</span>
                  <p className="text-xs text-slate-300">메뉴 식별, 칼로리 계산, 혈당 위험도 판별</p>
                </div>
              )}
              <button
                onClick={() => {
                  setSelectedImage(null);
                  setAnalysisResult(null);
                }}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors"
                title="사진 다시 선택"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Analysis Results View */}
            {analysisResult && (
              <div className="space-y-3 animate-fade-in">
                {/* Fasting Impact Warning Banner */}
                <div
                  className={`p-3 rounded-2xl border flex items-start space-x-2.5 ${
                    analysisResult.fasting_impact.breaks_fast
                      ? isFasting
                        ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                        : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                      : 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300'
                  }`}
                >
                  {analysisResult.fasting_impact.breaks_fast && isFasting ? (
                    <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-400 mt-0.5" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400 mt-0.5" />
                  )}
                  <div>
                    <h4 className="text-xs font-bold">
                      {analysisResult.fasting_impact.breaks_fast && isFasting
                        ? '공복 깨짐 주의 (인슐린 자극)'
                        : '단식 상태 영향 없음'}
                    </h4>
                    <p className="text-[11px] opacity-90 mt-0.5 leading-relaxed">
                      {analysisResult.fasting_impact.status_message}
                    </p>
                  </div>
                </div>

                {/* Macro Nutrition Summary Cards */}
                <div className="glass-card rounded-2xl p-3.5 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white flex items-center">
                      <Flame className="w-4 h-4 text-orange-400 mr-1" />
                      총 칼로리: <strong className="text-orange-400 font-mono text-sm ml-1">{analysisResult.total_nutrition.calories} kcal</strong>
                    </span>
                    {/* Sugar spike risk badge */}
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        analysisResult.sugar_spike_risk === 'LOW'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : analysisResult.sugar_spike_risk === 'MEDIUM'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      혈당 위험도: {analysisResult.sugar_spike_risk}
                    </span>
                  </div>

                  {/* Carbs, Protein, Fat Bars */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 rounded-xl bg-white/5">
                      <span className="text-slate-400 text-[10px]">탄수화물</span>
                      <p className="font-bold text-blue-400 font-mono">{analysisResult.total_nutrition.carbs_g}g</p>
                    </div>
                    <div className="p-2 rounded-xl bg-white/5">
                      <span className="text-slate-400 text-[10px]">단백질</span>
                      <p className="font-bold text-emerald-400 font-mono">{analysisResult.total_nutrition.protein_g}g</p>
                    </div>
                    <div className="p-2 rounded-xl bg-white/5">
                      <span className="text-slate-400 text-[10px]">지방</span>
                      <p className="font-bold text-pink-400 font-mono">{analysisResult.total_nutrition.fat_g}g</p>
                    </div>
                  </div>

                  {/* Identified Foods List */}
                  <div className="mt-3 pt-2 border-t border-white/5">
                    <span className="text-[11px] text-slate-400 font-semibold block mb-1.5">인식된 음식 구성:</span>
                    <div className="space-y-1">
                      {analysisResult.foods.map((food, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs text-slate-300 py-0.5">
                          <span>• {food.name} <span className="text-slate-500 text-[10px]">({food.portion})</span></span>
                          <span className="font-mono text-slate-400">{food.calories} kcal</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* AI Coach Comment */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border border-blue-500/20">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-blue-300 mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>FastiMeal AI 다이어티션 피드백</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {analysisResult.ai_coach_comment}
                  </p>
                </div>

                {/* Meal Type selection */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-400 font-semibold">식사 유형:</span>
                  <div className="flex space-x-1">
                    {(['breakfast', 'lunch', 'dinner', 'snack', 'drink'] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setMealType(t)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                          mealType === t ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-400 hover:text-white'
                        }`}
                      >
                        {t === 'breakfast' ? '아침' : t === 'lunch' ? '점심' : t === 'dinner' ? '저녁' : t === 'snack' ? '간식' : '음료'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Save Button */}
                <button
                  onClick={handleSaveMeal}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-sm shadow-lg shadow-blue-500/30 flex items-center justify-center space-x-2 transition-all active:scale-[0.98]"
                >
                  <span>타임라인 피드에 저장하기</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-xs">
                {errorMsg}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
