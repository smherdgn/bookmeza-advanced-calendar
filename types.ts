
export enum AppointmentStatus {
  CONFIRMED = 'confirmed',
  PENDING = 'pending',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  NO_SHOW = 'no-show',
}

export interface Staff {
  id: string;
  name: string; // Will be localized using i18n, e.g., t(`mock.staff.${id}.name`)
  color: string; 
}

export interface Service {
  id: string;
  name: string; // Will be localized using i18n, e.g., t(`mock.services.${id}.name`)
  duration: number; // in minutes
  color: string;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
}

export interface Appointment {
  id: string;
  start: Date;
  end: Date;
  title?: string; // User-defined title, not typically localized unless it's a preset
  serviceId: string;
  staffId: string;
  customerId?: string;
  status: AppointmentStatus;
  notes?: string;
  tenantId: string; 
}

export type CalendarView = 'day' | 'week' | 'month' | 'agenda';

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
  error: string;
  success: string;
  warning: string;
}

export interface ThemeShadows {
  small: string;
  medium: string;
  large: string;
}
export interface Theme {
  colors: ThemeColors;
  shadows: ThemeShadows;
  spacing: (factor: number) => string; // e.g., theme.spacing(2) -> '0.5rem'
  borderRadius: {
    small: string;
    medium: string;
    large: string;
  };
  typography: {
    fontFamily: string;
  };
}


export enum UserRole {
  STAFF = 'staff',
  ADMIN = 'admin',
  OWNER = 'owner',
}

export interface DraggableAppointment {
  id: string;
  originalStart: string; // Changed from Date
  originalEnd: string;   // Changed from Date
}