import React, { useState } from 'react';
import { Sparkles, ArrowRight, ArrowLeft, Scale, Ruler, Utensils, CheckCircle2, HeartHandshake, Clock } from 'lucide-react';
import { UserProfile, FastingPlan, BodyLog, AppTheme } from '../../types';
import { StorageService } from '../../services/storageService';
import { calculateFastingSchedule } from '../../utils/fastingSchedule';
import confetti from 'canvas-confetti';

interface OnboardingModalProps {
  isOpen: boolean;
  currentTheme?: AppTheme;
  onComplete: (profile: UserProfile) => void;
}

const PRESET_TIMES = ['11:30', '12:00', '12:30', '13:00'];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  currentTheme = 'pastel',
  onComplete,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [nickname, setNickname] = useState('');
  const [heightCm, setHeightCm] = useState<string>('165');
  const [weightKg, setWeightKg] = useState<string>('60.0');
  const [targetWeightKg, setTargetWeightKg] = useState<string>('53.0');
  const [firstMealTime, setFirstMealTime] = useState<string>('11:30');
  const [selectedPlan, setSelectedPlan] = useState<FastingPlan>('16:8');
  const [targetHours, setTargetHours] = useState<number>(16);

  if (!isOpen) return null;

  const isLight = currentTheme !== 'dark';

  // BMI Calculation
  const hNum = parseFloat(heightCm) / 100;
  const wNum = parseFloat(weightKg);
  const bmi = hNum > 0 && wNum > 0 ? (wNum / (hNum * hNum)).toFixed(1) : '22.0';
  const bmiVal = parseFloat(bmi);

  const idealWeight = hNum > 0 ? (21.5 * hNum * hNum).toFixed(1) : '55.0';

  let bmiCategory = '정상 체중';
  let bmiColor = 'text-emerald-600 bg-emerald-100 border-emerald-300';
  let bmiDesc = '체지방 연소와 자가포식 대사를 유지하기에 아주 건강한 수치입니다! ✨';

  if (bmiVal < 18.5) {
    bmiCategory = '저체중';
    bmiColor = 'text-sky-600 bg-sky-100 border-sky-300';
    bmiDesc = '식사 윈도우 때 양질의 단백질과 영양을 충분히 섭취하는 것이 좋습니다. 🌱';
  } else if (bmiVal >= 18.5 && bmiVal <= 22.9) {
    bmiCategory = '정상 체중 (이상적)';
    bmiColor = 'text-emerald-600 bg-emerald-100 border-emerald-300';
    bmiDesc = '체지방 연소와 자가포식 대사를 유지하기에 아주 건강한 상태입니다! ✨';
  } else if (bmiVal >= 23.0 && bmiVal <= 24.9) {
    bmiCategory = '과체중 (관리 필요)';
    bmiColor = 'text-amber-600 bg-amber-100 border-amber-300';
    bmiDesc = '16:8 간헐적 단식을 통해 인슐린 수치를 낮추면 빠르게 감량 효과를 볼 수 있습니다. 🔥';
  } else {
    bmiCategory = '비만 (체지방 집중 연소)';
    bmiColor = 'text-rose-600 bg-rose-100 border-rose-300';
    bmiDesc = '케토시스 대사 진입을 통해 체내 축적된 체지방을 적극적으로 연소시킬 수 있습니다! 🚀';
  }

  const schedule = calculateFastingSchedule(firstMealTime, targetHours);

  const handleNext = () => {
    if (step === 1) {
      if (!nickname.trim()) {
        setNickname('단식러');
      }
      setStep(2);
    } else if (step === 2) {
      const h = parseFloat(heightCm);
      const w = parseFloat(weightKg);
      if (isNaN(h) || h < 100 || h > 250) {
        alert('올바른 키(cm)를 입력해주세요.');
        return;
      }
      if (isNaN(w) || w < 20 || w > 300) {
        alert('올바른 시작 몸무게(kg)를 입력해주세요.');
        return;
      }
      setStep(3);
    }
  };

  const handleFinish = () => {
    const finalProfile: UserProfile = {
      ...StorageService.getUserProfile(),
      nickname: nickname.trim() || '단식러',
      heightCm: parseFloat(heightCm),
      startWeightKg: parseFloat(weightKg),
      targetWeightKg: targetWeightKg ? parseFloat(targetWeightKg) : undefined,
      firstMealTime,
      fastingPlan: selectedPlan,
      targetFastingHours: targetHours,
      isOnboarded: true,
    };

    StorageService.saveUserProfile(finalProfile);

    const todayStr = new Date().toISOString().split('T')[0];
    const initialBodyLog: BodyLog = {
      logId: `body_start_${Date.now()}`,
      date: todayStr,
      weightKg: parseFloat(weightKg),
      memo: '🎉 FastiMeal AI 시작 몸무게 등록',
      loggedAt: new Date().toISOString(),
    };
    StorageService.saveBodyLog(initialBodyLog);

    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 }
    });

    onComplete(finalProfile);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className={`w-full max-w-md max-h-[92vh] overflow-y-auto rounded-3xl p-6 border shadow-2xl transition-all flex flex-col ${
        isLight
          ? 'bg-white text-slate-800 border-purple-100 shadow-purple-500/15'
          : 'bg-[#0e1628] text-white border-white/10'
      }`}>
        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-extrabold text-purple-600 flex items-center">
            <Sparkles className="w-3.5 h-3.5 mr-1" />
            맞춤 설정 {step}/3단계
          </span>
          <div className="flex space-x-1.5">
            <span className={`w-6 h-1.5 rounded-full transition-all ${step >= 1 ? 'bg-purple-600' : 'bg-slate-200'}`} />
            <span className={`w-6 h-1.5 rounded-full transition-all ${step >= 2 ? 'bg-purple-600' : 'bg-slate-200'}`} />
            <span className={`w-6 h-1.5 rounded-full transition-all ${step >= 3 ? 'bg-purple-600' : 'bg-slate-200'}`} />
          </div>
        </div>

        {/* STEP 1: 닉네임 입력 */}
        {step === 1 && (
          <div className="space-y-5 animate-fade-in my-auto py-4">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-purple-100 text-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/10 mb-3">
                <HeartHandshake className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-extrabold text-slate-800">
                반가워요! <br />어떻게 불러드릴까요?
              </h2>
              <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                FastiMeal과 함께 건강하고 지속 가능한 간헐적 단식 & 식단 관리를 시작해보세요.
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">나의 닉네임</label>
              <input
                type="text"
                placeholder="예: 슬림러버, 민지, 에단"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                autoFocus
                className="w-full px-4 py-3.5 rounded-2xl text-sm font-bold bg-purple-50/50 border border-purple-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:bg-white shadow-xs"
              />
              <span className="text-[11px] text-slate-400 mt-1.5 block">
                * 닉네임은 언제든지 설정에서 변경할 수 있습니다.
              </span>
            </div>

            <button
              onClick={handleNext}
              className="w-full py-4 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-purple-500/25 transition-all active:scale-[0.98]"
            >
              <span>다음 단계로</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: 키 & 시작 몸무게 입력 */}
        {step === 2 && (
          <div className="space-y-4 animate-fade-in my-auto py-2">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center shadow-md mb-2">
                <Scale className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-extrabold text-slate-800">
                신체 정보를 입력해주세요
              </h2>
              <p className="text-xs text-slate-500">
                정확한 BMI 지수와 권장 단식 시간 산출에 활용됩니다
              </p>
            </div>

            <div className="space-y-3">
              {/* Height input */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center">
                  <Ruler className="w-3.5 h-3.5 text-purple-600 mr-1" /> 나의 키 (cm)
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    step="0.5"
                    placeholder="165"
                    value={heightCm}
                    onChange={(e) => setHeightCm(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-base font-extrabold font-mono bg-white border border-slate-200 text-slate-800 focus:outline-none focus:border-purple-500"
                  />
                  <span className="text-xs font-bold text-slate-500">cm</span>
                </div>
              </div>

              {/* Start Weight input */}
              <div className="p-3.5 rounded-2xl bg-purple-50/50 border border-purple-200">
                <label className="text-xs font-bold text-purple-900 block mb-1 flex items-center">
                  <Scale className="w-3.5 h-3.5 text-purple-600 mr-1" /> 현재 시작 몸무게 (kg)
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    step="0.1"
                    placeholder="60.0"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-base font-extrabold font-mono bg-white border border-purple-300 text-purple-900 focus:outline-none focus:border-purple-600"
                  />
                  <span className="text-xs font-bold text-purple-800">kg</span>
                </div>
              </div>

              {/* Target Weight input */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center justify-between">
                  <span>목표 희망 몸무게 (kg)</span>
                  <span className="text-[10px] text-slate-400 font-normal">선택</span>
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    step="0.1"
                    placeholder="53.0"
                    value={targetWeightKg}
                    onChange={(e) => setTargetWeightKg(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-base font-extrabold font-mono bg-white border border-slate-200 text-slate-800 focus:outline-none focus:border-purple-500"
                  />
                  <span className="text-xs font-bold text-slate-500">kg</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="flex-1 py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs flex items-center justify-center space-x-1.5 shadow-lg shadow-purple-500/25 transition-all active:scale-[0.98]"
              >
                <span>BMI 분석 및 첫 끼 시간 설정</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: BMI 분석 결과 & 점심(첫 끼) 시간 & 단식 플랜 */}
        {step === 3 && (
          <div className="space-y-3.5 animate-fade-in py-1">
            <div className="text-center space-y-0.5">
              <h2 className="text-base font-extrabold text-slate-800">
                {nickname} 님의 신체 분석 & 점심 루틴
              </h2>
              <p className="text-[11px] text-slate-500">
                키 {heightCm}cm / 시작 체중 {weightKg}kg (BMI {bmi})
              </p>
            </div>

            {/* BMI Result Banner */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-tr from-purple-50 via-pink-50/50 to-white border border-purple-200 text-center space-y-1.5">
              <div className="flex items-center justify-center space-x-2">
                <span className="text-2xl font-extrabold font-mono text-purple-700">{bmi}</span>
                <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${bmiColor}`}>
                  {bmiCategory}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                {bmiDesc}
              </p>
            </div>

            {/* Lunch / First Meal Time Picker */}
            <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-900 flex items-center">
                  <Utensils className="w-3.5 h-3.5 mr-1 text-purple-600" />
                  첫 끼(점심) 시간
                </span>
                <input
                  type="time"
                  value={firstMealTime}
                  onChange={(e) => setFirstMealTime(e.target.value)}
                  className="px-2.5 py-1 rounded-xl text-xs font-bold font-mono bg-white border border-purple-300 text-purple-900"
                />
              </div>

              <div className="flex items-center space-x-1">
                {PRESET_TIMES.map((time) => (
                  <button
                    key={time}
                    onClick={() => setFirstMealTime(time)}
                    className={`flex-1 py-1 rounded-lg text-[10px] font-bold font-mono transition-all ${
                      firstMealTime === time
                        ? 'bg-purple-600 text-white'
                        : 'bg-white text-slate-600 border border-purple-100 hover:bg-purple-50'
                    }`}
                  >
                    {time} {time === '11:30' ? '★' : ''}
                  </button>
                ))}
              </div>

              {/* Calculated schedule */}
              <div className="p-2 rounded-xl bg-white border border-purple-100 text-[11px] space-y-0.5 text-slate-700">
                <div className="flex justify-between">
                  <span>🍱 식사창:</span>
                  <strong className="text-emerald-600 font-mono">{schedule.firstMealTime} ~ {schedule.lastMealTime}</strong>
                </div>
                <div className="flex justify-between">
                  <span>🌙 단식창:</span>
                  <strong className="text-purple-600 font-mono">{schedule.lastMealTime} ~ 익일 {schedule.firstMealTime}</strong>
                </div>
              </div>
            </div>

            {/* Fasting Plan Preset Selector */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-700 block">단식 플랜 선택:</span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { plan: '16:8' as FastingPlan, hours: 16, label: '16:8 표준', badge: '추천' },
                  { plan: '14:10' as FastingPlan, hours: 14, label: '14:10 순한맛', badge: '초보' },
                  { plan: '18:6' as FastingPlan, hours: 18, label: '18:6 가속', badge: '체지방' },
                ].map((item) => (
                  <button
                    key={item.plan}
                    onClick={() => {
                      setSelectedPlan(item.plan);
                      setTargetHours(item.hours);
                    }}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      selectedPlan === item.plan
                        ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-purple-50'
                    }`}
                  >
                    <strong className="text-xs block">{item.label}</strong>
                    <span className="text-[10px] opacity-80">{item.hours}시간</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Finish Actions */}
            <div className="flex space-x-2 pt-1">
              <button
                onClick={() => setStep(2)}
                className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleFinish}
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-extrabold text-xs flex items-center justify-center space-x-1.5 shadow-lg shadow-purple-500/30 transition-all active:scale-[0.98]"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>점심 {firstMealTime} 기준 시작하기</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
