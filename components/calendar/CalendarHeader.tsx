
import React from 'react';
import { CalendarView, Staff, Service } from '../../types';
// CALENDAR_VIEWS constant is removed, labels are generated via t()
import Button from './common/Button';
import StaffFilter from './StaffFilter';
import ServiceFilter from './ServiceFilter';
import { useTheme } from './theme/ThemeContext';
import { useTranslation } from 'react-i18next';

interface CalendarHeaderProps {
  currentDate: Date;
  view: CalendarView;
  title: string; // Passed already translated
  onViewChange: (view: CalendarView) => void;
  onNavigate: (action: 'prev' | 'next' | 'today') => void;
  onDateChange: (date: Date) => void;
  onAddAppointment: () => void;
  staffList: Staff[];
  serviceList: Service[];
  selectedStaffId: string | null;
  onStaffChange: (staffId: string | null) => void;
  selectedServiceId: string | null;
  onServiceChange: (serviceId: string | null) => void;
  isMobile: boolean;
}

const ChevronLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
  </svg>
);
const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
  </svg>
);
const PlusIcon = () => (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);


const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  view,
  title,
  onViewChange,
  onNavigate,
  onDateChange,
  onAddAppointment,
  staffList,
  serviceList,
  selectedStaffId,
  onStaffChange,
  selectedServiceId,
  onServiceChange,
  isMobile,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const calendarViewOptions: {id: CalendarView, labelKey: string}[] = [
    { id: 'day', labelKey: 'calendar.view.day' },
    { id: 'week', labelKey: 'calendar.view.week' },
    { id: 'month', labelKey: 'calendar.view.month' },
    { id: 'agenda', labelKey: 'calendar.view.agenda' },
  ];


  const handleDateInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(event.target.value);
    // Adjust for timezone offset if the date picker returns local midnight
    // This ensures that selecting a date uses the intended day, not potentially previous/next due to UTC conversion
    const userTimezoneOffset = newDate.getTimezoneOffset() * 60000;
    onDateChange(new Date(newDate.getTime() + userTimezoneOffset));
  };

  return (
    <div className={`p-3 md:p-4 bg-${theme.colors.surface} border-b border-${theme.colors.border} text-${theme.colors.textPrimary} ${theme.shadows.small}`} data-testid="calendar-header">
      <div className="flex flex-col md:flex-row items-center justify-between mb-3 md:mb-4">
        <div className="flex items-center space-x-1 md:space-x-2 mb-3 md:mb-0">
          <Button variant="secondary" size="sm" onClick={() => onNavigate('prev')} aria-label={t('calendar.navigation.prevPeriod')} data-testid="nav-prev-button"><ChevronLeftIcon/></Button>
          <Button variant="secondary" size="sm" onClick={() => onNavigate('next')} aria-label={t('calendar.navigation.nextPeriod')} data-testid="nav-next-button"><ChevronRightIcon/></Button>
          <Button variant="secondary" size="sm" onClick={() => onNavigate('today')} data-testid="nav-today-button">{t('calendar.today')}</Button>
          <input 
            type="date"
            value={currentDate.toISOString().split('T')[0]}
            onChange={handleDateInputChange}
            className={`ml-1 md:ml-2 px-2 py-1 md:px-3 md:py-[7px] text-xs md:text-sm border border-${theme.colors.border} ${theme.borderRadius.medium} bg-${theme.colors.surface} text-${theme.colors.textPrimary} 
                        focus:ring-2 focus:ring-${theme.colors.primary} focus:border-${theme.colors.primary} outline-none transition-colors`}
            aria-label={t('calendar.navigation.selectDate')}
            data-testid="date-picker-input"
           />
        </div>
        <h2 className={`text-lg md:text-2xl font-bold text-center md:text-left flex-grow md:mx-4 my-2 md:my-0 text-${theme.colors.textPrimary} truncate`} data-testid="calendar-title">{title}</h2>
        <Button variant="primary" size={isMobile ? "sm" : "md"} onClick={onAddAppointment} leftIcon={<PlusIcon />} data-testid="add-appointment-button" className="w-full md:w-auto mt-2 md:mt-0">
          {t('calendar.newEvent')}
        </Button>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-2">
        <div className="flex space-x-1 bg-slate-200 dark:bg-slate-700 p-1 rounded-lg w-full md:w-auto overflow-x-auto" role="group" aria-label={t('calendar.title')} data-testid="view-switcher">
          {calendarViewOptions.map(v => {
            if (isMobile && v.id !== 'day') return null; // Only show Day view on mobile (or current view if it's day)
            if (isMobile && view !== 'day' && v.id === 'day') { /* ensure day view is primary on mobile */ }


            return (
              <Button
                key={v.id}
                variant={view === v.id ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => onViewChange(v.id as CalendarView)}
                data-testid={`view-button-${v.id}`}
                className={`${view === v.id ? `shadow-md` : `text-${theme.colors.textSecondary} hover:text-${theme.colors.textPrimary}` } px-3 py-1.5 flex-1 md:flex-initial`}
              >
                {t(v.labelKey)}
              </Button>
            );
          })}
        </div>
        {!isMobile && (
          <div className="flex items-center space-x-2">
            <StaffFilter staffList={staffList} selectedStaffId={selectedStaffId} onStaffChange={onStaffChange} />
            <ServiceFilter serviceList={serviceList} selectedServiceId={selectedServiceId} onServiceChange={onServiceChange} />
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarHeader;