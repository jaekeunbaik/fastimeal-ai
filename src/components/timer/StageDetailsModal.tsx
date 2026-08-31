import React from 'react';
import { X, Flame, Activity, Moon, Zap, Sparkles, CheckCircle } from 'lucide-react';
import { METABOLIC_STAGES } from '../../constants/metabolism';
import { MetabolicStage } from '../../types';

interface StageDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStage: MetabolicStage;
  elapsedHours: number;
}

const icons = [Flame, Activity, Moon, Zap, Sparkles];

export const StageDetailsModal: React.FC<StageDetailsModalProps> = ({
  isOpen,
  onClose,
  currentStage,
  elapsedHours,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg max-h-[85vh] overflow-y-auto glass-card rounded-3xl p-5 border border-white/10 shadow-2xl bg-[#0e1628]/95 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center">
              <Sparkles className="w-5 h-5 text-blue-400 mr-2" />
              간헐적 단식 신체 대사 5단계
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">시간 경과에 따른 신체의 생리학적 변화</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current status summary banner */}
        <div
          className="p-3.5 rounded-2xl mb-4 border flex items-center justify-between"
          style={{
            backgroundColor: `${currentStage.color}15`,
            borderColor: `${currentStage.color}40`,
          }}
        >
          <div>
            <span className="text-[11px] font-semibold text-slate-300">현재 내 대사 상태 ({elapsedHours.toFixed(1)}h 경과)</span>
            <h4 className="text-base font-bold" style={{ color: currentStage.color }}>
              {currentStage.name}
            </h4>
          </div>
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-white/10 text-white">
            {currentStage.startHour}~{currentStage.endHour > 24 ? '16+' : currentStage.endHour}시간
          </span>
        </div>

        {/* 5 Stages List */}
        <div className="space-y-3 flex-1">
          {METABOLIC_STAGES.map((stage, idx) => {
            const IconComp = icons[idx] || Sparkles;
            const isCurrent = currentStage.id === stage.id;
            const isPassed = elapsedHours >= stage.endHour;

            return (
              <div
                key={stage.id}
                className={`p-3.5 rounded-2xl border transition-all ${
                  isCurrent
                    ? 'bg-white/10 border-blue-400/50 shadow-lg shadow-blue-500/10'
                    : 'bg-white/5 border-white/5 opacity-80'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-2.5">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center"
                      style={{
                        backgroundColor: `${stage.color}25`,
                        color: stage.color,
                      }}
                    >
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-400">{stage.id}단계</span>
                        <h3 className="text-sm font-bold text-white">{stage.name}</h3>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {stage.startHour} ~ {stage.endHour > 24 ? '16시간 이상' : `${stage.endHour}시간`}
                      </span>
                    </div>
                  </div>

                  {isCurrent && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500 text-white animate-pulse">
                      진행 중
                    </span>
                  )}
                  {isPassed && (
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  )}
                </div>

                <p className="text-xs text-slate-300 pl-10 leading-relaxed">
                  {stage.longDesc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="pt-4 mt-4 border-t border-white/10 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
