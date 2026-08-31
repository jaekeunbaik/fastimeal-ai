import { MetabolicStage } from '../types';

export const METABOLIC_STAGES: MetabolicStage[] = [
  {
    id: 1,
    name: '소화 및 혈당 상승',
    shortDesc: '음식 소화 및 영양소 흡수 중',
    longDesc: '섭취한 음식이 소화되며 혈당이 상승하고 췌장에서 인슐린이 분비되어 세포로 에너지를 전달합니다. 소화기계가 활발히 작동합니다.',
    startHour: 0,
    endHour: 2,
    color: '#f59e0b', // amber
    bgGradient: 'from-amber-500/20 to-orange-500/10',
    iconName: 'Flame',
  },
  {
    id: 2,
    name: '혈당 안정 & 인슐린 저하',
    shortDesc: '혈당 수치 정상화 및 지방 저장 중단',
    longDesc: '소화가 마무리되면서 혈당과 인슐린 수치가 기저 수준으로 떨어집니다. 체내 에너지 저장이 멈추고 신체가 안정 단계에 진입합니다.',
    startHour: 2,
    endHour: 8,
    color: '#3b82f6', // blue
    bgGradient: 'from-blue-500/20 to-indigo-500/10',
    iconName: 'Activity',
  },
  {
    id: 3,
    name: '글리코겐 소진 & 소화기 휴식',
    shortDesc: '간 글리코겐 고갈 및 소화기 완전 휴식',
    longDesc: '간에 저장되어 있던 포도당(글리코겐)이 대부분 소진됩니다. 소화기관이 완전한 휴식기에 들어가며 염증 반응이 감소하기 시작합니다.',
    startHour: 8,
    endHour: 12,
    color: '#8b5cf6', // purple
    bgGradient: 'from-purple-500/20 to-violet-500/10',
    iconName: 'Moon',
  },
  {
    id: 4,
    name: '지방 연소 (케토시스 진입)',
    shortDesc: '체지방을 직접 연료로 분해 가속화',
    longDesc: '글리코겐이 바닥나 체내 축적된 지방세포를 분해하여 케톤체를 생성합니다. 본격적으로 체지방이 태워지는 핵심 감량 구간입니다.',
    startHour: 12,
    endHour: 16,
    color: '#ec4899', // pink
    bgGradient: 'from-pink-500/20 to-rose-500/10',
    iconName: 'Zap',
  },
  {
    id: 5,
    name: '자가포식 (오토파지 활성화)',
    shortDesc: '세포 재생, 노폐물 제거 및 안티에이징',
    longDesc: '오토파지(Autophagy)가 극대화되어 손상된 세포 소기관과 노폐 단백질을 자체 청소하고 면역력을 높이며 세포 재생을 촉진합니다.',
    startHour: 16,
    endHour: 999,
    color: '#10b981', // emerald
    bgGradient: 'from-emerald-500/20 to-teal-500/10',
    iconName: 'Sparkles',
  },
];

export function getMetabolicStage(elapsedHours: number): MetabolicStage {
  if (elapsedHours < 2) return METABOLIC_STAGES[0];
  if (elapsedHours < 8) return METABOLIC_STAGES[1];
  if (elapsedHours < 12) return METABOLIC_STAGES[2];
  if (elapsedHours < 16) return METABOLIC_STAGES[3];
  return METABOLIC_STAGES[4];
}
