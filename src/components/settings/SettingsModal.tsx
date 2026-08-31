import React, { useState } from 'react';
import { X, Key, User, Droplets, Flame, Save, ShieldCheck, Sparkles, Smartphone } from 'lucide-react';
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

  const handleSave = () => {
    StorageService.saveUserProfile(profile);
    onProfileUpdated(profile);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md max-h-[85vh] overflow-y-auto glass-card rounded-3xl p-5 border border-white/10 shadow-2xl bg-[#0e1628]/95 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-blue-400" />
            <h2 className="text-base font-bold text-white">설정 & AI Vision 엔진</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 flex-1">
          {/* AI Provider & API Key */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold text-white">
              <Key className="w-4 h-4 text-blue-400" />
              <span>Vision AI 연동 설정</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setProfile({ ...profile, aiProvider: 'gemini' })}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                  profile.aiProvider === 'gemini'
                    ? 'bg-blue-600/30 border-blue-500 text-white'
                    : 'bg-white/5 border-white/5 text-slate-400'
                }`}
              >
                Google Gemini (추천)
              </button>
              <button
                onClick={() => setProfile({ ...profile, aiProvider: 'openai' })}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                  profile.aiProvider === 'openai'
                    ? 'bg-blue-600/30 border-blue-500 text-white'
                    : 'bg-white/5 border-white/5 text-slate-400'
                }`}
              >
                OpenAI GPT-4o
              </button>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">
                API Key (미입력 시 지능형 시뮬레이션 모드로 동작)
              </label>
              <input
                type="password"
                placeholder={profile.aiProvider === 'gemini' ? 'AIzaSy...' : 'sk-...'}
                value={profile.apiKey || ''}
                onChange={(e) => setProfile({ ...profile, apiKey: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <p className="text-[10px] text-slate-400 mt-1 flex items-center">
                <ShieldCheck className="w-3 h-3 text-emerald-400 mr-1" />
                API 키는 브라우저 및 기기 로컬에만 안전하게 저장됩니다.
              </p>
            </div>
          </div>

          {/* User Profile & Goals */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold text-white">
              <User className="w-4 h-4 text-emerald-400" />
              <span>사용자 목표 설정</span>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">닉네임</label>
              <input
                type="text"
                value={profile.nickname}
                onChange={(e) => setProfile({ ...profile, nickname: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1 flex items-center">
                  <Droplets className="w-3 h-3 text-cyan-400 mr-1" /> 일일 목표 수분 (ml)
                </label>
                <input
                  type="number"
                  step="100"
                  value={profile.dailyWaterTargetMl}
                  onChange={(e) => setProfile({ ...profile, dailyWaterTargetMl: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1 flex items-center">
                  <Flame className="w-3 h-3 text-orange-400 mr-1" /> 일일 목표 칼로리 (kcal)
                </label>
                <input
                  type="number"
                  step="50"
                  value={profile.dailyCalorieTarget}
                  onChange={(e) => setProfile({ ...profile, dailyCalorieTarget: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* App Info & Google Play Specs */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 text-[11px] text-slate-400 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Smartphone className="w-4 h-4 text-blue-400" />
              <div>
                <span className="text-white font-semibold block">FastiMeal AI (v1.0.0)</span>
                <span>Google Play Android Production Ready</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px]">
              Ready
            </span>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4 mt-2 border-t border-white/10">
          <button
            onClick={handleSave}
            className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all ${
              isSaved
                ? 'bg-emerald-600 text-white'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/30 active:scale-[0.98]'
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
