
import React, { useState, ReactNode } from 'react';
import { useTheme } from '../theme/ThemeContext';

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children, position = 'top', className = '' }) => {
  const [visible, setVisible] = useState(false);
  const { theme, mode } = useTheme(); // Destructure mode here

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  // Use a darker surface for tooltip background for contrast
  const tooltipBgColor = mode === 'light' ? 'slate-700' : 'slate-900'; // Darker than surface
  const tooltipTextColor = mode === 'light' ? 'white' : 'slate-100';

  return (
    <div 
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)} // Show on focus for accessibility
      onBlur={() => setVisible(false)}  // Hide on blur
      tabIndex={0} // Make it focusable if children isn't
      data-testid="tooltip-wrapper"
    >
      {children}
      {visible && (
        <div
          role="tooltip"
          className={`absolute z-20 px-3 py-1.5 text-xs font-medium text-${tooltipTextColor} bg-${tooltipBgColor} ${theme.borderRadius.medium} ${theme.shadows.medium} ${positionClasses[position]}`}
          data-testid="tooltip-content"
        >
          {content}
          {/* Arrow styling might need to use border tricks for perfect theming, or SVG.
              For simplicity, a simple div is used, its color matches tooltipBgColor. */}
          <div 
            className={`absolute w-2 h-2 bg-${tooltipBgColor} transform rotate-45 
              ${position === 'top' ? 'top-full left-1/2 -translate-x-1/2 -mt-1' : ''}
              ${position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 -mb-1' : ''}
              ${position === 'left' ? 'left-full top-1/2 -translate-y-1/2 -ml-1' : ''}
              ${position === 'right' ? 'right-full top-1/2 -translate-y-1/2 -mr-1' : ''}
            `}
          />
        </div>
      )}
    </div>
  );
};

export default Tooltip;
