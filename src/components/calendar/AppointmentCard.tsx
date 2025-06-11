import React from "react";
import { useTranslation } from "react-i18next";
import {
  APPOINTMENT_STATUS_COLORS,
  MOCK_SERVICES,
  MOCK_STAFF,
} from "../../constants";
import { Appointment, DraggableAppointment } from "../../types";
import Tooltip from "./common/Tooltip";
import { formatTime } from "./hooks/useCalendarUtils";
import { useTheme } from "./theme/ThemeContext";

interface AppointmentCardProps {
  appointment: Appointment;
  onClick: () => void;
  view: "day" | "week" | "month" | "agenda";
  isDraggable?: boolean;
  onDragStart?: (
    e: React.DragEvent<HTMLDivElement>,
    appointmentId: string,
    start: Date,
    end: Date
  ) => void;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onClick,
  view,
  isDraggable = false,
  onDragStart,
}) => {
  const { mode } = useTheme();
  const { t, i18n } = useTranslation();

  const staff = MOCK_STAFF.find((s) => s.id === appointment.staffId);
  const service = MOCK_SERVICES.find((s) => s.id === appointment.serviceId);

  const statusTheme =
    APPOINTMENT_STATUS_COLORS[appointment.status] ||
    APPOINTMENT_STATUS_COLORS.pending;

  const translatedStaffName = staff
    ? t(`mock.staff.${staff.id}.name`, staff.name)
    : "";
  const translatedServiceName = service
    ? t(`mock.services.${service.id}.name`, service.name)
    : "";

  const title =
    appointment.title ||
    translatedServiceName ||
    t("appointment.newTitle", "New Appointment");
  const timeText = `${formatTime(
    appointment.start,
    i18n.language
  )} - ${formatTime(appointment.end, i18n.language)}`;
  const statusDisplay = t(
    `appointment.status.${appointment.status}`,
    appointment.status
  );

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    if (onDragStart) {
      onDragStart(e, appointment.id, appointment.start, appointment.end);
      e.dataTransfer.setData(
        "application/json",
        JSON.stringify({
          id: appointment.id,
          originalStart: appointment.start.toISOString(),
          originalEnd: appointment.end.toISOString(),
        } as DraggableAppointment)
      );
      e.dataTransfer.effectAllowed = "move";
    }
  };

  // ✅ Agenda view için özel render
  if (view === "agenda") {
    return (
      <div
        data-testid={`appointment-card-agenda-${appointment.id}`}
        onClick={onClick}
        draggable={isDraggable}
        onDragStart={isDraggable ? handleDragStart : undefined}
        className={`appointment-agenda ${statusTheme.bg} ${statusTheme.border} hover:border-l-8 transition-all duration-150`}
      >
        <div className="flex-grow overflow-hidden">
          <p
            className={`font-semibold ${statusTheme.text} truncate`}
            title={title}
          >
            {title}
          </p>
          <p className={`text-sm ${statusTheme.text} opacity-90`}>{timeText}</p>
          {staff && (
            <p
              className={`text-xs ${statusTheme.text} opacity-70 truncate`}
              title={translatedStaffName}
            >
              {t(
                "appointment.cardTooltip.staff",
                { name: translatedStaffName },
                `w/ ${translatedStaffName}`
              )}
            </p>
          )}
        </div>
        <div
          className={`text-xs px-2 py-1 ${statusTheme.text} bg-opacity-20 rounded font-medium ml-2 flex-shrink-0`}
        >
          {statusDisplay.toUpperCase()}
        </div>
      </div>
    );
  }

  // ✅ Month view için özel render
  if (view === "month") {
    return (
      <div
        data-testid={`appointment-card-month-${appointment.id}`}
        onClick={onClick}
        draggable={isDraggable}
        onDragStart={isDraggable ? handleDragStart : undefined}
        className={`appointment-month ${statusTheme.bg} ${statusTheme.border} ${
          isDraggable ? "cursor-grab" : "cursor-pointer"
        } 
                   hover:shadow-sm transition-all duration-150`}
        title={`${title} - ${timeText}`}
      >
        <div className="truncate">
          <span className={`font-medium ${statusTheme.text}`}>{title}</span>
        </div>
      </div>
    );
  }

  // ✅ Day/Week view için positioned render
  const positionStyle = getPositionStyle(appointment.start, appointment.end);

  const tooltipContent = (
    <div className="text-sm text-left w-48 space-y-1">
      <p className="font-bold text-gray-900 dark:text-gray-100">{title}</p>
      <hr className="border-gray-300 dark:border-gray-600" />
      <p className="text-gray-700 dark:text-gray-300">{timeText}</p>
      {staff && (
        <p className="text-gray-600 dark:text-gray-400">
          {t(
            "appointment.cardTooltip.staff",
            { name: translatedStaffName },
            `Staff: ${translatedStaffName}`
          )}
        </p>
      )}
      {service && (
        <p className="text-gray-600 dark:text-gray-400">
          {t(
            "appointment.cardTooltip.service",
            { name: translatedServiceName, duration: service.duration },
            `Service: ${translatedServiceName} (${service.duration} min)`
          )}
        </p>
      )}
      <p className="text-gray-600 dark:text-gray-400">
        {t(
          "appointment.cardTooltip.status",
          { status: statusDisplay },
          `Status: ${statusDisplay}`
        )}
      </p>
    </div>
  );

  return (
    <Tooltip content={tooltipContent} position="right">
      <div
        data-testid={`appointment-card-${view}-${appointment.id}`}
        onClick={onClick}
        draggable={isDraggable}
        onDragStart={isDraggable ? handleDragStart : undefined}
        className={`appointment-positioned ${statusTheme.bg} ${
          statusTheme.border
        } 
                   ${isDraggable ? "cursor-grab" : "cursor-pointer"}
                   hover:shadow-lg hover:scale-[1.02] transition-all duration-150 z-10`}
        style={positionStyle}
        aria-label={`${t(
          "appointment.editTitle",
          "Edit appointment"
        )}: ${title} ${timeText}`}
      >
        <div className="p-1.5 h-full overflow-hidden">
          <p
            className={`font-semibold text-xs ${statusTheme.text} truncate leading-tight`}
            title={title}
          >
            {title}
          </p>
          <p className={`text-xs ${statusTheme.text} opacity-90 leading-tight`}>
            {timeText}
          </p>
          {staff &&
            positionStyle.height &&
            parseInt(positionStyle.height.toString()) > 40 && (
              <p
                className={`text-xs ${statusTheme.text} opacity-70 truncate leading-tight`}
                title={translatedStaffName}
              >
                w/ {translatedStaffName}
              </p>
            )}
        </div>
      </div>
    </Tooltip>
  );
};

// ✅ Position hesaplama düzeltildi
const getPositionStyle = (start: Date, end: Date): React.CSSProperties => {
  const HOUR_HEIGHT = 60; // CSS'teki hour-slot height ile eşleş

  // Günün başından itibaren dakika hesapla
  const startOfDay = new Date(start);
  startOfDay.setHours(0, 0, 0, 0);

  const startMinutes = start.getHours() * 60 + start.getMinutes();
  const endMinutes = end.getHours() * 60 + end.getMinutes();
  const durationMinutes = Math.max(15, endMinutes - startMinutes); // Minimum 15 dakika

  // Pixel hesaplama
  const top = (startMinutes / 60) * HOUR_HEIGHT;
  const height = Math.max(20, (durationMinutes / 60) * HOUR_HEIGHT); // Minimum 20px height

  return {
    top: `${top}px`,
    height: `${height}px`,
    left: "4px",
    right: "4px",
    zIndex: 10,
    position: "absolute" as const,
  };
};

export default AppointmentCard;
