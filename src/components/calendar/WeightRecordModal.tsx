import React, { useState, useEffect } from 'react';
import { X, Scale, Activity, Save, Trash2, Calendar as CalendarIcon, Check } from 'lucide-react';
import { BodyLog, AppTheme } from '../../types';
import { StorageService } from '../../services/storageService';

interface WeightRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string; // YYYY-MM-DD
  currentTheme?: AppTheme;
  onSaved: () => void;
}

export const WeightRecordModal: React.FC<WeightRecordModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  currentTheme = 'pastel',
  onSaved,
}) => {
  const [weight, setWeight] = useState<string>('');
  const [bodyFat, setBodyFat] = useState<string>('');
  const [muscle, setMuscle] = useState<string>('');
  const [memo, setMemo] = useState<string>('');
  const [existingLog, setExistingLog] = useState<BodyLog | null>(null);

  useEffect(() => {
    if (isOpen && selectedDate) {
      const log = StorageService.getBodyLogByDate(selectedDate);
      if (log) {
        setExistingLog(log);
        setWeight(log.weightKg.toString());
        setBodyFat(log.bodyFatPct?.toString() || '');
        setMuscle(log.muscleMassKg?.toString() || '');
        setMemo(log.memo || '');
      } else {
        setExistingLog(null);
        // 이전 최신 몸무게가 있으면 가이드로 활용
        const allLogs = StorageService.getBodyLogs();
        setWeight(allLogs[0]?.weightKg ? allLogs[0].weightKg.toString() : '');
        setBodyFat('');
        setMuscle('');
        setMemo('');
      }
    }
  }, [isOpen, selectedDate]);

  if (!isOpen) return null;

  const isLight = currentTheme !== 'dark';

  const handleSave = () => {
    const wNum = parseFloat(weight);
    if (isNaN(wNum) || wNum <= 0) {
      alert('올바른 몸무게를 입력해주세요.');
      return;
    }

    const log: BodyLog = {
      logId: existingLog?.logId || `body_${Date.now()}`,
      date: selectedDate,
      weightKg: wNum,
      bodyFatPct: bodyFat ? parseFloat(bodyFat) : undefined,
      muscleMassKg: muscle ? parseFloat(muscle) : undefined,
      memo: memo.trim() || undefined,
      loggedAt: new Date().toISOString(),
    };

    StorageService.saveBodyLog(log);
    onSaved();
    onClose();
  };

  const handleDelete = () => {
    if (confirm(`${selectedDate}의 신체 기록을 삭제하시겠습니까?`)) {
      StorageService.deleteBodyLog(selectedDate);
      onSaved();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className={`w-full max-w-md rounded-3xl p-5 border shadow-2xl transition-all flex flex-col ${
        isLight ? 'bg-white text-slate-800 border-purple-100' : 'bg-[#0e1628] text-white border-white/10'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between pb-3 border-b mb-4 ${
          isLight ? 'border-slate-100' : 'border-white/10'
        }`}>
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              isLight ? 'bg-purple-100 text-purple-600' : 'bg-purple-500/20 text-purple-400'
            }`}>
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold">신체 기록 (몸무게 & 체지방)</h2>
              <p className="text-[11px] text-slate-400 flex items-center mt-0.5">
                <CalendarIcon className="w-3 h-3 mr-1" /> {selectedDate}
              </p>
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

        {/* Input Form */}
        <div className="space-y-4">
          {/* Main Weight Input */}
          <div className={`p-4 rounded-2xl border text-center ${
            isLight ? 'bg-purple-50/50 border-purple-100' : 'bg-white/5 border-white/5'
          }`}>
            <label className="text-xs font-semibold text-slate-500 block mb-1.5">오늘 측정한 몸무게</label>
            <div className="flex items-center justify-center space-x-1.5">
              <input
                type="number"
                step="0.1"
                placeholder="60.0"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                autoFocus
                className={`w-36 text-center text-3xl font-extrabold font-mono py-1 rounded-xl transition-all focus:outline-none ${
                  isLight
                    ? 'bg-white border-2 border-purple-300 text-slate-800 focus:border-purple-500 shadow-sm'
                    : 'bg-slate-800 border-2 border-slate-700 text-white focus:border-purple-400'
                }`}
              />
              <span className="text-lg font-bold text-slate-500">kg</span>
            </div>
          </div>

          {/* Body Fat & Muscle Mass (Optional) */}
          <div className="grid grid-cols-2 gap-3">
            <div className={`p-3 rounded-2xl border ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/5'
            }`}>
              <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                체지방률 (%) <span className="text-[10px] text-slate-400 font-normal">선택</span>
              </label>
              <div className="flex items-center space-x-1">
                <input
                  type="number"
                  step="0.1"
                  placeholder="예: 21.5"
                  value={bodyFat}
                  onChange={(e) => setBodyFat(e.target.value)}
                  className={`w-full px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold focus:outline-none ${
                    isLight ? 'bg-white border border-slate-200' : 'bg-slate-800 text-white border border-slate-700'
                  }`}
                />
                <span className="text-xs font-semibold text-slate-400">%</span>
              </div>
            </div>

            <div className={`p-3 rounded-2xl border ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/5'
            }`}>
              <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                골격근량 (kg) <span className="text-[10px] text-slate-400 font-normal">선택</span>
              </label>
              <div className="flex items-center space-x-1">
                <input
                  type="number"
                  step="0.1"
                  placeholder="예: 28.0"
                  value={muscle}
                  onChange={(e) => setMuscle(e.target.value)}
                  className={`w-full px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold focus:outline-none ${
                    isLight ? 'bg-white border border-slate-200' : 'bg-slate-800 text-white border border-slate-700'
                  }`}
                />
                <span className="text-xs font-semibold text-slate-400">kg</span>
              </div>
            </div>
          </div>

          {/* Daily Condition Memo */}
          <div>
            <label className="text-[11px] font-semibold text-slate-500 block mb-1">오늘의 눈바디 / 컨디션 메모</label>
            <input
              type="text"
              placeholder="예: 아침 공복 측정, 붓기가 많이 빠짐 ✨"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs transition-all focus:outline-none ${
                isLight
                  ? 'bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:border-purple-500'
                  : 'bg-slate-800 border border-slate-700 text-white placeholder-slate-500'
              }`}
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className={`pt-4 mt-4 border-t flex items-center space-x-2 ${
          isLight ? 'border-slate-100' : 'border-white/10'
        }`}>
          {existingLog && (
            <button
              onClick={handleDelete}
              className="p-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-500 border border-rose-200 transition-colors"
              title="기록 삭제"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={handleSave}
            className={`flex-1 py-3.5 rounded-2xl font-bold text-xs flex items-center justify-center space-x-2 text-white shadow-md active:scale-[0.98] transition-all ${
              currentTheme === 'pastel'
                ? 'bg-purple-600 hover:bg-purple-500 shadow-purple-500/25'
                : 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/25'
            }`}
          >
            <Save className="w-4 h-4" />
            <span>기록 저장하기</span>
          </button>
        </div>
      </div>
    </div>
  );
};
