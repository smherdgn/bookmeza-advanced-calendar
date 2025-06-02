
import React, { useState, useEffect, useCallback } from 'react';
import { Appointment, AppointmentStatus, Staff, Service, Customer } from '@/types';
import { DEFAULT_TENANT_ID, APPOINTMENT_STATUS_DISPLAY, MOCK_STAFF, MOCK_SERVICES } from '@/constants'; // Added MOCK_STAFF, MOCK_SERVICES
import { useConflictCheck } from '@/components/calendar/hooks/useConflictCheck';
import { addMinutes, isBefore } from '@/components/calendar/hooks/useCalendarUtils';
import Modal from '@/components/calendar/common/Modal';
import Button from '@/components/calendar/common/Button';
import Select from '@/components/calendar/common/Select';
import { useTheme } from '@/components/calendar/theme/ThemeContext';
// import { useTranslation } from 'react-i18next'; // i18n removed

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (appointment: Appointment | Omit<Appointment, 'id'>) => Promise<void>;
  onDelete?: (appointmentId: string) => Promise<void>;
  existingAppointments: Appointment[];
  currentAppointment: Appointment | null;
  initialDateTime?: Date;
  staffList: Staff[];
  serviceList: Service[];
  customerList: Customer[];
}

const commonInputClasses = (theme: any, error?: boolean) => 
  `w-full px-3 py-2 md:px-3.5 md:py-2.5 text-sm bg-${theme.colors.surface} border border-${error ? theme.colors.error : theme.colors.border} ${theme.borderRadius.medium} ${theme.shadows.small} 
  focus:outline-none focus:ring-2 focus:ring-${theme.colors.primary} focus:border-${theme.colors.primary} 
  text-${theme.colors.textPrimary} placeholder-${theme.colors.textSecondary} transition-all duration-150 ease-in-out`;

const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement> & {label: string, error?: string, theme: any}> = ({label, error, theme, id, ...props}) => (
    <div>
        <label htmlFor={id} className={`block text-sm font-medium text-${theme.colors.textSecondary} mb-1.5`}>{label}</label>
        <input id={id} {...props} className={`${commonInputClasses(theme, !!error)} ${props.className || ''}`} />
        {error && <p className={`mt-1.5 text-xs text-${theme.colors.error}`}>{error}</p>}
    </div>
);

const TextAreaField: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & {label: string, error?: string, theme: any}> = ({label, error, theme, id, ...props}) => (
    <div>
        <label htmlFor={id} className={`block text-sm font-medium text-${theme.colors.textSecondary} mb-1.5`}>{label}</label>
        <textarea id={id} {...props} className={`${commonInputClasses(theme, !!error)} ${props.className || ''}`} />
        {error && <p className={`mt-1.5 text-xs text-${theme.colors.error}`}>{error}</p>}
    </div>
);


