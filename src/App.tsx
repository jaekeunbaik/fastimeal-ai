import React, { useState } from 'react';
import { Header } from './components/layout/Header';
import { BottomNavigation, NavTab } from './components/layout/BottomNavigation';
import { MetabolicRingTimer } from './components/timer/MetabolicRingTimer';
import { StageDetailsModal } from './components/timer/StageDetailsModal';
import { FastingPlanSelector } from './components/timer/FastingPlanSelector';
import { StartFastingModal } from './components/timer/StartFastingModal';
import { WaterTracker } from './components/water/WaterTracker';
import { MealTimeline } from './components/meal/MealTimeline';
import { MealUploaderModal } from './components/meal/MealUploaderModal';
import { DailyStatsSummary } from './components/stats/DailyStatsSummary';
import { BodyCalendarView } from './components/calendar/BodyCalendarView';
import { SettingsModal } from './components/settings/SettingsModal';
import { ThemeSelectorModal } from './components/theme/ThemeSelectorModal';
import { OnboardingModal } from './components/onboarding/OnboardingModal';

import { useFastingTimer } from './hooks/useFastingTimer';
import { StorageService } from './services/storageService';
import { FastingPlan, MealLog, UserProfile, FastingSession, AppTheme, BodyLog } from './types';
import { THEMES } from './constants/themes';

