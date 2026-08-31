import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Scale, Plus, Sparkles, TrendingDown, TrendingUp, Calendar as CalendarIcon, Flame, Utensils } from 'lucide-react';
import { BodyLog, AppTheme, FastingSession, MealLog } from '../../types';
import { WeightRecordModal } from './WeightRecordModal';
import { THEMES } from '../../constants/themes';

interface BodyCalendarViewProps {
  bodyLogs: BodyLog[];
  sessions: FastingSession[];
  meals: MealLog[];
  currentTheme?: AppTheme;
  onRefreshLogs: () => void;
}

export const BodyCalendarView: React.FC<BodyCalendarViewProps> = ({
  bodyLogs,
  sessions,
  meals,
  currentTheme = 'pastel',
  onRefreshLogs,
}) => {
  const [currentYearMonth, setCurrentYearMonth] = useState<Date>(() => new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isLight = currentTheme !== 'dark';
  const theme = THEMES[currentTheme] || THEMES.pastel;

  // Calendar calculations
  const year = currentYearMonth.getFullYear();
  const month = currentYearMonth.getMonth(); // 0-indexed

  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 (Sun) - 6 (Sat)
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentYearMonth(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentYearMonth(new Date(year, month + 1, 1));
  };

  // Maps for quick lookup
  const bodyLogMap = new Map<string, BodyLog>();
  bodyLogs.forEach(l => bodyLogMap.set(l.date, l));

  const mealDateSet = new Set<string>();
  meals.forEach(m => {
    const d = m.consumedAt.split('T')[0];
    mealDateSet.add(d);
  });

  const fastingDateSet = new Set<string>();
  sessions.forEach(s => {
    if (s.status === 'COMPLETED') {
      const d = s.startTime.split('T')[0];
      fastingDateSet.add(d);
    }
  });

  // Current weight stats
  const sortedLogs = [...bodyLogs].sort((a, b) => a.date.localeCompare(b.date));
  const latestLog = sortedLogs[sortedLogs.length - 1];
  const firstLog = sortedLogs[0];
  const weightChange = latestLog && firstLog && sortedLogs.length > 1
    ? (latestLog.weightKg - firstLog.weightKg).toFixed(1)
    : null;

  const handleDayClick = (day: number) => {
    const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    setSelectedDateStr(dateStr);
    setIsModalOpen(true);
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="w-full max-w-md mx-auto px-4 py-2 pb-24 space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-lg font-bold flex items-center ${isLight ? 'text-slate-800' : 'text-white'}`}>
            <CalendarIcon className={`w-5 h-5 mr-2 ${currentTheme === 'pastel' ? 'text-purple-600' : 'text-blue-500'}`} />
            달력 & 신체 기록
          </h2>
          <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            몸무게, 체지방, 단식 성공 캘린더 트래커
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedDateStr(todayStr);
            setIsModalOpen(true);
          }}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-2xl text-white text-xs font-bold shadow-md transition-all active:scale-95 ${
            currentTheme === 'pastel'
              ? 'bg-purple-600 hover:bg-purple-500 shadow-purple-500/20'
              : 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/20'
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>체중 기록</span>
        </button>
      </div>

      {/* Weight Summary Stat Cards */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className={`p-3 rounded-2xl border ${
          isLight ? 'bg-white border-purple-100 shadow-xs' : 'bg-white/5 border-white/5'
        }`}>
          <span className="text-[10px] text-slate-400 font-semibold block">최근 몸무게</span>
          <div className="flex items-baseline space-x-1 mt-0.5">
            <span className={`text-lg font-extrabold font-mono ${
              latestLog ? (isLight ? 'text-slate-800' : 'text-white') : 'text-slate-400 text-sm'
            }`}>
              {latestLog ? latestLog.weightKg : '-'}
            </span>
            {latestLog && <span className="text-xs text-slate-400 font-bold">kg</span>}
          </div>
        </div>

        <div className={`p-3 rounded-2xl border ${
          isLight ? 'bg-white border-purple-100 shadow-xs' : 'bg-white/5 border-white/5'
        }`}>
          <span className="text-[10px] text-slate-400 font-semibold block">총 감량 변화</span>
          <div className="flex items-center space-x-1 mt-0.5">
            {weightChange !== null ? (
              <>
                {parseFloat(weightChange) <= 0 ? (
                  <TrendingDown className="w-4 h-4 text-emerald-500" />
                ) : (
                  <TrendingUp className="w-4 h-4 text-rose-500" />
                )}
                <span className={`text-base font-extrabold font-mono ${
                  parseFloat(weightChange) <= 0 ? 'text-emerald-500' : 'text-rose-500'
                }`}>
                  {weightChange}kg
                </span>
              </>
            ) : (
              <span className="text-xs text-slate-400 font-semibold">-</span>
            )}
          </div>
        </div>

        <div className={`p-3 rounded-2xl border ${
          isLight ? 'bg-white border-purple-100 shadow-xs' : 'bg-white/5 border-white/5'
        }`}>
          <span className="text-[10px] text-slate-400 font-semibold block">최근 체지방률</span>
          <div className="flex items-baseline space-x-1 mt-0.5">
            <span className={`text-lg font-extrabold font-mono ${
              latestLog?.bodyFatPct ? (isLight ? 'text-purple-600' : 'text-purple-400') : 'text-slate-400 text-sm'
            }`}>
              {latestLog?.bodyFatPct ? `${latestLog.bodyFatPct}%` : '-'}
            </span>
          </div>
        </div>
      </div>

      {/* Calendar Card */}
      <div className={`glass-card rounded-3xl p-4.5 border ${
        isLight ? 'border-purple-100 bg-white/90 shadow-md shadow-purple-500/5' : 'border-white/10'
      }`}>
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={prevMonth}
            className={`p-2 rounded-xl transition-colors ${
              isLight ? 'hover:bg-purple-50 text-slate-600' : 'hover:bg-white/10 text-slate-300'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <h3 className={`text-base font-bold font-mono ${isLight ? 'text-slate-800' : 'text-white'}`}>
            {year}년 {month + 1}월
          </h3>

          <button
            onClick={nextMonth}
            className={`p-2 rounded-xl transition-colors ${
              isLight ? 'hover:bg-purple-50 text-slate-600' : 'hover:bg-white/10 text-slate-300'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-slate-400 mb-2">
          <span className="text-rose-400">일</span>
          <span>월</span>
          <span>화</span>
          <span>수</span>
          <span>목</span>
          <span>금</span>
          <span className="text-blue-400">토</span>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells before 1st day */}
          {Array.from({ length: firstDayOfMonth }).map((_, idx) => (
            <div key={`empty-${idx}`} className="h-16 rounded-2xl opacity-0" />
          ))}

          {/* Days */}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${dayNum.toString().padStart(2, '0')}`;
            const log = bodyLogMap.get(dateStr);
            const isToday = dateStr === todayStr;
            const hasMeal = mealDateSet.has(dateStr);
            const hasFasting = fastingDateSet.has(dateStr);

            return (
              <div
                key={dayNum}
                onClick={() => handleDayClick(dayNum)}
                className={`h-16 p-1 rounded-2xl border flex flex-col justify-between items-center cursor-pointer transition-all hover:scale-105 active:scale-95 ${
                  isToday
                    ? 'ring-2 ring-purple-500 bg-purple-50/80 dark:bg-purple-900/20 border-purple-300'
                    : isLight
                    ? 'bg-slate-50/70 border-slate-100 hover:bg-purple-50/50 hover:border-purple-200'
                    : 'bg-white/5 border-white/5 hover:bg-white/10'
                }`}
              >
                {/* Day number & indicators */}
                <div className="w-full flex items-center justify-between px-0.5">
                  <span className={`text-[11px] font-bold font-mono ${
                    isToday
                      ? 'text-purple-600 dark:text-purple-400'
                      : isLight ? 'text-slate-700' : 'text-slate-300'
                  }`}>
                    {dayNum}
                  </span>

                  <div className="flex space-x-0.5">
                    {hasFasting && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" title="단식 완주" />
                    )}
                    {hasMeal && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="식단 기록" />
                    )}
                  </div>
                </div>

                {/* Weight badge if logged */}
                {log ? (
                  <div className="w-full text-center">
                    <span className="text-[10px] font-extrabold font-mono text-purple-600 dark:text-purple-300 block truncate">
                      {log.weightKg}
                    </span>
                    {log.bodyFatPct && (
                      <span className="text-[8px] text-slate-400 font-mono block">
                        {log.bodyFatPct}%
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-[10px] text-slate-300 dark:text-slate-600 opacity-40">+</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center space-x-4 text-[10px] text-slate-400 mt-3 pt-3 border-t border-slate-100 dark:border-white/5">
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            <span>몸무게 기록</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span>단식 성공</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>식단 피드</span>
          </span>
        </div>
      </div>

      {/* Weight History List */}
      {bodyLogs.length > 0 && (
        <div className="glass-card rounded-3xl p-4.5 space-y-3">
          <h3 className={`text-xs font-bold ${isLight ? 'text-slate-700' : 'text-slate-200'}`}>
            최근 신체 기록 히스토리
          </h3>

          <div className="space-y-2">
            {bodyLogs.slice(0, 5).map((log) => (
              <div
                key={log.logId}
                onClick={() => {
                  setSelectedDateStr(log.date);
                  setIsModalOpen(true);
                }}
                className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all hover:scale-[1.01] ${
                  isLight ? 'bg-slate-50 border-slate-100 hover:bg-purple-50/50' : 'bg-white/5 border-white/5'
                }`}
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold text-slate-400">{log.date}</span>
                    {log.memo && (
                      <span className="text-[10px] text-slate-500 truncate max-w-[140px]">
                        "{log.memo}"
                      </span>
                    )}
                  </div>
                  <div className="flex space-x-2 text-[11px] text-slate-500 mt-0.5">
                    {log.bodyFatPct && <span>체지방 {log.bodyFatPct}%</span>}
                    {log.muscleMassKg && <span>골격근 {log.muscleMassKg}kg</span>}
                  </div>
                </div>

                <span className="text-sm font-extrabold font-mono text-purple-600 dark:text-purple-400">
                  {log.weightKg} kg
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Weight Record Modal */}
      <WeightRecordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedDate={selectedDateStr}
        currentTheme={currentTheme}
        onSaved={onRefreshLogs}
      />
    </div>
  );
};
