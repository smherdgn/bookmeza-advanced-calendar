
import React, { ReactNode } from 'react';
import { useTheme } from '../theme/ThemeContext';
// import { useTranslation } from 'react-i18next'; // i18n removed

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string; 
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'; // Added 'full' for mobile
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer, size = 'md' }) => {
  const { theme, mode } = useTheme();
  // const { t } = useTranslation(); // i18n removed

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full w-full h-full rounded-none md:max-w-xl md:h-auto md:rounded-xl' // specific styling for full screen on mobile
  };
  
  const effectiveSize = (typeof window !== 'undefined' && window.innerWidth < 768 && (size === 'lg' || size === 'xl' || size ==='md')) ? 'full' : size;


  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm transition-opacity duration-300 ease-in-out"
      onClick={onClose}
      data-testid="modal-overlay"
      aria-modal="true"
      role="dialog"
    >
      <div
        className={`bg-${theme.colors.surface} text-${theme.colors.textPrimary} ${effectiveSize === 'full' ? 'rounded-none shadow-none' : `${theme.borderRadius.large} ${theme.shadows.large}` } w-full ${sizeClasses[effectiveSize]} p-5 md:p-6 flex flex-col ${effectiveSize === 'full' ? 'h-full max-h-full' : 'max-h-[90vh]'} m-0 md:m-4 transition-transform duration-300 ease-in-out transform scale-95 opacity-0 animate-modalShow`}
        onClick={(e) => e.stopPropagation()}
        data-testid="modal-content"
      >
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h2 className={`text-xl md:text-2xl font-bold text-${theme.colors.textPrimary} truncate pr-2`}>{title}</h2>
          <button
            onClick={onClose}
            className={`text-${theme.colors.textSecondary} hover:text-${theme.colors.textPrimary} p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors`}
            aria-label="Close" // i18n removed
            data-testid="modal-close-button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-grow overflow-y-auto pr-1 styled-scrollbar mb-4 md:mb-6">
          {children}
        </div>
        {footer && <div className={`mt-auto pt-4 md:pt-6 border-t border-${theme.colors.border}`}>{footer}</div>}
      </div>
      {/* Basic animation for modal appearance - define in a global style or index.html if needed */}
      <style>{`
        .animate-modalShow {
          animation: modalShow 0.3s ease-out forwards;
        }
        @keyframes modalShow {
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .styled-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .styled-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .styled-scrollbar::-webkit-scrollbar-thumb {
          background: ${mode === 'light' ? '#cbd5e1' : '#475569'}; // slate-300 / slate-600
          border-radius: ${theme.borderRadius.large};
        }
        .styled-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${mode === 'light' ? '#94a3b8' : '#64748b'}; // slate-400 / slate-500
        }
      `}</style>
    </div>
  );
};

export default Modal;