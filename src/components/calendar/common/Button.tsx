import React from "react";
import { useTheme } from "../theme/ThemeContext";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  "data-testid"?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  leftIcon,
  rightIcon,
  className = "",
  ...props
}) => {
  const { theme, mode } = useTheme();

  const baseStyles = `inline-flex items-center justify-center font-medium ${theme.borderRadius.medium} focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition-all duration-200 ease-in-out transform active:scale-98`;

  // Ensure min height for touch targets, adjusted paddings to meet this.
  // Tailwind's default line-height and font-size usually make this work, but explicit min-h is safer.
  const sizeStyles = {
    sm: `px-3 py-2 text-xs min-h-[36px]`, // Approx 36px with padding
    md: `px-4 py-2.5 text-sm min-h-[42px]`, // Approx 42px with padding
    lg: `px-6 py-3 text-base min-h-[48px]`, // Approx 48px with padding
  };

  const primaryTextClass = mode === "light" ? "text-white" : "text-white";

  const variantStyles = {
    primary: `text-white bg-gradient-to-br from-${theme.colors.primary} to-${theme.colors.secondary} hover:brightness-110 focus-visible:ring-${theme.colors.primary}`,
    secondary: `bg-${theme.colors.surface} text-${theme.colors.textPrimary} border border-${theme.colors.border} hover:bg-opacity-75 hover:border-${theme.colors.primary} focus-visible:ring-${theme.colors.secondary} dark:hover:bg-slate-700`,
    danger: `bg-${theme.colors.error} ${primaryTextClass} hover:brightness-110 focus-visible:ring-${theme.colors.error}`,
    ghost: `bg-transparent text-${theme.colors.primary} hover:bg-${
      theme.colors.primary
    } hover:bg-opacity-10 focus-visible:ring-${
      theme.colors.primary
    } dark:text-${theme.colors.primary.replace(
      "-500",
      "-400"
    )} dark:hover:bg-${theme.colors.primary.replace(
      "-500",
      "-400"
    )} dark:hover:bg-opacity-10`,
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className} hover:scale-102`}
      {...props}
      data-testid={props["data-testid"] || "button"}
    >
      {leftIcon && (
        <span className={`mr-2 ${size === "sm" ? "h-4 w-4" : "h-5 w-5"}`}>
          {leftIcon}
        </span>
      )}
      {children}
      {rightIcon && (
        <span className={`ml-2 ${size === "sm" ? "h-4 w-4" : "h-5 w-5"}`}>
          {rightIcon}
        </span>
      )}
    </button>
  );
};

export default Button;