export function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('timer');
  const [userProfile, setUserProfile] = useState<UserProfile>(() => StorageService.getUserProfile());
  const [meals, setMeals] = useState<MealLog[]>(() => StorageService.getMeals());
  const [sessions, setSessions] = useState<FastingSession[]>(() => StorageService.getSessions());
  const [bodyLogs, setBodyLogs] = useState<BodyLog[]>(() => StorageService.getBodyLogs());
  const [todayWaterMl, setTodayWaterMl] = useState<number>(() => StorageService.getTodayWaterTotal());

  // Current active theme (Default: pastel)
  const currentTheme: AppTheme = userProfile.theme || 'pastel';
  const themeConfig = THEMES[currentTheme] || THEMES.pastel;
  const isLight = currentTheme !== 'dark';

  // Modals state
  const [isStageModalOpen, setIsStageModalOpen] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isUploaderModalOpen, setIsUploaderModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isStartModalOpen, setIsStartModalOpen] = useState(false);

  // Fasting timer hook (동적으로 선택된 targetFastingHours 연동)
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
  } = useFastingTimer(userProfile.targetFastingHours || 16);

  // Water handler
  const handleAddWater = (amountMl: number) => {
    StorageService.addWater(amountMl);
    setTodayWaterMl(StorageService.getTodayWaterTotal());
  };

  // Plan select handler (including firstMealTime)
  const handleSelectPlan = (plan: FastingPlan, hours: number, firstMealTime?: string) => {
    const updated = {
      ...userProfile,
      fastingPlan: plan,
      targetFastingHours: hours,
      firstMealTime: firstMealTime || userProfile.firstMealTime || '11:30'
    };
    setUserProfile(updated);
    StorageService.saveUserProfile(updated);
  };

  // Theme change handler
  const handleSelectTheme = (theme: AppTheme) => {
    const updated = { ...userProfile, theme };
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

  // Refresh body logs
  const handleRefreshBodyLogs = () => {
    setBodyLogs(StorageService.getBodyLogs());
  };

  return (
    <div className={`min-h-screen ${themeConfig.bgClass} flex flex-col items-center selection:bg-purple-300 selection:text-purple-900 font-sans antialiased transition-colors duration-300`}>
      {/* Mobile Shell Wrapper (Google Play / Mobile native frame) */}
      <div className={`w-full max-w-md min-h-screen flex flex-col shadow-2xl relative border-x transition-colors duration-300 pb-20 ${
        currentTheme === 'pastel'
          ? 'bg-[#fcf9fe] border-purple-100 text-slate-800'
          : currentTheme === 'wood'
          ? 'bg-[#faf6f0] border-[#ecdcd0] text-[#443627]'
          : currentTheme === 'mono'
          ? 'bg-[#f8fafc] border-slate-200 text-slate-900'
          : 'bg-[#0a0f1d] border-white/5 text-slate-100'
      }`}>
        {/* Header */}
        <Header
          fastingState={fastingState}
          currentTheme={currentTheme}
          onOpenSettings={() => setIsSettingsModalOpen(true)}
          onOpenStages={() => setIsStageModalOpen(true)}
          onOpenThemeSelector={() => setIsThemeModalOpen(true)}
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
                currentTheme={currentTheme}
                firstMealTime={userProfile.firstMealTime || '11:30'}
                onStartFasting={() => setIsStartModalOpen(true)}
                onStopFasting={stopFasting}
                onOpenStageDetails={() => setIsStageModalOpen(true)}
                onOpenPlanSelector={() => setIsPlanModalOpen(true)}
                onAddWater={handleAddWater}
              />

              <div className="px-4">
                <WaterTracker
                  todayWaterMl={todayWaterMl}
                  targetWaterMl={userProfile.dailyWaterTargetMl}
                  currentTheme={currentTheme}
                  onAddWater={handleAddWater}
                />
              </div>

              {/* Recent Meal Preview Banner */}
              {meals.length > 0 && (
                <div className="px-4 pb-4">
                  <div
                    onClick={() => setCurrentTab('timeline')}
                    className={`glass-card rounded-3xl p-3.5 border flex items-center justify-between cursor-pointer transition-all hover:scale-[1.01] ${
                      isLight ? 'border-purple-100 shadow-xs' : 'border-white/10'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={meals[0].imageUrl}
                        alt="Recent meal"
                        className="w-12 h-12 rounded-2xl object-cover border border-slate-200/60 shadow-xs"
                      />
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider block text-slate-400">
                          최근 식사 기록
                        </span>
                        <h4 className={`text-xs font-bold truncate max-w-[170px] ${
                          isLight ? 'text-slate-800' : 'text-white'
                        }`}>
                          {meals[0].aiAnalysis.foods[0]?.name || '식사 기록'}
                        </h4>
                        <span className="text-[11px] text-orange-500 font-mono font-semibold">
                          {meals[0].aiAnalysis.total_nutrition.calories} kcal • 혈당 위험도 {meals[0].aiAnalysis.sugar_spike_risk}
                        </span>
                      </div>
                    </div>
                    <span className={`text-xs font-bold ${
                      currentTheme === 'pastel' ? 'text-purple-600' : isLight ? 'text-blue-600' : 'text-blue-400'
                    }`}>
                      피드 보기 &rarr;
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {currentTab === 'timeline' && (
            <div className="animate-fade-in">
              <MealTimeline
                meals={meals}
                currentTheme={currentTheme}
                onDeleteMeal={handleDeleteMeal}
                onOpenUploader={() => setIsUploaderModalOpen(true)}
              />
            </div>
          )}

          {currentTab === 'calendar' && (
            <div className="animate-fade-in">
              <BodyCalendarView
                bodyLogs={bodyLogs}
                sessions={sessions}
                meals={meals}
                currentTheme={currentTheme}
                onRefreshLogs={handleRefreshBodyLogs}
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
        </main>

        {/* Bottom Navigation with Floating Camera Action */}
        <BottomNavigation
          currentTab={currentTab}
          currentTheme={currentTheme}
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
          currentFirstMealTime={userProfile.firstMealTime || '11:30'}
          currentTheme={currentTheme}
          onSelectPlan={handleSelectPlan}
        />

        <StartFastingModal
          isOpen={isStartModalOpen}
          onClose={() => setIsStartModalOpen(false)}
          targetHours={targetHours}
          firstMealTime={userProfile.firstMealTime || '11:30'}
          currentTheme={currentTheme}
          onConfirmStart={(startTimeIso, hours) => {
            startFasting(hours, startTimeIso);
          }}
        />

        <MealUploaderModal
          isOpen={isUploaderModalOpen}
          onClose={() => setIsUploaderModalOpen(false)}
          fastingState={fastingState}
          elapsedHours={elapsedHours}
          onMealAdded={handleMealAdded}
          onStopFastingRequest={stopFasting}
        />

        <ThemeSelectorModal
          isOpen={isThemeModalOpen}
          onClose={() => setIsThemeModalOpen(false)}
          currentTheme={currentTheme}
          onSelectTheme={handleSelectTheme}
        />

        <SettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          onProfileUpdated={setUserProfile}
        />

        {/* First-launch Onboarding Wizard (Nickname, Height, Weight, BMI) */}
        <OnboardingModal
          isOpen={!userProfile.isOnboarded}
          currentTheme={currentTheme}
          onComplete={(profile) => {
            setUserProfile(profile);
            setBodyLogs(StorageService.getBodyLogs());
          }}
        />
      </div>
    </div>
  );
}

export default App;
