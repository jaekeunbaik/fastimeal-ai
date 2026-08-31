import React, { useState } from 'react';
import { X, Clock, Play, Sparkles, Check, Utensils, Calendar } from 'lucide-react';
import { AppTheme } from '../../types';
import { calculateFastingSchedule } from '../../utils/fastingSchedule';

interface StartFastingModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetHours: number;
  firstMealTime?: string;
  currentTheme?: AppTheme;
  onConfirmStart: (startTimeIso: string, targetHours: number) => void;
}

export const StartFastingModal: React.FC<StartFastingModalProps> = ({
  isOpen,
  onClose,
  targetHours = 16,
  firstMealTime = '11:30',
  currentTheme = 'pastel',
  onConfirmStart,
}) => {
  const schedule = calculateFastingSchedule(firstMealTime, targetHours);
  const isLight = currentTheme !== 'dark';

  // 기본 시작 시간 옵션 선택: 'routine' (루틴 기반 어제 저녁/이전 마지막 식사), 'now' (지금 방금), 'custom' (직접 입력)
  const [startType, setStartType] = useState<'routine' | 'now' | 'custom'>('routine');

  // Custom date/time state
  const now = new Date();
  const todayDateStr = now.toISOString().split('T')[0];
  const nowTimeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  const [customDate, setCustomDate] = useState<string>(todayDateStr);
  const [customTime, setCustomTime] = useState<string>(schedule.lastMealTime);

  if (!isOpen) return null;

  // 루틴(어제 저녁 마지막 식사 시간) 계산
  const getRoutineStartTime = (): Date => {
    const [lastH, lastM] = schedule.lastMealTime.split(':').map(Number);
    const d = new Date();
    d.setHours(lastH, lastM, 0, 0);

    // 만약 현재 시각보다 미래의 시간이면 '어제' 저녁으로 설정
    if (d.getTime() > now.getTime()) {
      d.setDate(d.getDate() - 1);
    }
    return d;
  };

  const routineDate = getRoutineStartTime();
  const routineElapsedHours = Math.max(0, (now.getTime() - routineDate.getTime()) / (1000 * 3600));

  const handleStart = () => {
    let finalStartIso = new Date().toISOString();

    if (startType === 'routine') {
      finalStartIso = routineDate.toISOString();
    } else if (startType === 'now') {
      finalStartIso = new Date().toISOString();
    } else if (startType === 'custom') {
      const [cH, cM] = customTime.split(':').map(Number);
      const customD = new Date(customDate);
      customD.setHours(cH, cM, 0, 0);
      finalStartIso = customD.toISOString();
    }

    onConfirmStart(finalStartIso, targetHours);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className={`w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl p-5 border shadow-2xl transition-all flex flex-col ${
        isLight ? 'bg-white text-slate-800 border-purple-100' : 'bg-[#0e1628] text-white border-white/10'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between pb-3 border-b mb-3.5 ${
          isLight ? 'border-slate-100' : 'border-white/10'
        }`}>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold">단식 시작 시점 설정</h2>
              <p className="text-[11px] text-slate-400">마지막 식사 완료(단식 시작) 시간을 선택하세요</p>
            </div>
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

        {/* Options Selection */}
        <div className="space-y-2.5 flex-1">
          {/* Option 1: 루틴 기준 마지막 식사 완료 시간 (추천) */}
          <div
            onClick={() => setStartType('routine')}
            className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
              startType === 'routine'
                ? 'bg-purple-50 border-purple-500 shadow-md ring-1 ring-purple-400'
                : isLight ? 'bg-slate-50/70 border-slate-200 hover:bg-purple-50/40' : 'bg-white/5 border-white/5'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center">
                  <Utensils className="w-3.5 h-3.5 text-purple-600 mr-1" />
                  점심 {schedule.firstMealTime} 루틴 기준 ({schedule.lastMealTime} 식사 마침)
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-purple-100 text-purple-700">
                  추천
                </span>
              </div>
              {startType === 'routine' && (
                <div className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center">
                  <Check className="w-3 h-3" />
                </div>
              )}
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              어제 저녁 {schedule.lastMealTime}에 식사를 마친 것으로 소급 적용 (현재 <strong>{routineElapsedHours.toFixed(1)}시간</strong> 공복 진행 중)
            </p>
          </div>

          {/* Option 2: 지금 방금 식사를 마침 */}
          <div
            onClick={() => setStartType('now')}
            className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
              startType === 'now'
                ? 'bg-purple-50 border-purple-500 shadow-md ring-1 ring-purple-400'
                : isLight ? 'bg-slate-50/70 border-slate-200 hover:bg-purple-50/40' : 'bg-white/5 border-white/5'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center">
                <Clock className="w-3.5 h-3.5 text-blue-500 mr-1" />
                지금 방금 식사를 마쳤어요 (현재 시각 {nowTimeStr})
              </span>
              {startType === 'now' && (
                <div className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center">
                  <Check className="w-3 h-3" />
                </div>
              )}
            </div>
            <p className="text-[11px] text-slate-500">
              현재 시각({nowTimeStr})부터 0초 카운트다운을 시작합니다.
            </p>
          </div>

          {/* Option 3: 식사 마친 시간 직접 입력 */}
          <div
            onClick={() => setStartType('custom')}
            className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
              startType === 'custom'
                ? 'bg-purple-50 border-purple-500 shadow-md ring-1 ring-purple-400'
                : isLight ? 'bg-slate-50/70 border-slate-200 hover:bg-purple-50/40' : 'bg-white/5 border-white/5'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center">
                <Calendar className="w-3.5 h-3.5 text-orange-500 mr-1" />
                식사 마친 시간 직접 지정
              </span>
              {startType === 'custom' && (
                <div className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center">
                  <Check className="w-3 h-3" />
                </div>
              )}
            </div>

            {startType === 'custom' ? (
              <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-purple-200/60 animate-fade-in">
                <div>
                  <label className="text-[10px] text-slate-500 font-semibold block mb-0.5">날짜</label>
                  <input
                    type="date"
                    value={customDate}
                    onChange={(e) => setCustomDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold bg-white border border-purple-300 text-slate-800 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-semibold block mb-0.5">식사 종료 시각</label>
                  <input
                    type="time"
                    value={customTime}
                    onChange={(e) => setCustomTime(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold bg-white border border-purple-300 text-slate-800 focus:outline-none"
                  />
                </div>
              </div>
            ) : (
              <p className="text-[11px] text-slate-500">
                원하는 날짜와 시간을 직접 지정하여 단식을 시작합니다.
              </p>
            )}
          </div>
        </div>

        {/* Start Button */}
        <div className={`pt-3.5 mt-3 border-t ${isLight ? 'border-slate-100' : 'border-white/10'}`}>
          <button
            onClick={handleStart}
            className={`w-full py-3.5 rounded-2xl font-extrabold text-xs flex items-center justify-center space-x-1.5 text-white shadow-lg active:scale-[0.98] transition-all ${
              currentTheme === 'pastel'
                ? 'bg-gradient-to-r from-purple-600 to-pink-500 shadow-purple-500/25'
                : 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/25'
            }`}
          >
            <Play className="w-4 h-4 fill-current" />
            <span>선택한 시간으로 단식 타이머 시작</span>
          </button>
        </div>
      </div>
    </div>
  );
};
