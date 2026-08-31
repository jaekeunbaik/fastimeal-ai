import React from 'react';
import { Flame, Trophy, Scale, Droplets, BookOpen, CheckCircle2, TrendingDown, Calendar, Sparkles, HelpCircle } from 'lucide-react';
import { FastingSession, MealLog, AppTheme, UserProfile, BodyLog } from '../../types';

interface DailyStatsSummaryProps {
  sessions: FastingSession[];
  meals: MealLog[];
  bodyLogs?: BodyLog[];
  waterMl: number;
  userProfile?: UserProfile;
  currentTheme?: AppTheme;
}

const FAQS = [
  {
    q: '☕ 단식 중에 아메리카노나 차를 마셔도 되나요?',
    a: '네! 당류와 칼로리가 없는 물, 탄산수, 블랙 아메리카노, 녹차/보이차 등은 인슐린을 자극하지 않아 단식을 깨지 않습니다.'
  },
  {
    q: '🔥 배고픔(가짜 식욕)이 심할 땐 어떻게 하나요?',
    a: '식욕 호르몬(그렐린)은 20~30분 뒤 자연스럽게 가라앉습니다. 시원한 물 300ml를 천천히 마시거나 가벼운 산책을 추천합니다.'
  },
  {
    q: '💪 단식 중에 운동을 해도 괜찮은가요?',
    a: '공복 유산소 운동은 케토시스(지방 연소)를 가속화하는 데 매우 효과적입니다. 고강도 웨이트는 식사 윈도우 전후를 추천합니다.'
  },
  {
    q: '🍱 식사 가능 시간에는 무엇을 먹는 게 좋나요?',
    a: '폭식을 피하고, 채소 ➔ 단백질(고기/계란/생선) ➔ 탄수화물 순서로 섭취하면 혈당 급상승을 막고 지방 축적을 최소화할 수 있습니다.'
  }
];

