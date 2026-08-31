import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { BottomNavigation, NavTab } from './components/layout/BottomNavigation';
import { MetabolicRingTimer } from './components/timer/MetabolicRingTimer';
import { StageDetailsModal } from './components/timer/StageDetailsModal';
import { FastingPlanSelector } from './components/timer/FastingPlanSelector';
import { WaterTracker } from './components/water/WaterTracker';
import { MealTimeline } from './components/meal/MealTimeline';
import { MealUploaderModal } from './components/meal/MealUploaderModal';
import { DailyStatsSummary } from './components/stats/DailyStatsSummary';
import { AICoachView } from './components/coach/AICoachView';
import { SettingsModal } from './components/settings/SettingsModal';

import { useFastingTimer } from './hooks/useFastingTimer';
import { StorageService } from './services/storageService';
import { FastingPlan, MealLog, UserProfile, FastingSession } from './types';

export function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('timer');
  const [userProfile, setUserProfile] = useState<UserProfile>(() => StorageService.getUserProfile());
  const [meals, setMeals] = useState<MealLog[]>(() => StorageService.getMeals());
  const [sessions, setSessions] = useState<FastingSession[]>(() => StorageService.getSessions());
  const [todayWaterMl, setTodayWaterMl] = useState<number>(() => StorageService.getTodayWaterTotal());

  // Modals state
  const [isStageModalOpen, setIsStageModalOpen] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isUploaderModalOpen, setIsUploaderModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Fasting timer hook
  const {
    isFasting,
    fastingState,
    elapsedHours,
    remainingSeconds,
    formattedElapsed,
    formattedRemaining,
    targetHours,
    progressPercent,
    currentStage,
    startFasting,
    stopFasting,
  } = useFastingTimer();

  // Water handler
  const handleAddWater = (amountMl: number) => {
    StorageService.addWater(amountMl);
    setTodayWaterMl(StorageService.getTodayWaterTotal());
  };

  // Plan select handler
  const handleSelectPlan = (plan: FastingPlan, hours: number) => {
    const updated = { ...userProfile, fastingPlan: plan, targetFastingHours: hours };
    setUserProfile(updated);
    StorageService.saveUserProfile(updated);
  };

  // Meal added handler
  const handleMealAdded = (meal: MealLog) => {
    setMeals(StorageService.getMeals());
  };

  // Meal delete handler
  const handleDeleteMeal = (logId: string) => {
    StorageService.deleteMeal(logId);
    setMeals(StorageService.getMeals());
  };

  return (
    <div className="min-h-screen bg-[#080c17] text-slate-100 flex flex-col items-center selection:bg-blue-500 selection:text-white font-sans antialiased">
      {/* Mobile Shell Wrapper (Google Play / Mobile native frame) */}
      <div className="w-full max-w-md min-h-screen flex flex-col bg-[#0a0f1d] shadow-2xl relative border-x border-white/5 pb-20">
        {/* Header */}
        <Header
          fastingState={fastingState}
          onOpenSettings={() => setIsSettingsModalOpen(true)}
          onOpenStages={() => setIsStageModalOpen(true)}
          todayWaterMl={todayWaterMl}
        />

        {/* Tab Contents */}
        <main className="flex-1 w-full pt-2">
          {currentTab === 'timer' && (
            <div className="space-y-4 animate-fade-in">
              <MetabolicRingTimer
                isFasting={isFasting}
                elapsedHours={elapsedHours}
                remainingSeconds={remainingSeconds}
                formattedElapsed={formattedElapsed}
                formattedRemaining={formattedRemaining}
                targetHours={targetHours}
                progressPercent={progressPercent}
                currentStage={currentStage}
                onStartFasting={startFasting}
                onStopFasting={stopFasting}
                onOpenStageDetails={() => setIsStageModalOpen(true)}
                onOpenPlanSelector={() => setIsPlanModalOpen(true)}
                onAddWater={handleAddWater}
              />

              <div className="px-4">
                <WaterTracker
                  todayWaterMl={todayWaterMl}
                  targetWaterMl={userProfile.dailyWaterTargetMl}
                  onAddWater={handleAddWater}
                />
              </div>

              {/* Recent Meal Preview Banner */}
              {meals.length > 0 && (
                <div className="px-4 pb-4">
                  <div
                    onClick={() => setCurrentTab('timeline')}
                    className="glass-card rounded-2xl p-3.5 border border-white/10 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={meals[0].imageUrl}
                        alt="Recent meal"
                        className="w-12 h-12 rounded-xl object-cover border border-white/10"
                      />
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">최근 식사 기록</span>
                        <h4 className="text-xs font-bold text-white truncate max-w-[170px]">
                          {meals[0].aiAnalysis.foods[0]?.name || '식사 기록'}
                        </h4>
                        <span className="text-[11px] text-orange-400 font-mono">
                          {meals[0].aiAnalysis.total_nutrition.calories} kcal • 혈당 위험도 {meals[0].aiAnalysis.sugar_spike_risk}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-blue-400 font-semibold">피드 보기 &rarr;</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {currentTab === 'timeline' && (
            <div className="animate-fade-in">
              <MealTimeline
                meals={meals}
                onDeleteMeal={handleDeleteMeal}
                onOpenUploader={() => setIsUploaderModalOpen(true)}
              />
            </div>
          )}

          {currentTab === 'stats' && (
            <div className="animate-fade-in">
              <DailyStatsSummary
                meals={meals}
                sessions={sessions}
                userProfile={userProfile}
                todayWaterMl={todayWaterMl}
              />
            </div>
          )}

          {currentTab === 'profile' && (
            <div className="animate-fade-in">
              <AICoachView
                fastingState={fastingState}
                elapsedHours={elapsedHours}
                currentStage={currentStage}
                meals={meals}
                todayWaterMl={todayWaterMl}
              />
            </div>
          )}
        </main>

        {/* Bottom Navigation with Floating Camera Action */}
        <BottomNavigation
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          onOpenMealUploader={() => setIsUploaderModalOpen(true)}
        />

        {/* Modals */}
        <StageDetailsModal
          isOpen={isStageModalOpen}
          onClose={() => setIsStageModalOpen(false)}
          currentStage={currentStage}
          elapsedHours={elapsedHours}
        />

        <FastingPlanSelector
          isOpen={isPlanModalOpen}
          onClose={() => setIsPlanModalOpen(false)}
          currentPlan={userProfile.fastingPlan}
          currentTargetHours={userProfile.targetFastingHours}
          onSelectPlan={handleSelectPlan}
        />

        <MealUploaderModal
          isOpen={isUploaderModalOpen}
          onClose={() => setIsUploaderModalOpen(false)}
          fastingState={fastingState}
          elapsedHours={elapsedHours}
          onMealAdded={handleMealAdded}
          onStopFastingRequest={stopFasting}
        />

        <SettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          onProfileUpdated={setUserProfile}
        />
      </div>
    </div>
  );
}

export default App;
