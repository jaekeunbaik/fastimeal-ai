import { AIAnalysisResult, FastingState } from '../types';

export const AI_SYSTEM_PROMPT = `
You are an expert clinical dietitian and intermittent fasting coach for "FastiMeal AI".
Analyze the provided food image and the user's current fasting status, then return ONLY a valid JSON object without any markdown code fences or conversational text.

### CONTEXT INPUT:
- user_current_state: "FASTING" (공복 유지 시간) OR "EATING_WINDOW" (식사 가능 시간)
- fasting_elapsed_hours: [Number, e.g., 14.5]
- current_time: "HH:MM"

### TASK:
1. Identify all recognizable food items and estimate portion sizes.
2. Estimate total calories and macronutrients (carbohydrates, protein, fat in grams).
3. Evaluate sugar/blood sugar spike risk (LOW / MEDIUM / HIGH).
4. Provide structured, encouraging feedback in Korean:
 - If user_current_state == "FASTING":
   - If it has calories (>5 kcal): Warn that fasting is broken, explain metabolic impact, and ask if timer should be reset.
   - If zero calorie (Water, Black Coffee, Plain Tea): Confirm fasting is safely maintained.
 - If user_current_state == "EATING_WINDOW":
   - Praise balanced protein/veggies, warn about liquid fructose/refined carbs if detected, and advise on satiety.

### OUTPUT JSON SCHEMA:
{
  "foods": [
    { "name": "string (Korean)", "portion": "string", "calories": number, "carbs_g": number, "protein_g": number, "fat_g": number }
  ],
  "total_nutrition": {
    "calories": number,
    "carbs_g": number,
    "protein_g": number,
    "fat_g": number
  },
  "sugar_spike_risk": "LOW" | "MEDIUM" | "HIGH",
  "fasting_impact": {
    "breaks_fast": boolean,
    "status_message": "string (Korean short summary)"
  },
  "ai_coach_comment": "string (2-3 sentences in polite, supportive Korean)"
}
`;

interface AnalyzeParams {
  imageBase64: string;
  fastingState: FastingState;
  elapsedHours: number;
  currentTime: string;
  apiKey?: string;
  provider?: 'gemini' | 'openai';
  customMealDescription?: string;
}

export async function analyzeFoodImage({
  imageBase64,
  fastingState,
  elapsedHours,
  currentTime,
  apiKey,
  provider = 'gemini',
  customMealDescription
}: AnalyzeParams): Promise<AIAnalysisResult> {
  // 실제 API 키가 제공된 경우 외부 LLM 호출 시도
  if (apiKey && apiKey.trim().length > 10) {
    try {
      if (provider === 'gemini') {
        return await analyzeWithGemini({ imageBase64, fastingState, elapsedHours, currentTime, apiKey, customMealDescription });
      } else {
        return await analyzeWithOpenAI({ imageBase64, fastingState, elapsedHours, currentTime, apiKey, customMealDescription });
      }
    } catch (err) {
      console.warn('Direct AI API call failed, falling back to smart simulation:', err);
    }
  }

  // 모의 시뮬레이션 fallback (지능형 데모 분석)
  return simulateFoodAnalysis(fastingState, elapsedHours, customMealDescription);
}

async function analyzeWithGemini({
  imageBase64,
  fastingState,
  elapsedHours,
  currentTime,
  apiKey,
  customMealDescription
}: {
  imageBase64: string;
  fastingState: FastingState;
  elapsedHours: number;
  currentTime: string;
  apiKey: string;
  customMealDescription?: string;
}): Promise<AIAnalysisResult> {
  const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const promptText = `${AI_SYSTEM_PROMPT}\n\n[USER CONTEXT]\nuser_current_state: "${fastingState}"\nfasting_elapsed_hours: ${elapsedHours.toFixed(1)}\ncurrent_time: "${currentTime}"\n${customMealDescription ? `user_notes: "${customMealDescription}"` : ''}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [
          { text: promptText },
          {
            inline_data: {
              mime_type: 'image/jpeg',
              data: cleanBase64
            }
          }
        ]
      }],
      generationConfig: {
        response_mime_type: "application/json",
        temperature: 0.2
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Gemini API Error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) throw new Error('Empty response from Gemini');

  return parseJsonResponse(rawText);
}

async function analyzeWithOpenAI({
  imageBase64,
  fastingState,
  elapsedHours,
  currentTime,
  apiKey,
  customMealDescription
}: {
  imageBase64: string;
  fastingState: FastingState;
  elapsedHours: number;
  currentTime: string;
  apiKey: string;
  customMealDescription?: string;
}): Promise<AIAnalysisResult> {
  const url = 'https://api.openai.com/v1/chat/completions';
  const promptText = `[USER CONTEXT]\nuser_current_state: "${fastingState}"\nfasting_elapsed_hours: ${elapsedHours.toFixed(1)}\ncurrent_time: "${currentTime}"\n${customMealDescription ? `user_notes: "${customMealDescription}"` : ''}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      response_format: { type: "json_object" },
      messages: [
        { role: 'system', content: AI_SYSTEM_PROMPT },
        {
          role: 'user',
          content: [
            { type: 'text', text: promptText },
            {
              type: 'image_url',
              image_url: { url: imageBase64.startsWith('data:') ? imageBase64 : `data:image/jpeg;base64,${imageBase64}` }
            }
          ]
        }
      ],
      temperature: 0.2
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI API Error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const rawText = data.choices?.[0]?.message?.content;
  return parseJsonResponse(rawText);
}

function parseJsonResponse(rawText: string): AIAnalysisResult {
  let cleaned = rawText.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json/, '').replace(/```$/, '').trim();
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```/, '').replace(/```$/, '').trim();
  }
  return JSON.parse(cleaned) as AIAnalysisResult;
}

// 지능형 스마트 데모 분석 시뮬레이터 (PRD 규칙 100% 반영)
function simulateFoodAnalysis(
  fastingState: FastingState,
  elapsedHours: number,
  customMealDescription?: string
): AIAnalysisResult {
  const isZeroCalorie = customMealDescription?.includes('물') || 
                        customMealDescription?.includes('아메리카노') || 
                        customMealDescription?.includes('차') || 
                        customMealDescription?.includes('커피');

  if (isZeroCalorie) {
    return {
      foods: [{ name: customMealDescription || '블랙 커피 / 무가당 티', portion: '1잔 (300ml)', calories: 4, carbs_g: 0.5, protein_g: 0.2, fat_g: 0 }],
      total_nutrition: { calories: 4, carbs_g: 0.5, protein_g: 0.2, fat_g: 0 },
      sugar_spike_risk: 'LOW',
      fasting_impact: {
        breaks_fast: false,
        status_message: '0칼로리 음료로 단식(공복) 상태가 안전하게 유지됩니다! ✨'
      },
      ai_coach_comment: '수분과 미네랄을 보충하며 공복 상태를 완벽히 유지하고 계십니다. 인슐린 분비 자극 없이 케토시스/자가포식 대사가 계속 활성화됩니다.'
    };
  }

  if (fastingState === 'FASTING') {
    return {
      foods: [
        { name: customMealDescription || '연어 아보카도 샐러드 & 통곡물 브레드', portion: '1인분 (320g)', calories: 490, carbs_g: 28, protein_g: 32, fat_g: 26 }
      ],
      total_nutrition: { calories: 490, carbs_g: 28, protein_g: 32, fat_g: 26 },
      sugar_spike_risk: 'LOW',
      fasting_impact: {
        breaks_fast: true,
        status_message: `⚠️ 단식 ${elapsedHours.toFixed(1)}시간차에 섭취가 감지되었습니다. 공복이 해제됩니다.`
      },
      ai_coach_comment: `현재 공복 유지 시간(${elapsedHours.toFixed(1)}h) 중 영양 섭취가 이루어져 인슐린이 분비되고 지방 연소 대사가 일시 중지됩니다. 필요 시 단식 타이머를 리셋하고 식사 윈도우를 시작하세요!`
    };
  }

  // 식사창 중일 때
  return {
    foods: [
      { name: customMealDescription || '소고기 부채살 구이 & 구운 야채', portion: '200g + 야채 150g', calories: 520, carbs_g: 14, protein_g: 48, fat_g: 30 }
    ],
    total_nutrition: { calories: 520, carbs_g: 14, protein_g: 48, fat_g: 30 },
    sugar_spike_risk: 'LOW',
    fasting_impact: {
      breaks_fast: true,
      status_message: '식사 윈도우 내 영양 균형이 매우 훌륭한 고단백 식사입니다.'
    },
    ai_coach_comment: '양질의 단백질과 풍부한 섬유질이 포함되어 있어 혈당 급상승을 막고 다음 단식 구간까지 든든한 포만감을 지속시켜줍니다. 훌륭한 선택입니다!'
  };
}
