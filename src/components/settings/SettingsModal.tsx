import React, { useState } from 'react';
import { X, User, Droplets, Flame, Save, Smartphone, RotateCcw, Ruler, Clock } from 'lucide-react';
import { UserProfile } from '../../types';
import { StorageService } from '../../services/storageService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdated: (profile: UserProfile) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onProfileUpdated,
}) => {
  const [profile, setProfile] = useState<UserProfile>(() => StorageService.getUserProfile());
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const currentTheme = profile.theme || 'pastel';
  const isLight = currentTheme !== 'dark';

  const handleSave = () => {
    StorageService.saveUserProfile(profile);
    onProfileUpdated(profile);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 500);
  };

  const handleResetData = () => {
    if (confirm('모든 단식 기록, 식단 사진, 물 마시기 기록을 깨끗하게 초기화할까요?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className={`w-full max-w-md max-h-[88vh] overflow-y-auto rounded-3xl p-5 border shadow-2xl transition-all flex flex-col ${
        isLight
          ? 'bg-white text-slate-800 border-purple-100 shadow-purple-500/10'
          : 'bg-[#0e1628] text-white border-white/10'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between pb-3 border-b mb-4 ${
          isLight ? 'border-slate-100' : 'border-white/10'
        }`}>
          <div>
            <h2 className="text-base font-bold">환경 설정</h2>
            <p className="text-[11px] text-slate-400">목표 설정 및 내 신체 정보</p>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-full transition-colors ${
              isLight ? 'hover:bg-slate-100 text-slate-400 hover:text-slate-700' : 'hover:bg-white/10 text-slate-400 hover:text-white'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 flex-1">
          {/* User Profile & Goals Form */}
          <div className={`p-4 rounded-2xl border space-y-3.5 ${
            isLight ? 'bg-purple-50/40 border-purple-100' : 'bg-white/5 border-white/5'
          }`}>
            <div className="flex items-center space-x-2 text-xs font-bold">
              <User className="w-4 h-4 text-purple-600 dark:text-emerald-400" />
              <span>내 다이어트 목표 & 루틴</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-[11px] text-slate-500 font-semibold block mb-1">닉네임</label>
                <input
                  type="text"
                  placeholder="예: 닉네임"
                  value={profile.nickname}
                  onChange={(e) => setProfile({ ...profile, nickname: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs transition-all focus:outline-none ${
                    isLight
                      ? 'bg-white border border-slate-200 text-slate-800 focus:border-purple-500 shadow-xs'
                      : 'bg-slate-800/80 border border-slate-700 text-white focus:border-blue-500'
                  }`}
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-500 font-semibold block mb-1 flex items-center">
                  <Clock className="w-3.5 h-3.5 text-purple-600 mr-1" /> 첫 끼(점심) 시간
                </label>
                <input
                  type="time"
                  value={profile.firstMealTime || '11:30'}
                  onChange={(e) => setProfile({ ...profile, firstMealTime: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold font-mono transition-all focus:outline-none ${
                    isLight
                      ? 'bg-white border border-slate-200 text-slate-800 focus:border-purple-500 shadow-xs'
                      : 'bg-slate-800/80 border border-slate-700 text-white focus:border-blue-500'
                  }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-[11px] text-slate-500 font-semibold block mb-1 flex items-center">
                  <Ruler className="w-3.5 h-3.5 text-purple-600 mr-1" /> 나의 키 (cm)
                </label>
                <input
                  type="number"
                  step="0.5"
                  placeholder="165"
                  value={profile.heightCm || ''}
                  onChange={(e) => setProfile({ ...profile, heightCm: Number(e.target.value) })}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all focus:outline-none ${
                    isLight
                      ? 'bg-white border border-slate-200 text-slate-800 focus:border-purple-500 shadow-xs'
                      : 'bg-slate-800/80 border border-slate-700 text-white focus:border-blue-500'
                  }`}
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-500 font-semibold block mb-1">목표 체중 (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="55.0"
                  value={profile.targetWeightKg || ''}
                  onChange={(e) => setProfile({ ...profile, targetWeightKg: Number(e.target.value) })}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all focus:outline-none ${
                    isLight
                      ? 'bg-white border border-slate-200 text-slate-800 focus:border-purple-500 shadow-xs'
                      : 'bg-slate-800/80 border border-slate-700 text-white focus:border-blue-500'
                  }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-[11px] text-slate-500 font-semibold block mb-1 flex items-center">
                  <Droplets className="w-3.5 h-3.5 text-cyan-500 mr-1" /> 하루 물 목표 (ml)
                </label>
                <input
                  type="number"
                  step="100"
                  placeholder="2000"
                  value={profile.dailyWaterTargetMl || ''}
                  onChange={(e) => setProfile({ ...profile, dailyWaterTargetMl: Number(e.target.value) })}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all focus:outline-none ${
                    isLight
                      ? 'bg-white border border-slate-200 text-slate-800 focus:border-purple-500 shadow-xs'
                      : 'bg-slate-800/80 border border-slate-700 text-white focus:border-blue-500'
                  }`}
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-500 font-semibold block mb-1 flex items-center">
                  <Flame className="w-3.5 h-3.5 text-orange-500 mr-1" /> 하루 칼로리 (kcal)
                </label>
                <input
                  type="number"
                  step="50"
                  placeholder="1800"
                  value={profile.dailyCalorieTarget || ''}
                  onChange={(e) => setProfile({ ...profile, dailyCalorieTarget: Number(e.target.value) })}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all focus:outline-none ${
                    isLight
                      ? 'bg-white border border-slate-200 text-slate-800 focus:border-purple-500 shadow-xs'
                      : 'bg-slate-800/80 border border-slate-700 text-white focus:border-blue-500'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* App Info & Reset */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-2 text-[11px] text-slate-400">
              <Smartphone className="w-3.5 h-3.5" />
              <span>FastiMeal v1.0.0</span>
            </div>

            <button
              onClick={handleResetData}
              className="text-[11px] text-rose-500 hover:text-rose-600 flex items-center space-x-1 p-1 hover:underline"
            >
              <RotateCcw className="w-3 h-3" />
              <span>기록 전체 초기화</span>
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className={`pt-4 mt-2 border-t ${isLight ? 'border-slate-100' : 'border-white/10'}`}>
          <button
            onClick={handleSave}
            className={`w-full py-3.5 rounded-2xl font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-md active:scale-[0.98] ${
              isSaved
                ? 'bg-emerald-600 text-white'
                : currentTheme === 'pastel'
                ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-500/25'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/25'
            }`}
          >
            <Save className="w-4 h-4" />
            <span>{isSaved ? '저장되었습니다!' : '설정 저장하기'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
