
import React from 'react';
import { Appointment, CalendarView, DraggableAppointment, Staff, Service } from '../../types';
import { useTheme } from './theme/ThemeContext';
import { 
  getMonthGridDays, 
  getWeekDates, 
  getTimeSlots, 
  isSameDay, 
  formatTime,
  weekDayNames,
  formatDate
} from './hooks/useCalendarUtils';
import AppointmentCard from './AppointmentCard';
import { HOUR_HEIGHT_PX } from '../../constants';
import { useTranslation } from 'react-i18next';

interface CalendarGridProps {
  currentDate: Date;
  view: CalendarView;
  appointments: Appointment[];
  onAppointmentClick: (appointment: Appointment) => void;
  onSlotClick: (date: Date, staffId?: string) => void; 
  onAppointmentDrop: (appointmentId: string, newStart: Date, newEnd: Date, staffId?: string) => void;
  staffList: Staff[]; 
  serviceList: Service[]; 
  isMobile: boolean;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({
  currentDate,
  view,
  appointments,
  onAppointmentClick,
  onSlotClick,
  onAppointmentDrop,
  staffList,
  serviceList,
  isMobile
}) => {
  const { theme, mode } = useTheme();
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  const weekStartsOn: 0 | 1 = currentLang === 'tr' ? 1 : 1; // Monday for TR, (could be 0 for Sunday for US English if needed)

  const [_draggedAppointment, setDraggedAppointment] = React.useState<DraggableAppointment | null>(null); // Renamed to avoid conflict

  const handleDragStartInternal = (e: React.DragEvent<HTMLDivElement>, appointmentId: string, start: Date, end: Date) => {
    const draggableData: DraggableAppointment = { id: appointmentId, originalStart: start.toISOString(), originalEnd: end.toISOString() };
    e.dataTransfer.setData('application/json', JSON.stringify(draggableData));
    e.dataTransfer.effectAllowed = "move";
    setDraggedAppointment(draggableData);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); 
    e.dataTransfer.dropEffect = "move";
  };

  const handleDropOnSlot = (e: React.DragEvent<HTMLDivElement>, slotDate: Date, staffId?: string) => {
    e.preventDefault();
    const appointmentDataString = e.dataTransfer.getData('application/json');
    if (!appointmentDataString) return;

    try {
      const droppedApptData = JSON.parse(appointmentDataString) as DraggableAppointment;
      const originalDuration = new Date(droppedApptData.originalEnd).getTime() - new Date(droppedApptData.originalStart).getTime();
      
      const newStart = new Date(slotDate); 
      const newEnd = new Date(newStart.getTime() + originalDuration);

      onAppointmentDrop(droppedApptData.id, newStart, newEnd, staffId);
      setDraggedAppointment(null);
    } catch (error) {
      console.error("Error parsing dropped appointment data:", error);
      setDraggedAppointment(null);
    }
  };

