import React, { useState } from 'react';
import { X, Check, Flame, Shield, Trophy, Clock, Utensils } from 'lucide-react';
import { FastingPlan, AppTheme } from '../../types';
import { calculateFastingSchedule } from '../../utils/fastingSchedule';

interface FastingPlanSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: FastingPlan;
  currentTargetHours: number;
  currentFirstMealTime?: string;
  currentTheme?: AppTheme;
  onSelectPlan: (plan: FastingPlan, targetHours: number, firstMealTime: string) => void;
}

const PLANS = [
  {
    plan: '16:8' as FastingPlan,
    hours: 16,
    title: '16:8 표준 플랜 (가장 추천)',
    badge: '인기 1위',
    desc: '16시간 공복 후 8시간 식사. 점심 첫 끼 기준 지방 연소와 자가포식이 일어나는 완벽한 밸런스.',
    icon: Flame,
  },
  {
    plan: '18:6' as FastingPlan,
    hours: 18,
    title: '18:6 가속 플랜 (체지방 집중)',
    badge: '빠른 감량',
    desc: '18시간 공복, 6시간 식사. 점심과 이른 저녁으로 식사창을 좁혀 케토시스 구간을 길게 유지.',
    icon: Trophy,
  },
  {
    plan: '14:10' as FastingPlan,
    hours: 14,
    title: '14:10 순한 플랜 (초보자용)',
    badge: '편안한 시작',
    desc: '14시간 공복, 10시간 식사. 늦은 아침/점심부터 시작하여 위장에 부담 없이 가볍게 시작.',
    icon: Shield,
  },
];

const PRESET_TIMES = ['11:30', '12:00', '12:30', '13:00'];

export const FastingPlanSelector: React.FC<FastingPlanSelectorProps> = ({
  isOpen,
  onClose,
  currentTargetHours,
  currentFirstMealTime = '11:30',
  currentTheme = 'pastel',
  onSelectPlan,
}) => {
  const [selectedHours, setSelectedHours] = useState<number>(currentTargetHours);
  const [firstMealTime, setFirstMealTime] = useState<string>(currentFirstMealTime);
  const isLight = currentTheme !== 'dark';

  if (!isOpen) return null;

  const schedule = calculateFastingSchedule(firstMealTime, selectedHours);

  const handleApply = (plan: FastingPlan, hours: number) => {
    onSelectPlan(plan, hours, firstMealTime);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className={`w-full max-w-md max-h-[88vh] overflow-y-auto rounded-3xl p-5 border shadow-2xl transition-all flex flex-col ${
        isLight ? 'bg-white text-slate-800 border-purple-100' : 'bg-[#0e1628] text-white border-white/10'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between pb-3 border-b mb-4 ${
          isLight ? 'border-slate-100' : 'border-white/10'
        }`}>
          <div>
            <h2 className="text-base font-bold flex items-center">
              <Clock className="w-4 h-4 text-purple-600 mr-1.5" />
              첫 끼(점심) 시간 & 단식 플랜
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">내 일상 식사 루틴에 맞게 자동으로 시간표를 완성합니다</p>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-full transition-colors ${
              isLight ? 'hover:bg-slate-100 text-slate-400' : 'hover:bg-white/10 text-slate-400'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Lunch / First Meal Time Picker Section */}
        <div className={`p-4 rounded-2xl border mb-4 space-y-2.5 ${
          isLight ? 'bg-purple-50/50 border-purple-200' : 'bg-white/5 border-white/5'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center">
              <Utensils className="w-3.5 h-3.5 text-purple-600 mr-1" />
              나의 첫 끼(점심) 시작 시간
            </span>
            <input
              type="time"
              value={firstMealTime}
              onChange={(e) => setFirstMealTime(e.target.value)}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold font-mono border ${
                isLight ? 'bg-white border-purple-300 text-purple-900' : 'bg-slate-800 border-slate-700 text-white'
              }`}
            />
          </div>

          {/* Quick preset chips */}
          <div className="flex items-center space-x-1.5 pt-1">
            <span className="text-[10px] text-slate-400 font-semibold mr-1">빠른 선택:</span>
            {PRESET_TIMES.map((time) => (
              <button
                key={time}
                onClick={() => setFirstMealTime(time)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold font-mono transition-all ${
                  firstMealTime === time
                    ? 'bg-purple-600 text-white shadow-xs'
                    : isLight
                    ? 'bg-white text-slate-600 border border-slate-200 hover:bg-purple-50'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                {time} {time === '11:30' ? '(평일추천)' : ''}
              </button>
            ))}
          </div>

          {/* Real-time Schedule Preview Result */}
          <div className={`mt-2 p-3 rounded-xl text-xs space-y-1.5 ${
            isLight ? 'bg-white border border-purple-100' : 'bg-slate-800/80 border border-slate-700'
          }`}>
            <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
              <span>🍱 식사 윈도우 ({schedule.eatingWindowHours}시간):</span>
              <span className="font-mono font-bold text-emerald-600">{schedule.firstMealTime} ~ {schedule.lastMealTime}</span>
            </div>
            <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
              <span>🌙 단식 윈도우 ({schedule.targetFastingHours}시간):</span>
              <span className="font-mono font-bold text-purple-600">{schedule.lastMealTime} ~ 익일 {schedule.firstMealTime}</span>
            </div>
          </div>
        </div>

        {/* 2. Plan Cards */}
        <div className="space-y-2.5">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
            간헐적 단식 인터벌 선택:
          </span>

          {PLANS.map((item) => {
            const isSelected = selectedHours === item.hours;
            const Icon = item.icon;

            return (
              <div
                key={item.plan}
                onClick={() => {
                  setSelectedHours(item.hours);
                  handleApply(item.plan, item.hours);
                }}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-purple-50/80 dark:bg-purple-900/20 border-purple-500 shadow-md'
                    : isLight
                    ? 'bg-slate-50/70 border-slate-200 hover:bg-purple-50/50'
                    : 'bg-white/5 border-white/5 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <h4 className="text-xs font-bold">{item.title}</h4>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-purple-100 text-purple-700">
                          {item.badge}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-purple-600 font-bold">
                        단식 {item.hours}시간 : 식사 {24 - item.hours}시간
                      </span>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 pl-10 leading-snug">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
