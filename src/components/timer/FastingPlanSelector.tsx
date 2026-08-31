import React, { useState } from 'react';
import { X, Check, Flame, Shield, Trophy } from 'lucide-react';
import { FastingPlan } from '../../types';

interface FastingPlanSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: FastingPlan;
  currentTargetHours: number;
  onSelectPlan: (plan: FastingPlan, targetHours: number) => void;
}

const PLANS = [
  {
    plan: '16:8' as FastingPlan,
    hours: 16,
    title: '16:8 플랜 (표준/추천)',
    badge: '인기 1위',
    desc: '16시간 공복 유지 후 8시간 동안 식사. 지방 연소와 자가포식이 시작되는 가장 이상적인 밸런스.',
    icon: Flame,
    color: 'from-blue-500 to-indigo-600',
  },
  {
    plan: '18:6' as FastingPlan,
    hours: 18,
    title: '18:6 플랜 (중급/체지방 집중)',
    badge: '고효율',
    desc: '18시간 공복, 6시간 식사. 오토파지(세포 재생)와 케토시스 구간을 길게 유지하여 빠른 감량 유도.',
    icon: Trophy,
    color: 'from-purple-500 to-pink-600',
  },
  {
    plan: '14:10' as FastingPlan,
    hours: 14,
    title: '14:10 플랜 (초보자/순한 시작)',
    badge: '편안한 시작',
    desc: '14시간 공복, 10시간 식사. 간헐적 단식이 처음이거나 위장에 부담 없이 가볍게 시작할 때 적합.',
    icon: Shield,
    color: 'from-emerald-500 to-teal-600',
  },
];

export const FastingPlanSelector: React.FC<FastingPlanSelectorProps> = ({
  isOpen,
  onClose,
  currentTargetHours,
  onSelectPlan,
}) => {
  const [customHours, setCustomHours] = useState<number>(currentTargetHours);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md glass-card rounded-3xl p-5 border border-white/10 shadow-2xl bg-[#0e1628]/95 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div>
            <h2 className="text-lg font-bold text-white">단식 인터벌 플랜 설정</h2>
            <p className="text-xs text-slate-400 mt-0.5">자신의 라이프스타일에 맞는 최적의 시간대를 선택하세요</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Plan Cards */}
        <div className="space-y-3">
          {PLANS.map((item) => {
            const isSelected = currentTargetHours === item.hours;
            const Icon = item.icon;

            return (
              <div
                key={item.plan}
                onClick={() => {
                  onSelectPlan(item.plan, item.hours);
                  onClose();
                }}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-blue-500/15 border-blue-500 shadow-lg shadow-blue-500/20'
                    : 'bg-white/5 border-white/5 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-2.5">
                    <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${item.color} flex items-center justify-center text-white`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-bold text-white">{item.title}</h4>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/10 text-slate-300">
                          {item.badge}
                        </span>
                      </div>
                      <span className="text-xs text-blue-400 font-mono font-semibold">단식 {item.hours}시간 : 식사 {24 - item.hours}시간</span>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </div>
                <p className="text-xs text-slate-400 pl-10 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Custom Hour Slider */}
        <div className="mt-4 p-4 rounded-2xl bg-white/5 border border-white/5">
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span className="text-slate-300">커스텀 단식 시간 설정</span>
            <span className="text-blue-400 font-mono text-sm">{customHours}시간 ({customHours}:{24 - customHours})</span>
          </div>
          <input
            type="range"
            min={10}
            max={23}
            step={1}
            value={customHours}
            onChange={(e) => setCustomHours(Number(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
            <span>10h (초단기)</span>
            <span>16h (표준)</span>
            <span>23h (1일1식)</span>
          </div>
          <button
            onClick={() => {
              onSelectPlan('custom', customHours);
              onClose();
            }}
            className="w-full mt-3 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold transition-colors"
          >
            커스텀 {customHours}시간 적용
          </button>
        </div>
      </div>
    </div>
  );
};