  const renderMonthView = () => {
    const days = getMonthGridDays(currentDate.getFullYear(), currentDate.getMonth(), weekStartsOn);
    const today = new Date();
    const dayNames = weekDayNames(currentLang, 'short', weekStartsOn);

    return (
      <div className={`grid grid-cols-7 border-t border-l border-${theme.colors.border}`} data-testid="month-view-grid">
        {dayNames.map(name => (
          <div key={name} className={`p-2 text-center font-medium text-xs text-${theme.colors.textSecondary} border-r border-b border-${theme.colors.border} bg-${theme.colors.surface} sticky top-0 z-10`}>
            {name.toUpperCase()}
          </div>
        ))}
        {days.map((day, index) => {
          const isCurrentMonth = day ? day.getMonth() === currentDate.getMonth() : false;
          const isToday = day ? isSameDay(day, today) : false;
          const appointmentsOnDay = day ? appointments.filter(appt => isSameDay(appt.start, day)) : [];
          
          return (
            <div
              key={index}
              className={`min-h-[100px] md:min-h-[120px] p-1 md:p-1.5 border-r border-b border-${theme.colors.border} transition-colors duration-150 ease-in-out
                         ${isCurrentMonth ? `bg-${theme.colors.surface} hover:bg-slate-100 dark:hover:bg-slate-700` : `bg-slate-50 dark:bg-slate-800 opacity-60 hover:bg-slate-100 dark:hover:bg-slate-700`}
                         ${isToday ? '!bg-indigo-50 dark:!bg-indigo-900/30' : ''} group`}
              onClick={() => day && onSlotClick(day)}
              onDragOver={handleDragOver}
              onDrop={(e) => day && handleDropOnSlot(e, day)} 
              data-testid={`month-cell-${day ? day.toISOString().split('T')[0] : index}`}
              role="gridcell"
              aria-label={day ? formatDate(day, currentLang, { weekday: 'long', month: 'long', day: 'numeric' }) : 'empty cell'}
            >
              <div className={`flex justify-end text-xs font-medium ${isToday ? `text-${theme.colors.primary} font-bold` : `text-${theme.colors.textSecondary} group-hover:text-${theme.colors.textPrimary}`}`}>
                {day?.getDate()}
              </div>
              <div className="mt-1 space-y-0.5 md:space-y-1 max-h-[70px] md:max-h-[80px] overflow-y-auto styled-scrollbar-thin">
                {appointmentsOnDay.slice(0,2).map(appt => ( 
                  <AppointmentCard key={appt.id} appointment={appt} onClick={() => onAppointmentClick(appt)} view="month" isDraggable onDragStart={handleDragStartInternal}/>
                ))}
                {appointmentsOnDay.length > 2 && (
                    <div className={`text-xs text-center text-${theme.colors.textSecondary} mt-1 p-0.5 bg-slate-100 dark:bg-slate-700 rounded`}>{t('calendar.grid.more', {count: appointmentsOnDay.length - 2})}</div>
                )}
              </div>
            </div>
          );
        })}
         <style>{`
        .styled-scrollbar-thin::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        .styled-scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .styled-scrollbar-thin::-webkit-scrollbar-thumb {
          background: ${mode === 'light' ? '#cbd5e1' : '#475569'}; 
          border-radius: ${theme.borderRadius.small};
        }
        .styled-scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: ${mode === 'light' ? '#94a3b8' : '#64748b'};
        }
      `}</style>
      </div>
    );
  };

