// FastiMeal AI Type Definitions (Based on PRD)

export type FastingPlan = '16:8' | '18:6' | '14:10' | 'custom';

export type FastingState = 'FASTING' | 'EATING_WINDOW';

export type SessionStatus = 'IN_PROGRESS' | 'COMPLETED' | 'BROKEN';

export type SugarSpikeRisk = 'LOW' | 'MEDIUM' | 'HIGH';

export type AppTheme = 'pastel' | 'wood' | 'mono' | 'dark';

export interface MetabolicStage {
  id: number;
  name: string;
  shortDesc: string;
  longDesc: string;
  startHour: number;
  endHour: number; // 999 for infinity
  color: string;
  bgGradient: string;
  iconName: string;
}

export interface UserProfile {
  userId: string;
  nickname: string;
  heightCm?: number; // e.g. 168
  startWeightKg?: number; // e.g. 65.0
  targetWeightKg?: number; // e.g. 55.0
  firstMealTime: string; // e.g. "11:30" (첫 끼 / 점심 식사 시간)
  fastingPlan: FastingPlan;
  targetFastingHours: number;
  targetStartHour: number; // e.g. 20 (20:00)
  targetEndHour: number;   // e.g. 12 (12:00 next day)
  dailyWaterTargetMl: number; // e.g. 2000
  dailyCalorieTarget: number;
  theme: AppTheme;
  isOnboarded: boolean;
}

export interface FastingSession {
  sessionId: string;
  userId: string;
  startTime: string; // ISO string
  endTime: string | null;
  targetDurationHours: number;
  status: SessionStatus;
  notes?: string;
}

export interface FoodItem {
  name: string;
  portion: string;
  calories: number;
  carbs_g: number;
  protein_g: number;
  fat_g: number;
}

export interface TotalNutrition {
  calories: number;
  carbs_g: number;
  protein_g: number;
  fat_g: number;
}

export interface FastingImpact {
  breaks_fast: boolean;
  status_message: string;
}

export interface AIAnalysisResult {
  foods: FoodItem[];
  total_nutrition: TotalNutrition;
  sugar_spike_risk: SugarSpikeRisk;
  fasting_impact: FastingImpact;
  ai_coach_comment: string;
}

export interface MealLog {
  logId: string;
  userId: string;
  imageUrl: string;
  consumedAt: string; // ISO string
  isDuringFasting: boolean;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'drink';
  aiAnalysis: AIAnalysisResult;
}

export interface BodyLog {
  logId: string;
  date: string; // YYYY-MM-DD
  weightKg: number; // e.g. 62.5
  bodyFatPct?: number; // e.g. 21.4
  muscleMassKg?: number; // e.g. 27.8
  memo?: string;
  photoUrl?: string;
  loggedAt: string;
}

export interface WaterLog {
  logId: string;
  amountMl: number; // e.g. 250
  loggedAt: string; // ISO string
}

export interface DailySummary {
  date: string; // YYYY-MM-DD
  totalCalories: number;
  totalCarbs: number;
  totalProtein: number;
  totalFat: number;
  totalWaterMl: number;
  fastingHours: number;
  mealCount: number;
  sugarSpikeCount: number;
}
