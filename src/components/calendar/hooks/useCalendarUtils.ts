
import { CalendarView } from '@/types';

// Date Formatting
export const formatDate = (date: Date, locale: string = navigator.language, options?: Intl.DateTimeFormatOptions): string => {
  try {
    return date.toLocaleDateString(locale, options);
  } catch (e) {
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

export const getMonthGridDays = (year: number, month: number, weekStartDay: 0 | 1 = 1): (Date | null)[] => {
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const days: (Date | null)[] = [];
  let dayOfWeekForFirst = firstDayOfMonth.getDay();
  let prevMonthDaysToShow = (dayOfWeekForFirst - weekStartDay + 7) % 7;

  for (let i = 0; i < prevMonthDaysToShow; i++) {
    const prevMonthDay = new Date(firstDayOfMonth);
    prevMonthDay.setDate(firstDayOfMonth.getDate() - (prevMonthDaysToShow - i));
    days.push(prevMonthDay);
  }

  const currentMonthDays = getDaysInMonth(year, month);
  days.push(...currentMonthDays);

  const totalCells = days.length <= 35 ? 35 : 42;
  let nextMonthDaysToShow = totalCells - days.length;
  if (nextMonthDaysToShow < 0) nextMonthDaysToShow = (7 - (Math.abs(nextMonthDaysToShow) % 7)) % 7;

  for (let i = 1; i <= nextMonthDaysToShow; i++) {
    const nextMonthDay = new Date(lastDayOfMonth);
    nextMonthDay.setDate(lastDayOfMonth.getDate() + i);
    days.push(nextMonthDay);
  }

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

export const getWeekDates = (currentDate: Date, weekStartDay: 0 | 1 = 1): Date[] => {
  const week: Date[] = [];
  const firstDayOfWeek = new Date(currentDate);
  const dayOfWeek = firstDayOfWeek.getDay();
  let diff = dayOfWeek - weekStartDay;
  if (diff < 0) {
    diff += 7;
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

export const getDayViewTitle = (date: Date, locale: string = navigator.language): string => {
  return formatDate(date, locale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
};

export const getWeekViewTitle = (startDate: Date, endDate: Date, locale: string = navigator.language): string => {
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

export const getMonthViewTitle = (date: Date, locale: string = navigator.language): string => {
  return formatDate(date, locale, { month: 'long', year: 'numeric' });
};

export const getAgendaViewTitle = (date: Date, locale: string = navigator.language): string => {
  return formatDate(date, locale, { month: 'long', year: 'numeric' });
};

// getTitleForView uses navigator.language or a provided locale.
export const getTitleForView = (currentDate: Date, view: CalendarView, locale: string = navigator.language): string => {
  switch (view) {
    case 'day':
      return getDayViewTitle(currentDate, locale);
    case 'week':
      const weekDates = getWeekDates(currentDate, 1);
      return getWeekViewTitle(weekDates[0], weekDates[6], locale);
    case 'month':
      return getMonthViewTitle(currentDate, locale);
    case 'agenda':
      return `Agenda - ${getAgendaViewTitle(currentDate, locale)}`; // Hardcoded "Agenda"
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

export const weekDayNames = (locale: string = navigator.language, format: 'long' | 'short' | 'narrow' = 'short', startOfWeek: 0 | 1 = 1): string[] => {
  const formatter = new Intl.DateTimeFormat(locale, { weekday: format });
  const days: string[] = [];
  const refSunday = new Date(2021, 0, 3);

  for (let i = 0; i < 7; i++) {
    const dayIndex = (i + startOfWeek) % 7;
    const dateForDay = new Date(refSunday);
    dateForDay.setDate(refSunday.getDate() + dayIndex);
    days.push(formatter.format(dateForDay));
  }
  return days;
};
