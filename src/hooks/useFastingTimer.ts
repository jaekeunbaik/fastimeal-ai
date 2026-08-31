import { useState, useEffect, useCallback } from 'react';
import { FastingSession, FastingState, MetabolicStage } from '../types';
import { getMetabolicStage } from '../constants/metabolism';
import { StorageService } from '../services/storageService';
import confetti from 'canvas-confetti';

export function useFastingTimer(defaultTargetHours: number = 16) {
  const [activeSession, setActiveSession] = useState<FastingSession | null>(() => StorageService.getActiveSession());
  const [now, setNow] = useState<number>(Date.now());

  // 1초마다 시간 갱신
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const isFasting = !!activeSession && activeSession.status === 'IN_PROGRESS';
  const fastingState: FastingState = isFasting ? 'FASTING' : 'EATING_WINDOW';

  // 경과 밀리초
  const startTimeMs = activeSession ? new Date(activeSession.startTime).getTime() : now;
  const elapsedMs = isFasting ? Math.max(0, now - startTimeMs) : 0;
  const elapsedSeconds = Math.floor(elapsedMs / 1000);
  const elapsedHours = elapsedSeconds / 3600;

  const targetHours = activeSession?.targetDurationHours || defaultTargetHours || 16;
  const targetMs = targetHours * 3600 * 1000;
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
    formattedElapsed: formatTime(elapsedSeconds),
    formattedRemaining: formatTime(remainingSeconds),
    startFasting,
    stopFasting,
  };
}
