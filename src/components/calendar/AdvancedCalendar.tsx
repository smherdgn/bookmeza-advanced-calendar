
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Appointment, CalendarView, Staff, Service, Customer, UserRole } from '../../types';
import {
  fetchAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  fetchStaff,
  fetchServices,
  fetchCustomers
} from '../../services/appointmentService';
import { MOCK_STAFF, MOCK_SERVICES, MOCK_CUSTOMERS, DEFAULT_TENANT_ID } from '../../constants';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import AppointmentModal from './AppointmentModal';
import { useTheme } from './theme/ThemeContext';
import { getTitleForView, addDays, addMonths } from './hooks/useCalendarUtils';
import { useTranslation } from 'react-i18next';

interface AdvancedCalendarProps {
  tenantId?: string;
  userRole?: UserRole; 
  initialView?: CalendarView;
  initialDate?: Date;
}

const AdvancedCalendar: React.FC<AdvancedCalendarProps> = ({
  tenantId = DEFAULT_TENANT_ID,
  userRole = UserRole.ADMIN,
  initialView = 'week',
  initialDate = new Date(),
}) => {
  const { theme } = useTheme();
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;

  const [currentDate, setCurrentDate] = useState<Date>(initialDate);
  const [view, setView] = useState<CalendarView>(initialView);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [staffList, setStaffList] = useState<Staff[]>(MOCK_STAFF);
  const [serviceList, setServiceList] = useState<Service[]>(MOCK_SERVICES);
  const [customerList, setCustomerList] = useState<Customer[]>(MOCK_CUSTOMERS);

  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentAppointment, setCurrentAppointment] = useState<Appointment | null>(null);
  const [modalInitialDateTime, setModalInitialDateTime] = useState<Date | undefined>(undefined);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
        const mobile = typeof window !== 'undefined' && window.innerWidth < 768;
        setIsMobile(mobile);
        if (mobile && view !== 'day') {
            setView('day'); // Force day view on mobile
        } else if (!mobile && initialView && view === 'day' && initialView !== 'day') {
            // If resized to desktop and was previously forced to day view, restore initial non-day view
            setView(initialView);
        } else if (!mobile && !initialView && view === 'day') {
             // If no specific initialView, default to week on desktop if currently day
             setView('week');
        }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [view, initialView]); // Rerun on view or initialView change


  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // In a real app, filters might be passed to fetchAppointments
      const [fetchedAppointments, fetchedStaff, fetchedServices, fetchedCustomers] = await Promise.all([
        fetchAppointments({ 
            staffId: selectedStaffId || undefined, 
            serviceId: selectedServiceId || undefined,
            // date: view === 'day' || view === 'month' ? currentDate : undefined // Potentially filter by date for specific views
        }), 
        fetchStaff(),
        fetchServices(),
        fetchCustomers()
      ]);
      
      let filteredAppointments = fetchedAppointments;
      if (userRole === UserRole.STAFF) {
        // This assumes staff's own ID is known, e.g., from auth. For demo, use first staff if role is Staff.
        const currentStaffUserId = staffList.length > 0 ? staffList[0].id : null; 
        if(currentStaffUserId) { // This logic needs to be more robust in a real app
            // For now, if userRole is STAFF, we'll assume selectedStaffId should be their own ID
            // Or, if no selectedStaffId, filter by their ID. This part can be tricky for a generic component.
            // Let's assume if a staff is selected, we show their appointments. If "All Staff" selected by an admin, all are shown.
            // If a staff member is logged in, their view should be pre-filtered by their ID.
            // For this demo, if userRole is STAFF and no specific staff is selected (selectedStaffId is null), 
            // we could filter by a default staff ID (e.g., staffList[0].id)
             if (!selectedStaffId && currentStaffUserId) {
                filteredAppointments = fetchedAppointments.filter(appt => appt.staffId === currentStaffUserId);
             } else if (selectedStaffId) { // if a staff is selected (even by staff user themselves)
                filteredAppointments = fetchedAppointments.filter(appt => appt.staffId === selectedStaffId);
             } else { // Staff user, no selection, show only their own (first staff mock)
                filteredAppointments = fetchedAppointments.filter(appt => appt.staffId === currentStaffUserId);
             }
        }
      }
      
      setAppointments(filteredAppointments.map(a => ({...a, start: new Date(a.start), end: new Date(a.end)})));
      setStaffList(fetchedStaff); // Staff list for filters
      setServiceList(fetchedServices);
      setCustomerList(fetchedCustomers);

    } catch (err) {
      console.error("Failed to load calendar data", err);
      setError(t('calendar.errorLoading'));
    } finally {
      setIsLoading(false);
    }
  }, [tenantId, userRole, selectedStaffId, selectedServiceId, staffList, t]); // Added staffList

  useEffect(() => {
    loadData();
  }, [loadData]); // loadData includes selectedStaffId, selectedServiceId as dependencies


  const handleNavigate = (action: 'prev' | 'next' | 'today') => {
    let newDate = new Date(currentDate);
    if (action === 'today') {
      newDate = new Date();
    } else {
      const increment = action === 'next' ? 1 : -1;
      switch (view) {
        case 'day':
          newDate = addDays(currentDate, increment);
          break;
        case 'week':
           newDate = addDays(currentDate, increment * 7);
          break;
        case 'month':
        case 'agenda':
          newDate = addMonths(currentDate, increment);
          break;
      }
    }
    setCurrentDate(newDate);
  };

  const handleViewChange = (newView: CalendarView) => {
    if (isMobile && newView !== 'day') {
        setView('day'); 
    } else {
        setView(newView);
    }
  };
  
  const handleDateChange = (date: Date) => {
    setCurrentDate(date);
  };

  const openModalForNew = (slotDate?: Date, staffIdFromSlot?: string) => {
    setCurrentAppointment(null);
    const initialDateForModal = slotDate || new Date(currentDate); 
    // Pre-fill staff if provided from slot, and user is not a staff member themselves (or if they are, it matches them)
    // This logic can be refined based on exact requirements.
    const prefillStaffId = userRole !== UserRole.STAFF ? staffIdFromSlot : (staffList.length > 0 ? staffList[0].id : undefined);

    setModalInitialDateTime(initialDateForModal);
    // If you want to pass pre-filled staff to modal, you'd update initial formData creation logic in AppointmentModal
    // For now, AppointmentModal handles default staff selection.
    setIsModalOpen(true);
  };

  const openModalForEdit = (appointment: Appointment) => {
    setCurrentAppointment(appointment);
    setModalInitialDateTime(undefined); 
    setIsModalOpen(true);
  };

  const handleSaveAppointment = async (appointmentData: Appointment | Omit<Appointment, 'id'>) => {
    setIsLoading(true);
    try {
      if ('id' in appointmentData && appointmentData.id) { 
        await updateAppointment(appointmentData.id, appointmentData);
      } else { 
        await createAppointment(appointmentData as Omit<Appointment, 'id'>);
      }
      await loadData(); 
    } catch (err) {
      console.error("Error saving appointment", err);
      setError(t('calendar.errorSaving')); // Use translated error
      throw err; 
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteAppointment = async (appointmentId: string) => {
    setIsLoading(true);
    try {
        await deleteAppointment(appointmentId);
        await loadData(); 
    } catch (err) {
        console.error("Error deleting appointment", err);
        setError(t('calendar.errorDeleting')); // Use translated error
        throw err; 
    } finally {
        setIsLoading(false);
    }
  };

  const handleAppointmentDrop = async (appointmentId: string, newStart: Date, newEnd: Date, _staffId?: string) => {
    setIsLoading(true);
    try {
      await updateAppointment(appointmentId, { start: newStart, end: newEnd });
      await loadData();
    } catch (err) {
      console.error("Error updating appointment on drop", err);
      setError(t('calendar.errorUpdateDrop')); // Use translated error
    } finally {
      setIsLoading(false);
    }
  };
  
  const calendarTitle = useMemo(() => getTitleForView(currentDate, view, currentLang, t), [currentDate, view, currentLang, t]);

  if (error && !isLoading) { // Show error only if not loading, to prevent flicker
    return <div className={`p-6 text-center text-${theme.colors.error} bg-${theme.colors.background} rounded-${theme.borderRadius.large} shadow-lg m-4`} data-testid="error-message">{error}</div>;
  }

  return (
    <div className={`flex flex-col h-screen bg-${theme.colors.background} text-${theme.colors.textPrimary} overflow-hidden antialiased`} data-testid="advanced-calendar-container">
      <CalendarHeader
        currentDate={currentDate}
        view={view}
        title={calendarTitle}
        onViewChange={handleViewChange}
        onNavigate={handleNavigate}
        onDateChange={handleDateChange}
        onAddAppointment={() => openModalForNew(currentDate)}
        staffList={staffList}
        serviceList={serviceList}
        selectedStaffId={selectedStaffId}
        onStaffChange={setSelectedStaffId}
        selectedServiceId={selectedServiceId}
        onServiceChange={setSelectedServiceId}
        isMobile={isMobile}
      />
      {isLoading && appointments.length === 0 ? ( // Show detailed loading only on initial load
        <div className="flex-grow flex flex-col items-center justify-center text-center p-5" data-testid="loading-indicator">
          <div className={`animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-${theme.colors.primary}`}></div>
          <p className={`mt-4 text-lg font-medium text-${theme.colors.textSecondary}`}>{t('calendar.loading')}</p>
        </div>
      ) : (
        <div className="flex-grow overflow-auto" data-testid="calendar-grid-wrapper"> 
          <CalendarGrid
            currentDate={currentDate}
            view={view}
            appointments={appointments}
            onAppointmentClick={openModalForEdit}
            onSlotClick={(date, staffId) => openModalForNew(date, staffId)}
            onAppointmentDrop={handleAppointmentDrop}
            staffList={staffList}
            serviceList={serviceList}
            isMobile={isMobile}
          />
        </div>
      )}
      
      {isModalOpen && (
        <AppointmentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveAppointment}
          onDelete={userRole !== UserRole.STAFF ? handleDeleteAppointment : undefined}
          existingAppointments={appointments}
          currentAppointment={currentAppointment}
          initialDateTime={modalInitialDateTime}
          staffList={staffList}
          serviceList={serviceList}
          customerList={customerList}
        />
      )}
    </div>
  );
};

export default AdvancedCalendar;