const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  existingAppointments,
  currentAppointment,
  initialDateTime,
  staffList,
  serviceList,
  customerList
}) => {
  const { theme } = useTheme();
  // const { t, i18n } = useTranslation(); // i18n removed
  const [formData, setFormData] = useState<Partial<Appointment>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const isEditing = !!currentAppointment;

  const resetForm = useCallback(() => {
    if (isEditing && currentAppointment) {
      setFormData({
        ...currentAppointment,
        start: new Date(currentAppointment.start),
        end: new Date(currentAppointment.end),
      });
    } else {
      const defaultStartTime = initialDateTime || new Date();
      defaultStartTime.setMinutes(Math.ceil(defaultStartTime.getMinutes() / 15) * 15, 0, 0); 
      const defaultService = serviceList.length > 0 ? serviceList[0] : null;
      const defaultEndTime = defaultService ? addMinutes(defaultStartTime, defaultService.duration) : addMinutes(defaultStartTime, 30);

      setFormData({
        title: '',
        start: defaultStartTime,
        end: defaultEndTime,
        staffId: staffList.length > 0 ? staffList[0].id : undefined,
        serviceId: defaultService?.id,
        customerId: customerList.length > 0 ? customerList[0].id : undefined,
        status: AppointmentStatus.PENDING,
        notes: '',
        tenantId: DEFAULT_TENANT_ID,
      });
    }
    setErrors({});
  }, [isEditing, currentAppointment, initialDateTime, staffList, serviceList, customerList]);

  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen, resetForm]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'serviceId') {
        const selectedService = serviceList.find(s => s.id === value);
        if (selectedService && formData.start) {
            setFormData(prev => ({ ...prev, end: addMinutes(new Date(formData.start as Date), selectedService.duration) }));
        }
    }
     if (name === 'startDate' || name === 'startTime') { 
        const selectedService = serviceList.find(s => s.id === formData.serviceId);
        let newStart = new Date(formData.start || Date.now());
         if (name === 'startDate' && value) {
            const [year, month, day] = value.split('-').map(Number);
            newStart.setFullYear(year, month - 1, day);
         } else if (name === 'startTime' && value && formData.start) {
            const [hours, minutes] = value.split(':').map(Number);
            newStart = new Date(formData.start); 
            newStart.setHours(hours, minutes, 0, 0);
         }
        if (selectedService) {
             setFormData(prev => ({ ...prev, start: newStart, end: addMinutes(newStart, selectedService.duration) }));
        } else {
            setFormData(prev => ({ ...prev, start: newStart}));
        }
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    let newStart = new Date(formData.start || Date.now());
    let newEnd = new Date(formData.end || Date.now());

    if (name === 'startDate' && value) {
        const [year, month, day] = value.split('-').map(Number);
        newStart.setFullYear(year, month - 1, day);
        newEnd.setFullYear(year, month - 1, day);
    } else if (name === 'startTime' && value) {
        const [hours, minutes] = value.split(':').map(Number);
        newStart.setHours(hours, minutes, 0, 0);
    } else if (name === 'endTime' && value) {
        const [hours, minutes] = value.split(':').map(Number);
        newEnd.setHours(hours, minutes, 0, 0);
    }

    if ((name === 'startDate' || name === 'startTime') && formData.serviceId) {
        const selectedService = serviceList.find(s => s.id === formData.serviceId);
        if (selectedService) {
            setFormData(prev => ({ ...prev, start: newStart, end: addMinutes(newStart, selectedService.duration) }));
        } else {
             setFormData(prev => ({ ...prev, start: newStart, end: newEnd })); 
        }
    } else {
        setFormData(prev => ({ ...prev, start: newStart, end: newEnd }));
    }
  };


  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.title?.trim() && !formData.serviceId) newErrors.title = "Title or Service is required";
    if (!formData.start) newErrors.start = "Start time is required";
    if (!formData.end) newErrors.end = "End time is required";
    if (formData.start && formData.end && isBefore(new Date(formData.end), new Date(formData.start))) {
      newErrors.end = "End time cannot be before start time";
    }
    if (!formData.staffId) newErrors.staffId = "Staff is required";
    if (!formData.serviceId) newErrors.serviceId = "Service is required";

    if (formData.start && formData.end && formData.staffId) {
        const conflictCheckData = {
            id: formData.id || `temp-${Date.now()}`,
            start: new Date(formData.start),
            end: new Date(formData.end),
            staffId: formData.staffId
        };
        if (useConflictCheck(conflictCheckData, existingAppointments)) {
            newErrors.conflict = "This time slot conflicts with another appointment for this staff member.";
        }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsLoading(true);
    try {
      await onSave(formData as Appointment | Omit<Appointment, 'id'>); 
      onClose();
    } catch (error) {
      console.error("Failed to save appointment", error);
      setErrors(prev => ({ ...prev, submit: "Failed to save appointment. Please try again."}));
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDelete = async () => {
    if (currentAppointment?.id && onDelete) {
        if (window.confirm("Are you sure you want to delete this appointment?")) { 
            setIsLoading(true);
            try {
                await onDelete(currentAppointment.id);
                onClose();
            } catch (error) {
                console.error("Failed to delete appointment", error);
                setErrors(prev => ({ ...prev, submit: "Failed to delete appointment. Please try again."}));
            } finally {
                setIsLoading(false);
            }
        }
    }
  };

  const formatDateForInput = (date: Date | undefined): string => {
    if (!date) return '';
    return new Date(date).toISOString().split('T')[0];
  }

  const formatTimeForInput = (date: Date | undefined): string => {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  }

  const modalTitle = isEditing ? "Edit Appointment" : "New Appointment";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={modalTitle} size="lg" data-testid="appointment-modal">
      <form onSubmit={handleSubmit} data-testid="appointment-form" className="space-y-5 md:space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 md:gap-x-6 gap-y-4 md:gap-y-5">
          <InputField
            label="Title (Optional)"
            type="text"
            name="title"
            id="title"
            value={formData.title || ''}
            onChange={handleChange}
            theme={theme}
            error={errors.title}
            data-testid="appointment-title-input"
          />
          <Select
            label="Service *"
            name="serviceId"
            id="serviceId"
            options={serviceList.map(s => ({ value: s.id, label: `${s.name} (${s.duration} min)` }))}
            value={formData.serviceId || ''}
            onChange={handleChange}
            error={errors.serviceId}
            data-testid="appointment-service-select"
          />
          <Select
            label="Staff *"
            name="staffId"
            id="staffId"
            options={staffList.map(s => ({ value: s.id, label: s.name }))}
            value={formData.staffId || ''}
            onChange={handleChange}
            error={errors.staffId}
            data-testid="appointment-staff-select"
          />
           <Select
            label="Customer (Optional)"
            name="customerId"
            id="customerId"
            options={[{value: '', label: "None"}, ...customerList.map(c => ({ value: c.id, label: c.name }))]}
            value={formData.customerId || ''}
            onChange={handleChange}
            placeholder="Select Customer"
            data-testid="appointment-customer-select"
          />

          <InputField
              label="Date *"
              type="date"
              name="startDate"
              id="startDate"
              value={formatDateForInput(formData.start)}
              onChange={handleDateChange}
              required
              theme={theme}
              error={errors.start?.includes('date') ? errors.start : undefined}
              data-testid="appointment-date-input"
            />
          <div className="grid grid-cols-2 gap-x-2 md:gap-x-4">
             <InputField
                label="Start Time *"
                type="time"
                name="startTime"
                id="startTime"
                value={formatTimeForInput(formData.start)}
                onChange={handleDateChange}
                required
                step="900" 
                theme={theme}
                error={errors.start}
                data-testid="appointment-start-time-input"
                />
            <InputField
                label="End Time *"
                type="time"
                name="endTime"
                id="endTime"
                value={formatTimeForInput(formData.end)}
                onChange={handleDateChange}
                required
                step="900" 
                theme={theme}
                error={errors.end}
                data-testid="appointment-end-time-input"
                />
          </div>
          <div className="md:col-span-2">
            <Select
                label="Status *"
                name="status"
                id="status"
                options={Object.entries(APPOINTMENT_STATUS_DISPLAY).map(([sKey, sLabel]) => ({ value: sKey, label: sLabel }))}
                value={formData.status || ''}
                onChange={handleChange}
                error={errors.status}
                data-testid="appointment-status-select"
            />
          </div>
        </div>
        <TextAreaField
            label="Notes (Optional)"
            name="notes"
            id="notes"
            rows={3}
            value={formData.notes || ''}
            onChange={handleChange}
            theme={theme}
            data-testid="appointment-notes-input"
        />
        {errors.conflict && <p className={`mt-2 text-sm text-${theme.colors.error} text-center font-medium`}>{errors.conflict}</p>}
        {errors.submit && <p className={`mt-2 text-sm text-${theme.colors.error} text-center font-medium`}>{errors.submit}</p>}
        
        <div className="mt-6 md:mt-8 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 space-y-2 sm:space-y-0">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading} data-testid="appointment-cancel-button" className="w-full sm:w-auto">
            Cancel
          </Button>
          {isEditing && onDelete && (
             <Button type="button" variant="danger" onClick={handleDelete} disabled={isLoading} data-testid="appointment-delete-button" className="w-full sm:w-auto">
                {isLoading ? "Deleting..." : "Delete"}
             </Button>
          )}
          <Button type="submit" variant="primary" disabled={isLoading} data-testid="appointment-save-button" className="w-full sm:w-auto">
            {isLoading ? "Saving..." : (isEditing ? "Save Changes" : "Create")}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AppointmentModal;