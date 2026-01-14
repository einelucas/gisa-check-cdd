export type DayType = 'weekday' | 'saturday' | 'sunday';

export type BenefitType = 'none' | 'snack' | 'meal' | 'integral';

export type LocalityType = 'capital' | 'interior' | 'corumba' | 'bonito';

export interface ShiftType {
  label: string;
  startTime: string;
  endTime: string;
  crossesMidnight: boolean;
}

export const SHIFTS: ShiftType[] = [
  { label: '05:00 – 14:00', startTime: '05:00', endTime: '14:00', crossesMidnight: false },
  { label: '07:30 – 17:30', startTime: '07:30', endTime: '17:30', crossesMidnight: false },
  { label: '08:00 – 17:00', startTime: '08:00', endTime: '17:00', crossesMidnight: false },
  { label: '13:00 – 22:00', startTime: '13:00', endTime: '22:00', crossesMidnight: false },
  { label: '14:00 – 23:00', startTime: '14:00', endTime: '23:00', crossesMidnight: false },
  { label: '20:00 – 05:00', startTime: '20:00', endTime: '05:00', crossesMidnight: true },
];

export interface LocalityOption {
  value: LocalityType;
  label: string;
}

export const LOCALITIES: LocalityOption[] = [
  { value: 'capital', label: 'Capital / Nacional' },
  { value: 'interior', label: 'Interior / Estadual' },
  { value: 'corumba', label: 'Corumbá / Ladário' },
  { value: 'bonito', label: 'Bonito' },
];

// Tabela de valores 2026 (vigente a partir de 06/01/2026)
export const BENEFIT_VALUES_2026 = {
  // Dias úteis / Feriado (TRA) - Integral
  tra_integral: {
    capital: 106.32,
    interior: 69.78,
    corumba: 81.08,
    bonito: 75.30,
  },
  // Almoço ou Jantar (TRA) - Refeição
  tra_meal: {
    capital: 53.16,
    interior: 34.89,
    corumba: 40.54,
    bonito: 37.65,
  },
  // DSR - Integral
  dsr_integral: {
    capital: 149.74,
    interior: 113.20,
    corumba: 124.48,
    bonito: 118.74,
  },
  // Almoço + Jantar (DSR) - Refeição
  dsr_meal: {
    capital: 74.87,
    interior: 56.60,
    corumba: 62.24,
    bonito: 59.37,
  },
  // Lanche - valor fixo
  snack: 34.89,
};

export interface CalculationResult {
  benefit: BenefitType;
  totalHours: number;
  hoursAfterShift: number;
  dayType: DayType;
  dayTypeLabel: string;
  justification: string;
  requiresApproval: boolean;
  hadDisplacement: boolean;
  shiftLabel: string;
  locality: LocalityType;
  benefitValue: number;
}

function getDayType(date: Date): DayType {
  const day = date.getDay();
  if (day === 0) return 'sunday';
  if (day === 6) return 'saturday';
  return 'weekday';
}

function getDayTypeLabel(dayType: DayType): string {
  switch (dayType) {
    case 'sunday': return 'Domingo (DSR)';
    case 'saturday': return 'Sábado (6º dia)';
    case 'weekday': return 'Dia Normal (Seg-Sex)';
  }
}

function calculateHoursDiff(
  startDate: Date,
  startTime: string,
  endDate: Date,
  endTime: string
): number {
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);

  const start = new Date(startDate);
  start.setHours(startHour, startMin, 0, 0);

  const end = new Date(endDate);
  end.setHours(endHour, endMin, 0, 0);

  const diffMs = end.getTime() - start.getTime();
  return diffMs / (1000 * 60 * 60);
}

function calculateHoursAfterShift(
  startDate: Date,
  endDate: Date,
  endTime: string,
  shift: ShiftType
): number {
  const [endHour, endMin] = endTime.split(':').map(Number);
  const [shiftEndHour, shiftEndMin] = shift.endTime.split(':').map(Number);

  // Calculate shift end date/time
  const shiftEnd = new Date(startDate);
  if (shift.crossesMidnight) {
    // Shift ends next day
    shiftEnd.setDate(shiftEnd.getDate() + 1);
  }
  shiftEnd.setHours(shiftEndHour, shiftEndMin, 0, 0);

  const actualEnd = new Date(endDate);
  actualEnd.setHours(endHour, endMin, 0, 0);

  if (actualEnd <= shiftEnd) return 0;

  const diffMs = actualEnd.getTime() - shiftEnd.getTime();
  return diffMs / (1000 * 60 * 60);
}

function checkReturnAfter19(
  startDate: Date,
  endDate: Date,
  endTime: string
): boolean {
  const [endHour, endMin] = endTime.split(':').map(Number);
  
  const threshold19 = new Date(startDate);
  threshold19.setHours(19, 0, 0, 0);
  
  const actualEnd = new Date(endDate);
  actualEnd.setHours(endHour, endMin, 0, 0);
  
  return actualEnd >= threshold19;
}

