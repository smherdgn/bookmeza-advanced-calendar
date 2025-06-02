
import { Staff, Service, Appointment, AppointmentStatus, ThemeColors, ThemeShadows, Theme, CalendarView } from './types';

export const DEFAULT_TENANT_ID = 'tenant-123';
export const DEFAULT_TENANT_TIMEZONE = 'Europe/Berlin'; // Example

export const MOCK_STAFF: Staff[] = [
  { id: 'staff-1', name: 'Dr. Emily Carter', color: 'bg-indigo-500' },
  { id: 'staff-2', name: 'John Davis', color: 'bg-emerald-500' },
  { id: 'staff-3', name: 'Sarah Miller', color: 'bg-violet-500' },
];

export const MOCK_SERVICES: Service[] = [
  { id: 'service-1', name: 'Consultation', duration: 30, color: 'bg-indigo-300' },
  { id: 'service-2', name: 'Check-up', duration: 60, color: 'bg-pink-300' },
  { id: 'service-3', name: 'Therapy Session', duration: 90, color: 'bg-yellow-300' },
];

export const MOCK_CUSTOMERS: { id: string, name: string }[] = [
  { id: 'cust-1', name: 'Alice Wonderland' },
  { id: 'cust-2', name: 'Bob The Builder' },
];

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);
const yesterday = new Date(today);
yesterday.setDate(today.getDate() -1);

export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 'appt-1',
    start: new Date(new Date().setHours(9, 0, 0, 0)),
    end: new Date(new Date().setHours(9, 30, 0, 0)),
    serviceId: 'service-1',
    staffId: 'staff-1',
    customerId: 'cust-1',
    status: AppointmentStatus.CONFIRMED,
    tenantId: DEFAULT_TENANT_ID,
    title: 'Consultation with Alice'
  },
  {
    id: 'appt-2',
    start: new Date(new Date().setHours(10, 0, 0, 0)),
    end: new Date(new Date().setHours(11, 0, 0, 0)),
    serviceId: 'service-2',
    staffId: 'staff-2',
    customerId: 'cust-2',
    status: AppointmentStatus.PENDING,
    tenantId: DEFAULT_TENANT_ID,
    title: 'Check-up for Bob'
  },
  {
    id: 'appt-3',
    start: new Date(new Date(new Date().setDate(new Date().getDate() + 1)).setHours(14, 0, 0, 0)), // Tomorrow
    end: new Date(new Date(new Date().setDate(new Date().getDate() + 1)).setHours(15, 30, 0, 0)),
    serviceId: 'service-3',
    staffId: 'staff-1',
    status: AppointmentStatus.CONFIRMED,
    tenantId: DEFAULT_TENANT_ID,
    title: 'Therapy Session'
  },
   {
    id: 'appt-4',
    start: new Date(new Date(new Date().setDate(new Date().getDate() - 1)).setHours(11, 0, 0, 0)), // Yesterday
    end: new Date(new Date(new Date().setDate(new Date().getDate() - 1)).setHours(11, 30, 0, 0)),
    serviceId: 'service-1',
    staffId: 'staff-3',
    customerId: 'cust-1',
    status: AppointmentStatus.COMPLETED,
    tenantId: DEFAULT_TENANT_ID,
    title: 'Follow-up with Alice'
  },
];

// Theme Definitions
const lightColors: ThemeColors = {
  primary: 'indigo-500',
  secondary: 'violet-500',
  accent: 'violet-500',
  background: 'white',
  surface: 'slate-50',
  textPrimary: 'slate-800',
  textSecondary: 'slate-500',
  border: 'slate-200',
  error: 'red-500',
  success: 'emerald-500',
  warning: 'amber-500',
};

const darkColors: ThemeColors = {
  primary: 'indigo-400',
  secondary: 'violet-400',
  accent: 'violet-400',
  background: 'slate-900',
  surface: 'slate-800',
  textPrimary: 'slate-100',
  textSecondary: 'slate-400',
  border: 'slate-700',
  error: 'red-400',
  success: 'emerald-400',
  warning: 'amber-400',
};

const shadows: ThemeShadows = {
  small: 'shadow-[0_1px_3px_0_rgba(0,0,0,0.07),0_1px_2px_0_rgba(0,0,0,0.05)]',
  medium: 'shadow-[0_4px_6px_rgba(0,0,0,0.1)]',
  large: 'shadow-[0_10px_15px_rgba(0,0,0,0.1)]',
};

const spacing = (factor: number): string => `${factor * 0.25}rem`;

const borderRadius = {
  small: 'rounded-md',
  medium: 'rounded-lg',
  large: 'rounded-xl',
};

export const lightTheme: Theme = {
  colors: lightColors,
  shadows,
  spacing,
  borderRadius,
  typography: { fontFamily: 'Inter, sans-serif' }
};

export const darkTheme: Theme = {
  colors: darkColors,
  shadows,
  spacing,
  borderRadius,
  typography: { fontFamily: 'Inter, sans-serif' }
};


export const APPOINTMENT_STATUS_COLORS: Record<AppointmentStatus, { bg: string; text: string; border: string }> = {
  [AppointmentStatus.CONFIRMED]: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-500' },
  [AppointmentStatus.PENDING]: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-500' },
  [AppointmentStatus.CANCELLED]: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-500' },
  [AppointmentStatus.COMPLETED]: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-500' },
  [AppointmentStatus.NO_SHOW]: { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-400' },
};

export const APPOINTMENT_STATUS_DISPLAY: Record<AppointmentStatus, string> = {
  [AppointmentStatus.CONFIRMED]: "Confirmed",
  [AppointmentStatus.PENDING]: "Pending",
  [AppointmentStatus.CANCELLED]: "Cancelled",
  [AppointmentStatus.COMPLETED]: "Completed",
  [AppointmentStatus.NO_SHOW]: "No Show"
};

export const CALENDAR_VIEWS_DISPLAY: Record<CalendarView, string> = {
  day: "Day",
  week: "Week",
  month: "Month",
  agenda: "Agenda"
};


export const HOUR_HEIGHT_PX = 60;
export const MIN_APPOINTMENT_DURATION_MINUTES = 15;
