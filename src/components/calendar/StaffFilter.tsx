
import React from 'react';
import { Staff } from '../../types';
import Select from './common/Select';
import { useTheme } from './theme/ThemeContext';
import { useTranslation } from 'react-i18next';

interface StaffFilterProps {
  staffList: Staff[];
  selectedStaffId: string | null;
  onStaffChange: (staffId: string | null) => void;
  className?: string;
}

const StaffFilter: React.FC<StaffFilterProps> = ({ staffList, selectedStaffId, onStaffChange, className }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const options = [
    { value: '', label: t('calendar.filters.allStaff') },
    ...staffList.map(staff => ({ value: staff.id, label: t(`mock.staff.${staff.id}.name`, staff.name) })) // Fallback to staff.name if key not found
  ];

  return (
    <div className={`min-w-[150px] md:min-w-[180px] ${className}`} data-testid="staff-filter-container">
      <Select
        options={options}
        value={selectedStaffId || ''}
        onChange={(e) => onStaffChange(e.target.value || null)}
        aria-label={t('calendar.filters.staffAriaLabel')}
        className={`bg-${theme.colors.surface} text-${theme.colors.textPrimary} border-${theme.colors.border}`}
        data-testid="staff-filter-select"
      />
    </div>
  );
};

export default StaffFilter;