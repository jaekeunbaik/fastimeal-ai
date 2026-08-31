import { useState, useEffect, useCallback } from 'react';
import { FastingSession, FastingState, MetabolicStage } from '../types';
import { getMetabolicStage } from '../constants/metabolism';
import { StorageService } from '../services/storageService';
import { calculateFastingSchedule } from '../utils/fastingSchedule';
import confetti from 'canvas-confetti';

interface UseFastingTimerProps {
  firstMealTime?: string; // e.g. "11:30"
  defaultTargetHours?: number; // e.g. 16
}

export function useFastingTimer({
  firstMealTime = '11:30',
  defaultTargetHours = 16,
}: UseFastingTimerProps = {}) {
  const [activeSession, setActiveSession] = useState<FastingSession | null>(() => StorageService.getActiveSession());
  const [now, setNow] = useState<number>(Date.now());

  // 1초마다 시간 갱신
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const targetHours = activeSession?.targetDurationHours || defaultTargetHours || 16;
  const schedule = calculateFastingSchedule(firstMealTime, targetHours);

  // 24시간 자동 루틴 계산 로직
  // firstMeal: 11:30, lastMeal: 19:30 (16:8 기준)
  const nowDate = new Date(now);
  const currentMinutesFromMidnight = nowDate.getHours() * 60 + nowDate.getMinutes() + nowDate.getSeconds() / 60;

  const [firstH, firstM] = schedule.firstMealTime.split(':').map(Number);
  const [lastH, lastM] = schedule.lastMealTime.split(':').map(Number);
  const firstMealMinutes = firstH * 60 + firstM;
  const lastMealMinutes = lastH * 60 + lastM;

  // 현재가 식사 윈도우인지 단식 윈도우인지 판별
  let isCurrentlyInEatingWindow = false;
  if (firstMealMinutes < lastMealMinutes) {
    // 예: 11:30 ~ 19:30
    isCurrentlyInEatingWindow = currentMinutesFromMidnight >= firstMealMinutes && currentMinutesFromMidnight < lastMealMinutes;
  } else {
    // 자정을 넘기는 식사창인 경우
    isCurrentlyInEatingWindow = currentMinutesFromMidnight >= firstMealMinutes || currentMinutesFromMidnight < lastMealMinutes;
  }

  // 수동 세션이 활성화되어 있으면 수동 세션 우선, 없으면 24시간 자동 루틴 적용
  const isFasting = activeSession ? activeSession.status === 'IN_PROGRESS' : !isCurrentlyInEatingWindow;
  const fastingState: FastingState = isFasting ? 'FASTING' : 'EATING_WINDOW';

  // 단식 경과 시간 계산
  let elapsedMs = 0;
  let targetMs = targetHours * 3600 * 1000;

  if (activeSession) {
    // 수동 세션
    const startTimeMs = new Date(activeSession.startTime).getTime();
    elapsedMs = Math.max(0, now - startTimeMs);
  } else if (isFasting) {
    // 자동 단식 루틴: 직전 마지막 식사 시각(예: 어제 또는 오늘의 19:30)부터 현재까지
    const lastMealDate = new Date(now);
    lastMealDate.setHours(lastH, lastM, 0, 0);
    if (nowDate.getTime() < lastMealDate.getTime()) {
      // 아직 오늘 마지막 식사 시각 전이라면 어제 마지막 식사 시각이 시작점
      lastMealDate.setDate(lastMealDate.getDate() - 1);
    }
    elapsedMs = Math.max(0, now - lastMealDate.getTime());
  } else {
    // 식사창 중: 오늘 첫 끼 시각(11:30)부터 경과된 시간
    const firstMealDate = new Date(now);
    firstMealDate.setHours(firstH, firstM, 0, 0);
    if (nowDate.getTime() < firstMealDate.getTime()) {
      firstMealDate.setDate(firstMealDate.getDate() - 1);
    }
    elapsedMs = Math.max(0, now - firstMealDate.getTime());
    targetMs = schedule.eatingWindowHours * 3600 * 1000;
  }

  const elapsedSeconds = Math.floor(elapsedMs / 1000);
  const elapsedHours = elapsedSeconds / 3600;

  const remainingMs = Math.max(0, targetMs - elapsedMs);
  const remainingSeconds = Math.floor(remainingMs / 1000);

  // 달성률 (%)
  const progressPercent = Math.min(100, (elapsedMs / targetMs) * 100);
  const isGoalReached = isFasting && elapsedMs >= targetMs;

  // 현재 대사 단계
  const currentStage: MetabolicStage = getMetabolicStage(elapsedHours);

  // 시간 포맷 (HH:MM:SS)
  const formatTime = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startFasting = useCallback((hours = 16, customStartTimeIso?: string) => {
    const newSession = StorageService.startFasting(hours, customStartTimeIso);
    setActiveSession(newSession);
  }, []);

  const stopFasting = useCallback(() => {
    const ended = StorageService.stopFasting();
    if (ended?.status === 'COMPLETED') {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
    setActiveSession(null);
  }, []);

  return {
    isFasting,
    fastingState,
    activeSession,
    elapsedHours,
    elapsedSeconds,
    remainingSeconds,
    targetHours,
    progressPercent,
    isGoalReached,
    currentStage,
    schedule,
    formattedElapsed: formatTime(elapsedSeconds),
    formattedRemaining: formatTime(remainingSeconds),
    startFasting,
    stopFasting,
  };
}
