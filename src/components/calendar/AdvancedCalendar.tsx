
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Appointment, CalendarView, Staff, Service, Customer, UserRole } from '@/types';
import {
  fetchAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  fetchStaff,
  fetchServices,
  fetchCustomers
} from '@/services/appointmentService';
import { MOCK_STAFF, MOCK_SERVICES, MOCK_CUSTOMERS, DEFAULT_TENANT_ID } from '@/constants';
import CalendarHeader from '@/components/calendar/CalendarHeader';
import CalendarGrid from '@/components/calendar/CalendarGrid';
import AppointmentModal from '@/components/calendar/AppointmentModal';
import { useTheme } from '@/components/calendar/theme/ThemeContext';
import { getTitleForView, addDays, addMonths } from '@/components/calendar/hooks/useCalendarUtils';
// import { useTranslation } from 'react-i18next'; // i18n removed

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
  // const { t, i18n } = useTranslation(); // i18n removed
  // const currentLang = i18n.language; // i18n removed
  const currentLang = navigator.language || 'en';


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
            setView('day'); 
        } else if (!mobile && initialView && view === 'day' && initialView !== 'day') {
            setView(initialView);
        } else if (!mobile && !initialView && view === 'day') {
             setView('week');
        }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [view, initialView]); 


  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [fetchedAppointments, fetchedStaff, fetchedServices, fetchedCustomers] = await Promise.all([
        fetchAppointments({ 
            staffId: selectedStaffId || undefined, 
            serviceId: selectedServiceId || undefined,
        }), 
        fetchStaff(),
        fetchServices(),
        fetchCustomers()
      ]);
      
      let filteredAppointments = fetchedAppointments;
      if (userRole === UserRole.STAFF) {
        const currentStaffUserId = staffList.length > 0 ? staffList[0].id : null; 
        if(currentStaffUserId) { 
             if (!selectedStaffId && currentStaffUserId) {
                filteredAppointments = fetchedAppointments.filter(appt => appt.staffId === currentStaffUserId);
             } else if (selectedStaffId) { 
                filteredAppointments = fetchedAppointments.filter(appt => appt.staffId === selectedStaffId);
             } else { 
                filteredAppointments = fetchedAppointments.filter(appt => appt.staffId === currentStaffUserId);
             }
        }
      }
      
      setAppointments(filteredAppointments.map(a => ({...a, start: new Date(a.start), end: new Date(a.end)})));
      setStaffList(fetchedStaff); 
      setServiceList(fetchedServices);
      setCustomerList(fetchedCustomers);

    } catch (err) {
      console.error("Failed to load calendar data", err);
      setError("Failed to load calendar data. Please try again."); // Hardcoded English
    } finally {
      setIsLoading(false);
    }
  }, [tenantId, userRole, selectedStaffId, selectedServiceId, staffList]); 

  useEffect(() => {
    loadData();
  }, [loadData]); 


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
    const prefillStaffId = userRole !== UserRole.STAFF ? staffIdFromSlot : (staffList.length > 0 ? staffList[0].id : undefined);

    setModalInitialDateTime(initialDateForModal);
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
      setError("Failed to save appointment."); // Hardcoded English
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
        setError("Failed to delete appointment."); // Hardcoded English
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
      setError("Failed to update appointment."); // Hardcoded English
    } finally {
      setIsLoading(false);
    }
  };
  
  const calendarTitle = useMemo(() => getTitleForView(currentDate, view, currentLang), [currentDate, view, currentLang]);

  if (error && !isLoading) { 
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
      {isLoading && appointments.length === 0 ? ( 
        <div className="flex-grow flex flex-col items-center justify-center text-center p-5" data-testid="loading-indicator">
          <div className={`animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-${theme.colors.primary}`}></div>
          <p className={`mt-4 text-lg font-medium text-${theme.colors.textSecondary}`}>Loading appointments...</p> {/* Hardcoded English */}
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