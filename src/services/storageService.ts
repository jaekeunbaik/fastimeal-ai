import { UserProfile, FastingSession, MealLog, WaterLog } from '../types';

const USER_KEY = 'fastimeal_user_profile';
const SESSIONS_KEY = 'fastimeal_sessions';
const MEALS_KEY = 'fastimeal_meals';
const WATER_KEY = 'fastimeal_water';

export const DEFAULT_USER: UserProfile = {
  userId: 'user_local',
  nickname: '',
  fastingPlan: '16:8',
  targetFastingHours: 16,
  targetStartHour: 20, // 20:00 단식 시작
  targetEndHour: 12,   // 12:00 익일 식사창 오픈
  dailyWaterTargetMl: 2000,
  dailyCalorieTarget: 1800,
  aiProvider: 'gemini',
  apiKey: '',
  theme: 'pastel',
};

export const INITIAL_MEALS: MealLog[] = [
  {
    logId: 'meal-sample-1',
    userId: 'user-default-1',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    consumedAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    isDuringFasting: false,
    mealType: 'lunch',
    aiAnalysis: {
      foods: [
        { name: '수비드 닭가슴살 샐러드', portion: '1접시 (250g)', calories: 280, carbs_g: 10, protein_g: 38, fat_g: 7 },
        { name: '삶은 달걀', portion: '1개', calories: 75, carbs_g: 1, protein_g: 6, fat_g: 5 },
        { name: '아보카도 슬라이스', portion: '1/2개 (80g)', calories: 120, carbs_g: 4, protein_g: 1, fat_g: 11 }
      ],
      total_nutrition: {
        calories: 475,
        carbs_g: 15,
        protein_g: 45,
        fat_g: 23
      },
      sugar_spike_risk: 'LOW',
      fasting_impact: {
        breaks_fast: true,
        status_message: '식사 윈도우 내 완벽한 고단백 저당 식단입니다.'
      },
      ai_coach_comment: '풍부한 단백질과 건강한 불포화지방(아보카도)으로 포만감을 오래 지속시켜주는 훌륭한 식단입니다! 혈당 스파이크 위험이 매우 낮아 단식 전환에도 이상적입니다.'
    }
  }
];

export const StorageService = {
  getUserProfile(): UserProfile {
    try {
      const data = localStorage.getItem(USER_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed to parse user profile', e);
    }
    return DEFAULT_USER;
  },

  saveUserProfile(profile: UserProfile): void {
    localStorage.setItem(USER_KEY, JSON.stringify(profile));
  },

  getActiveSession(): FastingSession | null {
    const sessions = this.getSessions();
    return sessions.find(s => s.status === 'IN_PROGRESS') || null;
  },

  getSessions(): FastingSession[] {
    try {
      const data = localStorage.getItem(SESSIONS_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed to parse sessions', e);
    }
    // 출시용 클린 상태: 초기 세션 없음
    return [];
  },

  saveSessions(sessions: FastingSession[]): void {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  },

  startFasting(targetHours = 16): FastingSession {
    const sessions = this.getSessions().map(s => {
      if (s.status === 'IN_PROGRESS') {
        return { ...s, status: 'BROKEN' as const, endTime: new Date().toISOString() };
      }
      return s;
    });

    const newSession: FastingSession = {
      sessionId: `session_${Date.now()}`,
      userId: 'user_local',
      startTime: new Date().toISOString(),
      endTime: null,
      targetDurationHours: targetHours,
      status: 'IN_PROGRESS',
    };

    sessions.unshift(newSession);
    this.saveSessions(sessions);
    return newSession;
  },

  stopFasting(): FastingSession | null {
    const sessions = this.getSessions();
    const activeIndex = sessions.findIndex(s => s.status === 'IN_PROGRESS');
    if (activeIndex === -1) return null;

    const active = sessions[activeIndex];
    const elapsedHours = (Date.now() - new Date(active.startTime).getTime()) / (1000 * 3600);
    const completed = elapsedHours >= active.targetDurationHours;

    sessions[activeIndex] = {
      ...active,
      endTime: new Date().toISOString(),
      status: completed ? 'COMPLETED' : 'BROKEN',
    };

    this.saveSessions(sessions);
    return sessions[activeIndex];
  },

  getMeals(): MealLog[] {
    try {
      const data = localStorage.getItem(MEALS_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed to parse meals', e);
    }
    // 출시용 클린 상태: 초기 식단 없음
    return [];
  },

  addMeal(meal: MealLog): void {
    const meals = this.getMeals();
    meals.unshift(meal);
    localStorage.setItem(MEALS_KEY, JSON.stringify(meals));
  },

  deleteMeal(logId: string): void {
    const meals = this.getMeals().filter(m => m.logId !== logId);
    localStorage.setItem(MEALS_KEY, JSON.stringify(meals));
  },

  getWaterLogs(): WaterLog[] {
    try {
      const data = localStorage.getItem(WATER_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed to parse water logs', e);
    }
    // 출시용 클린 상태: 0ml 시작
    return [];
  },

  addWater(amountMl = 250): WaterLog {
    const logs = this.getWaterLogs();
    const newLog: WaterLog = {
      logId: `water_${Date.now()}`,
      amountMl,
      loggedAt: new Date().toISOString(),
    };
    logs.unshift(newLog);
    localStorage.setItem(WATER_KEY, JSON.stringify(logs));
    return newLog;
  },

  getTodayWaterTotal(): number {
    const todayStr = new Date().toDateString();
    return this.getWaterLogs()
      .filter(w => new Date(w.loggedAt).toDateString() === todayStr)
      .reduce((sum, w) => sum + w.amountMl, 0);
  }
};