export const DailyStatsSummary: React.FC<DailyStatsSummaryProps> = ({
  sessions = [],
  bodyLogs = [],
  waterMl = 0,
  userProfile,
  currentTheme = 'pastel',
}) => {
  const isLight = currentTheme !== 'dark';

  // 1. 체중 분석
  const startWeight = userProfile?.startWeightKg || (bodyLogs.length > 0 ? bodyLogs[0].weightKg : 60);
  const currentWeight = bodyLogs.length > 0 ? bodyLogs[bodyLogs.length - 1].weightKg : startWeight;
  const targetWeight = userProfile?.targetWeightKg || (startWeight - 5);
  const diffFromStart = (currentWeight - startWeight).toFixed(1);
  const diffToTarget = Math.max(0, currentWeight - targetWeight).toFixed(1);
  const isWeightLost = currentWeight <= startWeight;

  // 2. 단식 통계
  const completedCount = sessions.filter(s => s.status === 'COMPLETED').length;
  const totalCount = sessions.length;
  const streakDays = Math.max(1, completedCount);

  // 3. 요일별 단식 완주 체크리스트 (월~일)
  const DAYS = ['월', '화', '수', '목', '금', '토', '일'];
  const todayDayIdx = (new Date().getDay() + 6) % 7; // 월=0, 일=6

  const waterTarget = userProfile?.dailyWaterTargetMl || 2000;
  const waterPct = Math.min(100, Math.round((waterMl / waterTarget) * 100));

  return (
    <div className="w-full max-w-md mx-auto px-4 py-3 space-y-4">
      {/* Title */}
      <div>
        <h2 className="text-base font-bold flex items-center space-x-1.5">
          <Trophy className="w-4 h-4 text-purple-600 dark:text-emerald-400" />
          <span>나의 단식 & 체중 성공 대시보드</span>
        </h2>
        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          꾸준한 루틴이 만드는 건강한 변화
        </p>
      </div>

      {/* 1. Streak & Weekly Progress Card */}
      <div className={`glass-card rounded-3xl p-5 border ${
        isLight ? 'bg-white/95 border-purple-100 shadow-sm' : 'border-white/10'
      }`}>
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-semibold block">연속 단식 달성</span>
              <h3 className="text-base font-extrabold text-slate-800 dark:text-white">
                {streakDays}일 연속 성공 중! 🔥
              </h3>
            </div>
          </div>
          <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-purple-100 text-purple-700">
            총 {completedCount}회 완주
          </span>
        </div>

        {/* Weekly Day Tracker (Mon-Sun) */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[11px] font-bold text-slate-500 block">이번 주 성공 루틴 현황:</span>
          <div className="grid grid-cols-7 gap-1.5">
            {DAYS.map((day, idx) => {
              const isToday = idx === todayDayIdx;
              const isPast = idx <= todayDayIdx;
              return (
                <div
                  key={day}
                  className={`p-2 rounded-2xl text-center border transition-all ${
                    isPast
                      ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                      : isLight
                      ? 'bg-slate-50 border-slate-200 text-slate-400'
                      : 'bg-white/5 border-white/5 text-slate-500'
                  } ${isToday ? 'ring-2 ring-offset-2 ring-purple-500' : ''}`}
                >
                  <span className="text-[10px] block font-bold mb-0.5">{day}</span>
                  {isPast ? (
                    <CheckCircle2 className="w-3.5 h-3.5 mx-auto" />
                  ) : (
                    <span className="text-xs font-mono opacity-50">·</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Weight Progress Card */}
      <div className={`glass-card rounded-3xl p-5 border ${
        isLight ? 'bg-white/95 border-purple-100 shadow-sm' : 'border-white/10'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-semibold block">체중 변화 현황</span>
              <h3 className="text-base font-extrabold text-slate-800 dark:text-white">
                {currentWeight} kg
              </h3>
            </div>
          </div>

          <div className={`px-3 py-1 rounded-full text-xs font-extrabold flex items-center space-x-1 ${
            isWeightLost ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
          }`}>
            <TrendingDown className="w-3.5 h-3.5" />
            <span>{isWeightLost ? `${diffFromStart} kg` : `+${diffFromStart} kg`}</span>
          </div>
        </div>

        {/* 3 Metric Grid */}
        <div className="grid grid-cols-3 gap-2 pt-1 text-center">
          <div className={`p-3 rounded-2xl ${isLight ? 'bg-slate-50' : 'bg-white/5'}`}>
            <span className="text-[10px] text-slate-400 font-semibold block mb-0.5">시작 체중</span>
            <strong className="text-xs font-mono text-slate-700 dark:text-slate-200">{startWeight} kg</strong>
          </div>
          <div className={`p-3 rounded-2xl ${isLight ? 'bg-purple-50/70 border border-purple-100' : 'bg-purple-900/20'}`}>
            <span className="text-[10px] text-purple-700 dark:text-purple-300 font-bold block mb-0.5">현재 체중</span>
            <strong className="text-xs font-mono text-purple-700 dark:text-purple-300">{currentWeight} kg</strong>
          </div>
          <div className={`p-3 rounded-2xl ${isLight ? 'bg-slate-50' : 'bg-white/5'}`}>
            <span className="text-[10px] text-slate-400 font-semibold block mb-0.5">목표 체중</span>
            <strong className="text-xs font-mono text-slate-700 dark:text-slate-200">{targetWeight} kg</strong>
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs text-slate-500">
          <span>🎯 목표까지 남은 감량 무게:</span>
          <strong className="text-purple-600 font-mono font-extrabold">
            {diffToTarget > '0' ? `-${diffToTarget} kg` : '목표 달성! 🎉'}
          </strong>
        </div>
      </div>

      {/* 3. Water Intake Challenge Card */}
      <div className={`glass-card rounded-3xl p-5 border ${
        isLight ? 'bg-white/95 border-purple-100 shadow-sm' : 'border-white/10'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-2xl bg-cyan-100 text-cyan-600 flex items-center justify-center font-bold">
              <Droplets className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-semibold block">오늘의 수분 섭취</span>
              <h4 className="text-xs font-extrabold text-slate-800 dark:text-white">
                {waterMl} / {waterTarget} ml ({waterPct}%)
              </h4>
            </div>
          </div>
        </div>

        {/* Water Progress Bar */}
        <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden my-2">
          <div
            style={{ width: `${waterPct}%` }}
            className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-500"
          />
        </div>
        <span className="text-[11px] text-slate-400">
          💡 공복 중 충분한 수분 섭취는 신진대사를 20% 이상 활성화합니다.
        </span>
      </div>

      {/* 4. Fasting Essential Knowledge & FAQ */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 dark:text-slate-200">
          <BookOpen className="w-4 h-4 text-purple-600" />
          <span>간헐적 단식 필수 가이드 & 꿀팁</span>
        </div>

        <div className="space-y-2">
          {FAQS.map((faq, idx) => (
            <details
              key={idx}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer group ${
                isLight ? 'bg-white border-slate-200 hover:border-purple-300' : 'bg-white/5 border-white/5'
              }`}
            >
              <summary className="text-xs font-bold text-slate-800 dark:text-slate-200 list-none flex items-center justify-between">
                <span>{faq.q}</span>
                <span className="text-slate-400 text-xs transition-transform group-open:rotate-180">▼</span>
              </summary>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2.5 pt-2 border-t border-slate-100 dark:border-white/5 leading-relaxed">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
};
