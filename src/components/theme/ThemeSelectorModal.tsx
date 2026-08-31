import React from 'react';
import { X, Check, Palette, Sparkles } from 'lucide-react';
import { AppTheme } from '../../types';
import { THEMES } from '../../constants/themes';

interface ThemeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: AppTheme;
  onSelectTheme: (theme: AppTheme) => void;
}

export const ThemeSelectorModal: React.FC<ThemeSelectorModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onSelectTheme,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md glass-card rounded-3xl p-5 border border-white/20 shadow-2xl bg-white/95 dark:bg-[#0e1628]/95 text-slate-800 dark:text-white flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10 mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold flex items-center">
                앱 컬러 테마 선택
                <Sparkles className="w-3.5 h-3.5 text-purple-500 ml-1.5" />
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">취향에 맞는 감성적인 무드를 선택해보세요</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Theme Cards */}
        <div className="space-y-2.5">
          {Object.values(THEMES).map((theme) => {
            const isSelected = currentTheme === theme.id;
            return (
              <div
                key={theme.id}
                onClick={() => {
                  onSelectTheme(theme.id);
                  onClose();
                }}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  isSelected
                    ? 'ring-2 ring-purple-500 bg-purple-50/80 dark:bg-purple-900/20 border-purple-300 dark:border-purple-500 shadow-md'
                    : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/5 hover:border-purple-200'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="text-2xl p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 shadow-sm">
                    {theme.emoji}
                  </div>
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <h4 className="text-sm font-bold text-slate-800 dark:text-white">{theme.name}</h4>
                      {theme.id === 'pastel' && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-pink-100 text-pink-600 dark:bg-pink-900/40 dark:text-pink-300">
                          인기
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{theme.desc}</p>
                    {/* Stage color preview dots */}
                    <div className="flex space-x-1.5 mt-2">
                      {Object.values(theme.stageColors).map((c, idx) => (
                        <span
                          key={idx}
                          className="w-3.5 h-3.5 rounded-full shadow-sm"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
