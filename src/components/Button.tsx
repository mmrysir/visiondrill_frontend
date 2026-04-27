import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'outline' | 'ghost' | 'danger';
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  type = 'button', 
  className = '', 
  variant = 'primary',
  isLoading = false,
  ...props 
}) => {
  const baseStyles = "px-6 py-2 rounded-lg transition-all font-semibold text-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-blue-900 text-white hover:bg-black shadow-lg shadow-blue-100",
    outline: "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50",
    ghost: "bg-transparent text-gray-500 hover:text-blue-600",
    danger: "bg-red-50 text-red-600 hover:bg-red-600 hover:text-white"
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;
