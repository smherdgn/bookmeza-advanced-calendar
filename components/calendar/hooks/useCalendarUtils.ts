
import { CalendarView } from '../../../types';

// Date Formatting (could use date-fns for more robust formatting and i18n)
export const formatDate = (date: Date, locale: string = navigator.language, options?: Intl.DateTimeFormatOptions): string => {
  try {
    return date.toLocaleDateString(locale, options);
  } catch (e) {
    // Fallback if locale is not supported, though rare for modern browsers
    return date.toLocaleDateString(undefined, options);
  }
};

export const formatTime = (date: Date, locale: string = navigator.language, options?: Intl.DateTimeFormatOptions): string => {
   try {
    return date.toLocaleTimeString(locale, options || { hour: '2-digit', minute: '2-digit', hour12: false });
  } catch (e) {
    return date.toLocaleTimeString(undefined, options || { hour: '2-digit', minute: '2-digit', hour12: false });
  }
};

export const getDaysInMonth = (year: number, month: number): Date[] => {
  const date = new Date(year, month, 1);
  const days: Date[] = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
};

// Defaulting to Monday as the start of the week (0 = Monday, 6 = Sunday)
// Intl.Locale firstDayOfWeek might be an option for more advanced locale-specific starts, but it's experimental.
// For now, we assume Monday start for consistency in grid generation.
export const getMonthGridDays = (year: number, month: number, weekStartDay: 0 | 1 = 1): (Date | null)[] => { // 0 for Sunday, 1 for Monday
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  
  const days: (Date | null)[] = [];
  
  let dayOfWeekForFirst = firstDayOfMonth.getDay(); // 0 (Sun) to 6 (Sat)
  
  // Adjust startDayOfWeek based on weekStartDay (0 for Sun, 1 for Mon)
  // We want to find how many days from the previous month to show.
  // If week starts on Monday (weekStartDay=1):
  //   If firstDayOfMonth is Sunday (0), we need 6 previous days. (0 - 1 + 7) % 7 = 6
  //   If firstDayOfMonth is Monday (1), we need 0 previous days. (1 - 1 + 7) % 7 = 0
  //   If firstDayOfMonth is Tuesday (2), we need 1 previous day. (2 - 1 + 7) % 7 = 1
  // If week starts on Sunday (weekStartDay=0):
  //   If firstDayOfMonth is Sunday (0), we need 0 previous days. (0 - 0 + 7) % 7 = 0
  //   If firstDayOfMonth is Monday (1), we need 1 previous day. (1 - 0 + 7) % 7 = 1
  let prevMonthDaysToShow = (dayOfWeekForFirst - weekStartDay + 7) % 7;

  for (let i = 0; i < prevMonthDaysToShow; i++) {
    const prevMonthDay = new Date(firstDayOfMonth);
    prevMonthDay.setDate(firstDayOfMonth.getDate() - (prevMonthDaysToShow - i));
    days.push(prevMonthDay);
  }

  const currentMonthDays = getDaysInMonth(year, month);
  days.push(...currentMonthDays);

  const totalCells = days.length <= 35 ? 35 : 42; // Ensure 5 or 6 weeks (35 or 42 cells)
  
  let nextMonthDaysToShow = totalCells - days.length;
  if (nextMonthDaysToShow < 0) nextMonthDaysToShow = (7 - (Math.abs(nextMonthDaysToShow) % 7)) %7; // if over, fill to next week multiple


  for (let i = 1; i <= nextMonthDaysToShow; i++) {
    const nextMonthDay = new Date(lastDayOfMonth);
    nextMonthDay.setDate(lastDayOfMonth.getDate() + i);
    days.push(nextMonthDay);
  }
  
  // Final check to ensure exactly totalCells. This might occur if initial nextMonthDaysToShow logic results in slightly off counts
  // This should ideally be handled more gracefully by the loop bounds.
  while(days.length < totalCells) {
     const lastDayInGrid = days[days.length -1] || new Date(year, month +1, 0);
     const nextDay = new Date(lastDayInGrid);
     nextDay.setDate(lastDayInGrid.getDate() + 1);
     days.push(nextDay);
  }
  if(days.length > totalCells) {
      days.splice(totalCells);
  }

  return days;
};


export const getWeekDates = (currentDate: Date, weekStartDay: 0 | 1 = 1): Date[] => { // 0 for Sunday, 1 for Monday
  const week: Date[] = [];
  const firstDayOfWeek = new Date(currentDate);
  const dayOfWeek = firstDayOfWeek.getDay(); // 0 (Sun) to 6 (Sat)
  
  // Calculate difference to get to the start of the week
  let diff = dayOfWeek - weekStartDay;
  if (diff < 0) {
    diff += 7; // If current day is before weekStartDay (e.g., Sun and week starts Mon)
  }
  
  firstDayOfWeek.setDate(currentDate.getDate() - diff);

  for (let i = 0; i < 7; i++) {
    const day = new Date(firstDayOfWeek);
    day.setDate(firstDayOfWeek.getDate() + i);
    week.push(day);
  }
  return week;
};

