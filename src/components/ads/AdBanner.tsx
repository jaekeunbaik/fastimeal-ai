import React from 'react';
import { AppTheme } from '../types';

interface AdBannerProps {
  currentTheme?: AppTheme;
  position?: 'bottom' | 'inline';
}

export const AdBanner: React.FC<AdBannerProps> = ({
  currentTheme = 'pastel',
  position = 'bottom',
}) => {
  const isLight = currentTheme !== 'dark';

  return (
    <div className={`w-full max-w-md mx-auto px-4 ${position === 'bottom' ? 'py-1' : 'py-2.5'}`}>
      <div className={`w-full h-14 rounded-2xl border flex items-center justify-between px-4 transition-all relative overflow-hidden group cursor-pointer ${
        isLight
          ? 'bg-gradient-to-r from-purple-50/90 via-pink-50/60 to-purple-50/90 border-purple-200/80 shadow-xs'
          : 'bg-gradient-to-r from-blue-950/40 via-purple-950/30 to-blue-950/40 border-white/10 shadow-md'
      }`}>
        {/* Ad Tag Badge */}
        <span className="absolute top-1 right-2 text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-black/10 dark:bg-white/10 text-slate-400">
          AD
        </span>

        {/* Ad Content Demo */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center text-base shadow-xs shrink-0">
            🥗
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate max-w-[210px]">
              단식 중 마시는 제로칼로리 전해질
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">
              구글 애드몹(AdMob) 스마트 배너 영역
            </span>
          </div>
        </div>

        {/* CTA Button */}
        <div className="px-2.5 py-1 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-extrabold shadow-xs shrink-0">
          보기
        </div>
      </div>
    </div>
  );
};
