
import React from 'react';
import { Service } from '@/types';
import Select from '@/components/calendar/common/Select';
import { useTheme } from '@/components/calendar/theme/ThemeContext';
// import { useTranslation } from 'react-i18next'; // i18n removed

interface ServiceFilterProps {
  serviceList: Service[];
  selectedServiceId: string | null;
  onServiceChange: (serviceId: string | null) => void;
  className?: string;
}

const ServiceFilter: React.FC<ServiceFilterProps> = ({ serviceList, selectedServiceId, onServiceChange, className }) => {
  const { theme } = useTheme();
  // const { t } = useTranslation(); // i18n removed

  const options = [
    { value: '', label: "All Services" }, // Hardcoded English
    ...serviceList.map(service => ({ value: service.id, label: service.name }))
  ];

  return (
    <div className={`min-w-[150px] md:min-w-[180px] ${className}`} data-testid="service-filter-container">
       <Select
        options={options}
        value={selectedServiceId || ''}
        onChange={(e) => onServiceChange(e.target.value || null)}
        aria-label="Filter by service" // Hardcoded English
        className={`bg-${theme.colors.surface} text-${theme.colors.textPrimary} border-${theme.colors.border}`}
        data-testid="service-filter-select"
      />
    </div>
  );
};

export default ServiceFilter;