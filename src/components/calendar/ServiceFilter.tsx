
import React from 'react';
import { Service } from '../../types';
import Select from './common/Select';
import { useTheme } from './theme/ThemeContext';
import { useTranslation } from 'react-i18next';

interface ServiceFilterProps {
  serviceList: Service[];
  selectedServiceId: string | null;
  onServiceChange: (serviceId: string | null) => void;
  className?: string;
}

const ServiceFilter: React.FC<ServiceFilterProps> = ({ serviceList, selectedServiceId, onServiceChange, className }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const options = [
    { value: '', label: t('calendar.filters.allServices') },
    ...serviceList.map(service => ({ value: service.id, label: t(`mock.services.${service.id}.name`, service.name) })) // Fallback to service.name
  ];

  return (
    <div className={`min-w-[150px] md:min-w-[180px] ${className}`} data-testid="service-filter-container">
       <Select
        options={options}
        value={selectedServiceId || ''}
        onChange={(e) => onServiceChange(e.target.value || null)}
        aria-label={t('calendar.filters.serviceAriaLabel')}
        className={`bg-${theme.colors.surface} text-${theme.colors.textPrimary} border-${theme.colors.border}`}
        data-testid="service-filter-select"
      />
    </div>
  );
};

export default ServiceFilter;