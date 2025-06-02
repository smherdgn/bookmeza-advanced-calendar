import { Appointment, AppointmentStatus } from "@/types";
import {
  MOCK_APPOINTMENTS,
  MOCK_STAFF,
  MOCK_SERVICES,
  MOCK_CUSTOMERS,
} from "@/constants";

// Simulate a database
let appointmentsDB: Appointment[] = [
  ...MOCK_APPOINTMENTS.map((a) => ({
    ...a,
    start: new Date(a.start),
    end: new Date(a.end),
  })),
];

const simulateDelay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const fetchAppointments = async (filters?: {
  date?: Date;
  staffId?: string;
  serviceId?: string;
  status?: AppointmentStatus;
}): Promise<Appointment[]> => {
  await simulateDelay(500);
  //console.log('Fetching appointments with filters:', filters);
  // Basic filtering simulation
  return appointmentsDB.filter((appt) => {
    let match = true;
    if (filters?.date) {
      match =
        match && appt.start.toDateString() === filters.date.toDateString();
    }
    if (filters?.staffId) {
      match = match && appt.staffId === filters.staffId;
    }
    if (filters?.serviceId) {
      match = match && appt.serviceId === filters.serviceId;
    }
    if (filters?.status) {
      match = match && appt.status === filters.status;
    }
    return match;
  });
};

export const createAppointment = async (
  appointmentData: Omit<Appointment, "id">
): Promise<Appointment> => {
  await simulateDelay(300);
  const newAppointment: Appointment = {
    ...appointmentData,
    id: `appt-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    start: new Date(appointmentData.start),
    end: new Date(appointmentData.end),
  };
  appointmentsDB.push(newAppointment);
  console.log("Created appointment:", newAppointment);
  return newAppointment;
};

export const updateAppointment = async (
  appointmentId: string,
  updates: Partial<Appointment>
): Promise<Appointment> => {
  await simulateDelay(300);
  const index = appointmentsDB.findIndex((appt) => appt.id === appointmentId);
  if (index === -1) {
    throw new Error("Appointment not found");
  }

  // Ensure dates are Date objects if updated
  const updatedData = { ...updates };
  if (updates.start) updatedData.start = new Date(updates.start);
  if (updates.end) updatedData.end = new Date(updates.end);

  appointmentsDB[index] = { ...appointmentsDB[index], ...updatedData };
  console.log("Updated appointment:", appointmentsDB[index]);
  return appointmentsDB[index];
};

export const deleteAppointment = async (
  appointmentId: string
): Promise<void> => {
  await simulateDelay(300);
  appointmentsDB = appointmentsDB.filter((appt) => appt.id !== appointmentId);
  console.log("Deleted appointment:", appointmentId);
};

export const fetchStaff = async () => {
  await simulateDelay(100);
  return MOCK_STAFF;
};

export const fetchServices = async () => {
  await simulateDelay(100);
  return MOCK_SERVICES;
};

export const fetchCustomers = async () => {
  await simulateDelay(100);
  return MOCK_CUSTOMERS;
};