  const renderWeekDayView = (days: Date[], viewType: 'week' | 'day') => {
    const timeSlots = getTimeSlots(0, 24, 60); 
    const today = new Date();
    const dayHeaders = viewType === 'week' 
      ? days.map(d => formatDate(d, currentLang, { weekday: 'short', day: 'numeric' })) 
      : [formatDate(days[0], currentLang, { weekday: 'long' })];


    return (
      <div className={`flex border-t border-${theme.colors.border} bg-${theme.colors.surface}`} data-testid={`${viewType}-view-grid`}>
        <div className={`w-12 md:w-16 border-r border-${theme.colors.border} sticky left-0 bg-${theme.colors.surface} z-20 flex-shrink-0`}>
          <div className={`h-10 md:h-12 border-b border-${theme.colors.border}`}></div> {/* Spacer for day names */}
          {timeSlots.map(slot => (
            <div key={slot} className={`h-[${HOUR_HEIGHT_PX}px] text-[10px] md:text-xs text-right pr-1 md:pr-1.5 pt-0.5 text-${theme.colors.textSecondary} border-b border-dashed border-${theme.colors.border} border-opacity-50 relative`}>
              <span className="relative -top-1.5 md:-top-2">{slot}</span>
            </div>
          ))}
        </div>

        <div className="flex-grow grid" style={{ gridTemplateColumns: `repeat(${days.length}, minmax(0, 1fr))`}}>
          {days.map((day, dayIndex) => {
            const appointmentsOnDay = appointments.filter(appt => isSameDay(appt.start, day));
            const isToday = isSameDay(day, today);
            return (
              <div key={day.toISOString()} className={`relative border-r border-${theme.colors.border} ${isToday ? `bg-indigo-50 dark:bg-indigo-900/30` : `bg-${theme.colors.surface}`}`}>
                <div className={`h-10 md:h-12 p-1 md:p-2 text-center font-semibold text-xs md:text-sm border-b border-${theme.colors.border} sticky top-0 bg-${theme.colors.surface} z-10 
                                ${isToday ? `text-${theme.colors.primary}` : `text-${theme.colors.textPrimary}`}`}>
                  {dayHeaders[dayIndex]}
                </div>
                <div className="relative">
                  {timeSlots.map((_ts, slotIndex) => {
                    const slotStartDateTime = new Date(day);
                    slotStartDateTime.setHours(slotIndex, 0, 0, 0); 

                    return (
                        <div
                            key={slotIndex}
                            className={`h-[${HOUR_HEIGHT_PX}px] border-b border-dashed border-${theme.colors.border} border-opacity-50 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors group`}
                            onClick={() => onSlotClick(slotStartDateTime)}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDropOnSlot(e, slotStartDateTime)}
                            data-testid={`${viewType}-slot-${day.toISOString().split('T')[0]}-${slotIndex}`}
                            role="button"
                            aria-label={t('calendar.grid.createAppointmentAt', { date: formatDate(day, currentLang), time: `${slotIndex.toString().padStart(2, '0')}:00` })}
                        >
                          {[15, 30, 45].map(min => (
                            <div key={min} className={`h-px bg-${theme.colors.border} bg-opacity-20 group-hover:bg-opacity-40`} style={{marginTop: `${(min/60)*HOUR_HEIGHT_PX -1}px`}}></div>
                          ))}
                        </div>
                    );
                  })}
                  {appointmentsOnDay.map(appt => (
                    <AppointmentCard
                      key={appt.id}
                      appointment={appt}
                      onClick={() => onAppointmentClick(appt)}
                      view={viewType}
                      isDraggable
                      onDragStart={handleDragStartInternal}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };


  const renderAgendaView = () => {
    const groupedAppointments: { [key: string]: Appointment[] } = {};
    const sortedAppointments = [...appointments].sort((a, b) => a.start.getTime() - b.start.getTime());

    sortedAppointments.forEach(appt => {
      const dateKey = appt.start.toDateString();
      if (!groupedAppointments[dateKey]) {
        groupedAppointments[dateKey] = [];
      }
      groupedAppointments[dateKey].push(appt);
    });

    return (
      <div className={`p-3 md:p-6 space-y-4 md:space-y-6 bg-${theme.colors.background}`} data-testid="agenda-view-list">
        {Object.keys(groupedAppointments).length === 0 && (
          <div className={`text-center text-${theme.colors.textSecondary} py-10 md:py-12`}>
            <svg className="mx-auto h-10 w-10 md:h-12 md:w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            <h3 className={`mt-2 text-base md:text-lg font-medium text-${theme.colors.textPrimary}`}>{t('calendar.noAppointments')}</h3>
            <p className={`mt-1 text-sm text-${theme.colors.textSecondary}`}>{t('calendar.noAppointmentsPeriod')}</p>
          </div>
        )}
        {Object.keys(groupedAppointments).map(dateKey => (
          <div key={dateKey}>
            <h3 className={`text-base md:text-lg font-semibold text-${theme.colors.textPrimary} mb-2 md:mb-3 pb-2 border-b border-${theme.colors.border}`}>
              {formatDate(new Date(dateKey), currentLang, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </h3>
            <div className="space-y-2 md:space-y-2.5">
            {groupedAppointments[dateKey].map(appt => (
              <AppointmentCard
                key={appt.id}
                appointment={appt}
                onClick={() => onAppointmentClick(appt)}
                view="agenda"
              />
            ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (isMobile && view !== 'day') {
     // Parent (AdvancedCalendar) should enforce view to 'day' on mobile.
  }

  switch (view) {
    case 'month':
      return renderMonthView();
    case 'week':
      return renderWeekDayView(getWeekDates(currentDate, weekStartsOn), 'week');
    case 'day':
      return renderWeekDayView([currentDate], 'day');
    case 'agenda':
      return renderAgendaView();
    default:
      return <div className={`text-${theme.colors.textPrimary} p-5`}>{t('calendar.view.day')} {/* Fallback or error message */}</div>;
  }
};

export default CalendarGrid;