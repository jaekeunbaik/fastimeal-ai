/**
 * 첫 끼(점심) 시간과 단식 시간을 바탕으로 식사창/단식창 스케줄을 계산합니다.
 */
export function calculateFastingSchedule(firstMealTime: string = '11:30', targetFastingHours: number = 16) {
  const [firstH, firstM] = firstMealTime.split(':').map(Number);
  const eatingWindowHours = 24 - targetFastingHours;

  // 마지막 식사 종료 시간 계산 (첫 끼 + 식사 가능 시간)
  const lastTotalMinutes = (firstH * 60 + firstM + eatingWindowHours * 60) % (24 * 60);
  const lastH = Math.floor(lastTotalMinutes / 60);
  const lastM = lastTotalMinutes % 60;

  const formattedFirstMeal = `${firstH.toString().padStart(2, '0')}:${firstM.toString().padStart(2, '0')}`;
  const formattedLastMeal = `${lastH.toString().padStart(2, '0')}:${lastM.toString().padStart(2, '0')}`;

  return {
    firstMealTime: formattedFirstMeal,
    lastMealTime: formattedLastMeal,
    eatingWindowHours,
    targetFastingHours,
    eatingWindowLabel: `${formattedFirstMeal} ~ ${formattedLastMeal} (${eatingWindowHours}시간)`,
    fastingWindowLabel: `${formattedLastMeal} ~ 익일 ${formattedFirstMeal} (${targetFastingHours}시간)`,
  };
}
