import React from 'react';

interface SpinnerProps {
  className?: string;
  large?: boolean;
}

export const Spinner: React.FC<SpinnerProps> = ({ className = '', large = false }) => {
  const sizeClasses = large ? 'h-12 w-12' : 'h-5 w-5';
  const borderClasses = large ? 'border-4' : 'border-2';

  return (
    <div
      className={`${sizeClasses} ${borderClasses} border-t-transparent border-solid animate-spin rounded-full border-white ${className}`}
      role="status"
    >
      <span className="sr-only">Chargement...</span>
    </div>
  );
};