export const getTimeSlots = (startTime: number = 0, endTime: number = 24, interval: number = 60): string[] => {
  const slots: string[] = [];
  for (let hour = startTime; hour < endTime; hour++) {
    for (let minute = 0; minute < 60; minute += interval) {
      const h = hour.toString().padStart(2, '0');
      const m = minute.toString().padStart(2, '0');
      slots.push(`${h}:${m}`);
    }
  }
  return slots;
};

export const getDayViewTitle = (date: Date, locale: string): string => {
  return formatDate(date, locale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
};

export const getWeekViewTitle = (startDate: Date, endDate: Date, locale: string): string => {
  const startMonth = formatDate(startDate, locale, { month: 'short' });
  const endMonth = formatDate(endDate, locale, { month: 'short' });
  const startYear = startDate.getFullYear();
  const endYear = endDate.getFullYear();

  if (startYear !== endYear) {
    return `${formatDate(startDate, locale, {month: 'short', day: 'numeric', year: 'numeric'})} - ${formatDate(endDate, locale, {month: 'short', day: 'numeric', year: 'numeric'})}`;
  }
  if (startMonth === endMonth) {
    return `${formatDate(startDate, locale, {day: 'numeric'})} - ${formatDate(endDate, locale, {day: 'numeric', month: 'long', year: 'numeric'})}`;
  }
  return `${formatDate(startDate, locale, {month: 'short', day: 'numeric'})} - ${formatDate(endDate, locale, {month: 'short', day: 'numeric', year: 'numeric'})}`;
};

export const getMonthViewTitle = (date: Date, locale: string): string => {
  return formatDate(date, locale, { month: 'long', year: 'numeric' });
};

export const getAgendaViewTitle = (date: Date, locale: string): string => {
  // Agenda might show a range or a specific period, for now, same as month.
  return formatDate(date, locale, { month: 'long', year: 'numeric' }); // No "Agenda -" prefix, use translation key
};

export const getTitleForView = (currentDate: Date, view: CalendarView, locale: string, t: (key: string, options?: any) => string): string => {
  switch (view) {
    case 'day':
      return getDayViewTitle(currentDate, locale);
    case 'week':
      // Assuming week starts on Monday for title display consistency
      const weekDates = getWeekDates(currentDate, 1); 
      return getWeekViewTitle(weekDates[0], weekDates[6], locale);
    case 'month':
      return getMonthViewTitle(currentDate, locale);
    case 'agenda':
      return `${t('calendar.view.agenda')} - ${getAgendaViewTitle(currentDate, locale)}`;
    default:
      return '';
  }
};

export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const addMonths = (date: Date, months: number): Date => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  // If the day of the month is different (e.g., Jan 31 + 1 month = Feb 28/29),
  // JavaScript handles this by rolling over, which is usually desired.
  // If specific behavior like "last day of month" is needed, it's more complex.
  return result;
};

export const addMinutes = (date: Date, minutes: number): Date => {
    const result = new Date(date.getTime() + minutes * 60000);
    return result;
};

export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

export const isBefore = (date1: Date, date2: Date): boolean => {
    return date1.getTime() < date2.getTime();
}

export const isAfter = (date1: Date, date2: Date): boolean => {
    return date1.getTime() > date2.getTime();
}

// Generates weekday names starting from a specified day (0=Sunday, 1=Monday)
export const weekDayNames = (locale: string = navigator.language, format: 'long' | 'short' | 'narrow' = 'short', startOfWeek: 0 | 1 = 1): string[] => {
  const formatter = new Intl.DateTimeFormat(locale, { weekday: format });
  const days: string[] = [];
  // Reference dates: Jan 3, 2021 was a Sunday. Jan 4, 2021 was a Monday.
  const refSunday = new Date(2021, 0, 3); 

  for (let i = 0; i < 7; i++) {
    // Calculate the day based on startOfWeek.
    // If startOfWeek is Monday (1), we want Monday, Tuesday, ..., Sunday.
    // (0+1)%7 = 1 (Mon), (1+1)%7 = 2 (Tue), ..., (6+1)%7 = 0 (Sun)
    // If startOfWeek is Sunday (0), we want Sunday, Monday, ..., Saturday.
    // (0+0)%7 = 0 (Sun), (1+0)%7 = 1 (Mon), ..., (6+0)%7 = 6 (Sat)
    const dayIndex = (i + startOfWeek) % 7;
    const dateForDay = new Date(refSunday);
    dateForDay.setDate(refSunday.getDate() + dayIndex);
    days.push(formatter.format(dateForDay));
  }
  return days;
};