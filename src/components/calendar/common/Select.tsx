
import React, { SelectHTMLAttributes } from 'react';
import { useTheme } from '../theme/ThemeContext';
// import { useTranslation } from 'react-i18next'; // i18n removed

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string | number; label: string }[];
  error?: string;
  placeholder?: string; 
  // placeholderKey?: string; // i18n removed
}

const Select: React.FC<SelectProps> = ({ label, options, id, className, error, placeholder, /* placeholderKey, */ ...props }) => {
  const { theme } = useTheme();
  // const { t } = useTranslation(); // i18n removed
  const selectId = id || `select-${Math.random().toString(36).substring(7)}`;

  // const displayPlaceholder = placeholderKey ? t(placeholderKey) : placeholder; // i18n removed
  const displayPlaceholder = placeholder;


  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className={`block text-sm font-medium text-${theme.colors.textSecondary} mb-1.5`}>
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          className={`w-full appearance-none px-3.5 py-2.5 text-sm bg-${theme.colors.surface} border border-${error ? theme.colors.error : theme.colors.border} ${theme.borderRadius.medium} ${theme.shadows.small} 
                    focus:outline-none focus:ring-2 focus:ring-${theme.colors.primary} focus:border-${theme.colors.primary} 
                    text-${theme.colors.textPrimary} placeholder-${theme.colors.textSecondary} transition-all duration-150 ease-in-out ${className}`}
          {...props}
          data-testid={props['data-testid'] || 'select-input'}
        >
          {displayPlaceholder && <option value="">{displayPlaceholder}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className={`pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-${theme.colors.textSecondary}`}>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      {error && <p className={`mt-1.5 text-xs text-${theme.colors.error}`}>{error}</p>}
    </div>
  );
};

export default Select;