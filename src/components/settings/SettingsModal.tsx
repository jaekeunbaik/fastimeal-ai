import React, { useState } from 'react';
import { X, Key, User, Droplets, Flame, Save, ShieldCheck, Sparkles, Smartphone, RotateCcw } from 'lucide-react';
import { UserProfile, AppTheme } from '../../types';
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
    if (confirm('모든 단식 세션, 식단 기록, 수분 기록을 초기화하시겠습니까?')) {
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
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              isLight ? 'bg-purple-100 text-purple-600' : 'bg-blue-500/20 text-blue-400'
            }`}>
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold">설정 & 프로필</h2>
              <p className="text-[11px] text-slate-400">목표 및 Vision AI 연동 설정</p>
            </div>
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
          {/* User Profile & Goals */}
          <div className={`p-4 rounded-2xl border space-y-3 ${
            isLight ? 'bg-purple-50/40 border-purple-100' : 'bg-white/5 border-white/5'
          }`}>
            <div className="flex items-center space-x-2 text-xs font-bold">
              <User className="w-4 h-4 text-purple-600 dark:text-emerald-400" />
              <span>내 프로필 & 다이어트 목표</span>
            </div>

            <div>
              <label className="text-[11px] text-slate-500 font-semibold block mb-1">닉네임</label>
              <input
                type="text"
                placeholder="예: 닉네임을 입력하세요 (미입력 시 단식러)"
                value={profile.nickname}
                onChange={(e) => setProfile({ ...profile, nickname: e.target.value })}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs transition-all focus:outline-none ${
                  isLight
                    ? 'bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:border-purple-500 shadow-xs'
                    : 'bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:border-blue-500'
                }`}
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-[11px] text-slate-500 font-semibold block mb-1 flex items-center">
                  <Droplets className="w-3.5 h-3.5 text-cyan-500 mr-1" /> 일일 목표 수분 (ml)
                </label>
                <input
                  type="number"
                  step="100"
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
                  <Flame className="w-3.5 h-3.5 text-orange-500 mr-1" /> 일일 목표 칼로리 (kcal)
                </label>
                <input
                  type="number"
                  step="50"
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

          {/* AI Provider & API Key */}
          <div className={`p-4 rounded-2xl border space-y-3 ${
            isLight ? 'bg-slate-50 border-slate-200/80' : 'bg-white/5 border-white/5'
          }`}>
            <div className="flex items-center space-x-2 text-xs font-bold">
              <Key className="w-4 h-4 text-purple-600 dark:text-blue-400" />
              <span>Vision AI 식단 분석 엔진</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setProfile({ ...profile, aiProvider: 'gemini' })}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                  profile.aiProvider === 'gemini'
                    ? isLight
                      ? 'bg-purple-100 border-purple-400 text-purple-700 shadow-xs'
                      : 'bg-blue-600/30 border-blue-500 text-white'
                    : isLight
                    ? 'bg-white border-slate-200 text-slate-500 hover:bg-slate-100'
                    : 'bg-white/5 border-white/5 text-slate-400'
                }`}
              >
                Google Gemini (추천)
              </button>
              <button
                onClick={() => setProfile({ ...profile, aiProvider: 'openai' })}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                  profile.aiProvider === 'openai'
                    ? isLight
                      ? 'bg-purple-100 border-purple-400 text-purple-700 shadow-xs'
                      : 'bg-blue-600/30 border-blue-500 text-white'
                    : isLight
                    ? 'bg-white border-slate-200 text-slate-500 hover:bg-slate-100'
                    : 'bg-white/5 border-white/5 text-slate-400'
                }`}
              >
                OpenAI GPT-4o
              </button>
            </div>

            <div>
              <label className="text-[11px] text-slate-500 font-semibold block mb-1">
                API Key (미입력 시 지능형 시뮬레이션 모드로 자동 작동)
              </label>
              <input
                type="password"
                placeholder={profile.aiProvider === 'gemini' ? 'AIzaSy...' : 'sk-...'}
                value={profile.apiKey || ''}
                onChange={(e) => setProfile({ ...profile, apiKey: e.target.value })}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs transition-all focus:outline-none ${
                  isLight
                    ? 'bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:border-purple-500 shadow-xs'
                    : 'bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:border-blue-500'
                }`}
              />
              <p className="text-[10px] text-slate-400 mt-1 flex items-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 mr-1" />
                API 키는 본인 스마트폰 로컬에만 안전하게 보관됩니다.
              </p>
            </div>
          </div>

          {/* App Info & Reset */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center space-x-2 text-[11px] text-slate-400">
              <Smartphone className="w-3.5 h-3.5" />
              <span>FastiMeal AI v1.0.0</span>
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
