
import React from 'react';
import { Staff } from '@/types';
import Select from '@/components/calendar/common/Select';
import { useTheme } from '@/components/calendar/theme/ThemeContext';
// import { useTranslation } from 'react-i18next'; // i18n removed

interface StaffFilterProps {
  staffList: Staff[];
  selectedStaffId: string | null;
  onStaffChange: (staffId: string | null) => void;
  className?: string;
}

const StaffFilter: React.FC<StaffFilterProps> = ({ staffList, selectedStaffId, onStaffChange, className }) => {
  const { theme } = useTheme();
  // const { t } = useTranslation(); // i18n removed

  const options = [
    { value: '', label: "All Staff" }, // Hardcoded English
    ...staffList.map(staff => ({ value: staff.id, label: staff.name })) 
  ];

  return (
    <div className={`min-w-[150px] md:min-w-[180px] ${className}`} data-testid="staff-filter-container">
      <Select
        options={options}
        value={selectedStaffId || ''}
        onChange={(e) => onStaffChange(e.target.value || null)}
        aria-label="Filter by staff" // Hardcoded English
        className={`bg-${theme.colors.surface} text-${theme.colors.textPrimary} border-${theme.colors.border}`}
        data-testid="staff-filter-select"
      />
    </div>
  );
};

export default StaffFilter;