
import React from 'react';
import AdvancedCalendar from './components/calendar/AdvancedCalendar';
import { ThemeProvider, useTheme } from './components/calendar/theme/ThemeContext';
import Button from './components/calendar/common/Button';
import { UserRole } from './types';
import { useTranslation } from 'react-i18next';

const ThemeToggleButton: React.FC = () => {
  const { toggleTheme, mode } = useTheme();
  const { t } = useTranslation();
  const nextMode = mode === 'light' ? t('app.languages.tr') : t('app.languages.en'); // Example: if current is light, button shows "Dark"
  
  return (
    <Button 
      onClick={toggleTheme} 
      variant="secondary" 
      size="sm" 
      className="shadow-md" 
      data-testid="theme-toggle-button"
      aria-label={t('app.themeToggle', { mode: nextMode })}
    >
      {mode === 'light' ? (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1 md:w-5 md:h-5 md:mr-2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1 md:w-5 md:h-5 md:mr-2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-6.364-.386l1.591-1.591M3 12h2.25m.386-6.364l1.591 1.591" />
        </svg>
      )}
      <span className="hidden sm:inline">{mode === 'light' ? t('app.languages.tr') : t('app.languages.en')}</span> 
      <span className="sm:hidden">{mode === 'light' ? '🌙' : '☀️'}</span>
    </Button>
  );
};

const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation();
  const { theme } = useTheme();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    if (typeof window !== 'undefined') {
        localStorage.setItem('i18nextLng', lng);
         document.documentElement.lang = lng;
    }
  };

  return (
    <div className="relative">
      <label htmlFor="lang-selector" className={`sr-only`}>{t('app.languageLabel')}</label>
      <select
        id="lang-selector"
        value={i18n.language}
        onChange={(e) => changeLanguage(e.target.value)}
        className={`w-full appearance-none pl-2 pr-6 py-1 md:pl-3 md:pr-8 md:py-1.5 text-xs md:text-sm bg-${theme.colors.surface} border border-${theme.colors.border} ${theme.borderRadius.medium} 
                    focus:outline-none focus:ring-1 focus:ring-${theme.colors.primary} focus:border-${theme.colors.primary} 
                    text-${theme.colors.textPrimary} transition-colors duration-150 shadow-sm`}
        data-testid="language-selector"
      >
        <option value="en">{t('app.languages.en')}</option>
        <option value="tr">{t('app.languages.tr')}</option>
      </select>
      <div className={`pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 md:px-2 text-${theme.colors.textSecondary}`}>
        <svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 20 20">
           <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  );
}


const AppContent: React.FC = () => {
  const [userRole, setUserRole] = React.useState<UserRole>(UserRole.ADMIN);
  const { theme } = useTheme();
  const { t, i18n } = useTranslation();

  React.useEffect(() => {
    document.body.className = `bg-${theme.colors.background} text-${theme.colors.textPrimary} transition-colors duration-300 ease-in-out font-${theme.typography.fontFamily} antialiased`;
    document.documentElement.lang = i18n.language; // Set html lang attribute
  }, [theme, i18n.language]);

  const userRoleOptions = [
    { value: UserRole.ADMIN, label: t('app.roles.admin') },
    { value: UserRole.STAFF, label: t('app.roles.staff') },
    { value: UserRole.OWNER, label: t('app.roles.owner') },
  ];

  return (
    <div className={`min-h-screen`}>
      <div className="fixed top-3 right-3 md:top-4 md:right-4 z-[60] flex items-center space-x-2 md:space-x-3 p-2 bg-opacity-60 backdrop-blur-md bg-slate-100/70 dark:bg-slate-800/70 rounded-lg shadow-lg">
        <LanguageSwitcher />
        <ThemeToggleButton />
        <div className="relative">
          <label htmlFor="role-selector" className={`sr-only`}>{t('app.userRoleLabel')}</label>
          <select 
            id="role-selector"
            value={userRole} 
            onChange={(e) => setUserRole(e.target.value as UserRole)}
            className={`w-full appearance-none pl-2 pr-6 py-1 md:pl-3 md:pr-8 md:py-1.5 text-xs md:text-sm bg-${theme.colors.surface} border border-${theme.colors.border} ${theme.borderRadius.medium} 
                        focus:outline-none focus:ring-1 focus:ring-${theme.colors.primary} focus:border-${theme.colors.primary} 
                        text-${theme.colors.textPrimary} transition-colors duration-150 shadow-sm`}
            data-testid="user-role-selector"
          >
            {userRoleOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
           <div className={`pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 md:px-2 text-${theme.colors.textSecondary}`}>
             <svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 20 20">
               <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
      <AdvancedCalendar userRole={userRole} />
    </div>
  );
};


const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;