export function getBenefitValue(
  benefit: BenefitType,
  dayType: DayType,
  locality: LocalityType
): number {
  if (benefit === 'none') return 0;
  if (benefit === 'snack') return BENEFIT_VALUES_2026.snack;

  const isDSR = dayType === 'sunday';

  if (benefit === 'integral') {
    return isDSR
      ? BENEFIT_VALUES_2026.dsr_integral[locality]
      : BENEFIT_VALUES_2026.tra_integral[locality];
  }

  if (benefit === 'meal') {
    return isDSR
      ? BENEFIT_VALUES_2026.dsr_meal[locality]
      : BENEFIT_VALUES_2026.tra_meal[locality];
  }

  return 0;
}

export function calculateMealBenefit(
  startDate: Date,
  startTime: string,
  endDate: Date,
  endTime: string,
  shift: ShiftType,
  locality: LocalityType,
  hadDisplacement: boolean = false,
  hasServiceOrder: boolean = true
): CalculationResult {
  const dayType = getDayType(startDate);
  const dayTypeLabel = getDayTypeLabel(dayType);
  const totalHours = calculateHoursDiff(startDate, startTime, endDate, endTime);
  const hoursAfterShift = calculateHoursAfterShift(startDate, endDate, endTime, shift);
  const returnedAfter19 = checkReturnAfter19(startDate, endDate, endTime);

  let benefit: BenefitType = 'none';
  let justification = '';
  let requiresApproval = false;

  if (dayType === 'sunday') {
    // Sunday (DSR): integral meal only if there's a service order (OS)
    if (totalHours > 0 && hasServiceOrder) {
      benefit = 'integral';
      justification = 'Trabalho em domingo (DSR) com OS atendida concede refeição integral.';
    } else if (totalHours > 0) {
      justification = 'Trabalho em domingo (DSR) sem OS atendida não concede benefício.';
    } else {
      justification = 'Nenhum trabalho registrado.';
    }
  } else if (dayType === 'saturday') {
    // Saturday (6º dia): based on total hours worked
    if (totalHours >= 8) {
      benefit = 'integral';
      justification = `Trabalhou ${totalHours.toFixed(1)}h no sábado (≥8h = Refeição Integral).`;
    } else if (totalHours >= 4) {
      benefit = 'meal';
      justification = `Trabalhou ${totalHours.toFixed(1)}h no sábado (≥4h e <8h = Refeição).`;
    } else if (totalHours > 0) {
      justification = `Trabalhou ${totalHours.toFixed(1)}h no sábado (<4h = Sem benefício).`;
    } else {
      justification = 'Nenhum trabalho registrado.';
    }
  } else {
    // Weekday: depends on displacement checkbox
    if (hadDisplacement) {
      // WITH displacement: check if returned after 19:00 with ≥2h additional
      if (hoursAfterShift > 0 && returnedAfter19 && hoursAfterShift >= 2) {
        benefit = 'meal';
        justification = `Deslocamento após jornada com retorno após 19h e ${hoursAfterShift.toFixed(1)}h adicionais (≥2h = Jantar).`;
      } else if (hoursAfterShift > 0) {
        justification = `Deslocamento registrado, mas não atende aos critérios (retorno após 19h com ≥2h adicionais).`;
      } else {
        justification = 'Nenhum trabalho após o fim da jornada.';
      }
    } else {
      // WITHOUT displacement: based on hours after shift end (17:00)
      if (hoursAfterShift >= 4) {
        benefit = 'meal';
        justification = `Trabalhou ${hoursAfterShift.toFixed(1)}h após o fim da jornada (≥4h = Jantar).`;
      } else if (hoursAfterShift >= 2) {
        benefit = 'snack';
        justification = `Trabalhou ${hoursAfterShift.toFixed(1)}h após o fim da jornada (≥2h e <4h = Lanche).`;
        requiresApproval = true;
      } else if (totalHours > 0) {
        justification = `Trabalhou ${hoursAfterShift.toFixed(1)}h após o fim da jornada (<2h = Sem benefício).`;
      } else {
        justification = 'Nenhum trabalho registrado.';
      }
    }
  }

  const benefitValue = getBenefitValue(benefit, dayType, locality);

  return {
    benefit,
    totalHours: Math.max(0, totalHours),
    hoursAfterShift: Math.max(0, hoursAfterShift),
    dayType,
    dayTypeLabel,
    justification,
    requiresApproval,
    hadDisplacement,
    shiftLabel: shift.label,
    locality,
    benefitValue,
  };
}

export function getBenefitLabel(benefit: BenefitType): string {
  switch (benefit) {
    case 'integral': return 'Refeição Integral';
    case 'meal': return 'Refeição';
    case 'snack': return 'Lanche';
    case 'none': return 'Nenhum Benefício';
  }
}

export function getLocalityLabel(locality: LocalityType): string {
  const found = LOCALITIES.find(l => l.value === locality);
  return found?.label || locality;
}
