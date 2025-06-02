
import React from 'react';
import { Appointment, Staff, Service, DraggableAppointment } from '@/types';
import { APPOINTMENT_STATUS_COLORS, MOCK_STAFF, MOCK_SERVICES, APPOINTMENT_STATUS_DISPLAY } from '@/constants';
import { formatTime } from '@/components/calendar/hooks/useCalendarUtils';
import Tooltip from '@/components/calendar/common/Tooltip';
import { useTheme } from '@/components/calendar/theme/ThemeContext';
// import { useTranslation } from 'react-i18next'; // i18n removed

interface AppointmentCardProps {
  appointment: Appointment;
  onClick: () => void;
  view: 'day' | 'week' | 'month' | 'agenda';
  isDraggable?: boolean;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>, appointmentId: string, start: Date, end: Date) => void;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment, onClick, view, isDraggable = false, onDragStart }) => {
  const { theme } = useTheme();
  // const { t, i18n } = useTranslation(); // i18n removed

  const staff = MOCK_STAFF.find(s => s.id === appointment.staffId);
  const service = MOCK_SERVICES.find(s => s.id === appointment.serviceId);
  
  const statusTheme = APPOINTMENT_STATUS_COLORS[appointment.status] || APPOINTMENT_STATUS_COLORS.pending;

  const staffName = staff ? staff.name : '';
  const serviceName = service ? service.name : '';

  const title = appointment.title || serviceName || "New Appointment"; // Fallback title
  const timeText = `${formatTime(appointment.start, navigator.language)} - ${formatTime(appointment.end, navigator.language)}`;
  const statusDisplay = APPOINTMENT_STATUS_DISPLAY[appointment.status];

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    if (onDragStart) {
      onDragStart(e, appointment.id, appointment.start, appointment.end);
      e.dataTransfer.setData('application/json', JSON.stringify({ id: appointment.id, originalStart: appointment.start.toISOString(), originalEnd: appointment.end.toISOString() } as DraggableAppointment));
      e.dataTransfer.effectAllowed = "move";
    }
  };

  const cardBaseClasses = `border-l-4 ${statusTheme.border} ${theme.borderRadius.medium} ${theme.shadows.small} cursor-pointer transition-all duration-150 ease-in-out hover:shadow-lg hover:scale-[1.01]`;

  const cardContent = (
    <div className={`p-1.5 ${statusTheme.bg} overflow-hidden`}>
      <p className={`font-semibold text-xs ${statusTheme.text} truncate`} title={title}>{title}</p>
      <p className={`text-xs ${statusTheme.text} opacity-90`}>{timeText}</p>
      {view !== 'month' && staff && <p className={`text-xs ${statusTheme.text} opacity-70 truncate`} title={staffName}>w/ {staffName}</p>}
    </div>
  );
  
  const tooltipContent = (
    <div className="text-sm text-left w-48">
      <p className="font-bold">{title}</p>
      <hr className="my-1 border-slate-500"/>
      <p>{timeText}</p>
      {staff && <p>{`Staff: ${staffName}`}</p>}
      {service && <p>{`Service: ${serviceName} (${service.duration} min)`}</p>}
      <p>{`Status: ${statusDisplay}`}</p>
    </div>
  );

  if (view === 'agenda') {
    return (
      <div
        data-testid={`appointment-card-agenda-${appointment.id}`}
        onClick={onClick}
        draggable={isDraggable}
        onDragStart={isDraggable ? handleDragStart : undefined}
        className={`flex items-center p-3 mb-2.5 ${cardBaseClasses} ${statusTheme.bg} hover:border-l-8`}
      >
        <div className="flex-grow overflow-hidden">
          <p className={`font-semibold ${statusTheme.text} truncate`}>{title}</p>
          <p className={`text-sm ${statusTheme.text}`}>{timeText}</p>
          {staff && <p className={`text-xs ${statusTheme.text} opacity-80 truncate`}>{`Staff: ${staffName}`}</p>}
        </div>
        <div className={`text-xs px-2.5 py-1 ${statusTheme.text} ${statusTheme.bg.replace('50', '200')} ${theme.borderRadius.small} font-medium ml-2 flex-shrink-0`}>
          {statusDisplay.toUpperCase()}
        </div>
      </div>
    );
  }
  
  return (
    <Tooltip content={tooltipContent} position="right">
      <div
        data-testid={`appointment-card-${view}-${appointment.id}`}
        onClick={onClick}
        draggable={isDraggable}
        onDragStart={isDraggable ? handleDragStart : undefined}
        className={`${cardBaseClasses} 
                    ${isDraggable ? 'cursor-grab' : ''}
                    ${view === 'month' ? `m-0.5 text-xs ${statusTheme.bg}` : `absolute w-full ${statusTheme.bg}`}`}
        style={ view === 'month' ? {} : getPositionStyle(appointment.start, appointment.end)}
        aria-label={`Edit Appointment: ${title} ${timeText}`}
      >
        {cardContent}
      </div>
    </Tooltip>
  );
};

// Helper to calculate position for day/week view
const getPositionStyle = (start: Date, end: Date): React.CSSProperties => {
  const startOfDayMinutes = 0; 
  const startMinutes = start.getHours() * 60 + start.getMinutes() - startOfDayMinutes;
  
  const durationMinutes = Math.max(15, (end.getTime() - start.getTime()) / (1000 * 60));

  const top = (startMinutes / 60) * 60; 
  const height = Math.max(15, (durationMinutes / 60) * 60);

  return {
    top: `${top}px`,
    height: `${height}px`,
    left: '3px', 
    right: '3px',
    zIndex: 10,
  };
};

export default AppointmentCard;