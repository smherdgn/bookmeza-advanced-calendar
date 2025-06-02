
import { Appointment } from '../../../types';
import { isBefore, isAfter } from './useCalendarUtils';

/**
 * Checks if two time ranges overlap.
 * Assumes startA <= endA and startB <= endB.
 */
const doTimesOverlap = (startA: Date, endA: Date, startB: Date, endB: Date): boolean => {
  // Check if A starts before B ends AND A ends after B starts
  return isBefore(startA, endB) && isAfter(endA, startB);
};

/**
 * Checks if a new/updated appointment conflicts with existing appointments for the same staff member.
 * @param newAppointment The appointment to check.
 * @param existingAppointments List of all existing appointments.
 * @param S The ID of the appointment being updated (to exclude it from conflict check).
 * @returns True if there is a conflict, false otherwise.
 */
export const useConflictCheck = (
  newAppointment: Pick<Appointment, 'start' | 'end' | 'staffId' | 'id'>,
  existingAppointments: Appointment[]
): boolean => {
  if (!newAppointment.start || !newAppointment.end || !newAppointment.staffId) {
    // Not enough information to check for conflicts
    return false; 
  }

  // Filter appointments for the same staff member, excluding the appointment itself if it's an update
  const relevantAppointments = existingAppointments.filter(
    (existing) =>
      existing.staffId === newAppointment.staffId &&
      existing.id !== newAppointment.id // Exclude the appointment itself
  );

  for (const existing of relevantAppointments) {
    if (doTimesOverlap(newAppointment.start, newAppointment.end, existing.start, existing.end)) {
      return true; // Conflict found
    }
  }

  return false; // No conflict
};
