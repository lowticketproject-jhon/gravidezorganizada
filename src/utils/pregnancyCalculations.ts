import { addDays, differenceInDays, differenceInWeeks, parseISO, format } from 'date-fns';

export const calculatePregnancyData = (
  startDate?: string, // DUM
  conceptionDate?: string,
  dueDate?: string,
  manualWeeks?: number
) => {
  let calculatedDueDate: Date;
  let currentWeeks: number = 0;
  let currentDays: number = 0;

  const today = new Date();

  if (dueDate) {
    calculatedDueDate = parseISO(dueDate);
    const totalDays = 280; // 40 weeks
    const daysRemaining = differenceInDays(calculatedDueDate, today);
    const daysPassed = totalDays - daysRemaining;
    currentWeeks = Math.floor(daysPassed / 7);
    currentDays = daysPassed % 7;
  } else if (startDate) {
    const dum = parseISO(startDate);
    calculatedDueDate = addDays(dum, 280);
    const daysPassed = differenceInDays(today, dum);
    currentWeeks = Math.floor(daysPassed / 7);
    currentDays = daysPassed % 7;
  } else if (conceptionDate) {
    const conception = parseISO(conceptionDate);
    calculatedDueDate = addDays(conception, 266); // 38 weeks from conception
    const daysPassed = differenceInDays(today, conception) + 14; // Add 2 weeks to match gestational age
    currentWeeks = Math.floor(daysPassed / 7);
    currentDays = daysPassed % 7;
  } else if (manualWeeks !== undefined) {
    currentWeeks = manualWeeks;
    const daysPassed = manualWeeks * 7;
    const totalDays = 280;
    const daysRemaining = totalDays - daysPassed;
    calculatedDueDate = addDays(today, daysRemaining);
  } else {
    // Fallback
    calculatedDueDate = addDays(today, 280);
  }

  // Clamp weeks between 0 and 42
  currentWeeks = Math.max(0, Math.min(42, currentWeeks));

  const daysRemaining = differenceInDays(calculatedDueDate, today);
  const trimester = currentWeeks <= 13 ? 1 : currentWeeks <= 26 ? 2 : 3;
  const month = Math.floor(currentWeeks / 4) + 1;

  return {
    dueDate: calculatedDueDate,
    currentWeeks,
    currentDays,
    daysRemaining: Math.max(0, daysRemaining),
    trimester,
    month: Math.min(9, month),
    formattedDueDate: format(calculatedDueDate, 'dd/MM/yyyy'),
  };
};
