import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { AuthErrorType } from '../../services/customerAuth';

interface AuthErrorBannerProps {
  type: AuthErrorType;
  message: string;
  onDismiss?: () => void;
  autoDismiss?: boolean;
  dismissTime?: number;
}

/**
 * AuthErrorBanner component
 * 
 * Displays authentication-related errors in a user-friendly banner
 * with automatic dismissal option.
 */
const AuthErrorBanner: React.FC<AuthErrorBannerProps> = ({
  type,
  message,
  onDismiss,
  autoDismiss = true,
  dismissTime = 5000,
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (autoDismiss) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onDismiss) onDismiss();
      }, dismissTime);
      
      return () => clearTimeout(timer);
    }
  }, [autoDismiss, dismissTime, onDismiss]);

  if (!visible) return null;

  const handleDismiss = () => {
    setVisible(false);
    if (onDismiss) onDismiss();
  };

  return (
    <div className="auth-error-banner bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md relative mb-4" role="alert">
      <strong className="font-bold">
        {type === AuthErrorType.LOGIN && 'Error de inicio de sesión: '}
        {type === AuthErrorType.LOGOUT && 'Error al cerrar sesión: '}
        {type === AuthErrorType.REGISTRATION && 'Error de registro: '}
        {type === AuthErrorType.INITIALIZATION && 'Error de autenticación: '}
        {type === AuthErrorType.ACCOUNT_ACCESS && 'Error de acceso a cuenta: '}
      </strong>
      <span className="block sm:inline">{message}</span>
      <button 
        className="absolute top-0 bottom-0 right-0 px-4 py-3"
        onClick={handleDismiss}
        aria-label="Cerrar"
      >
        <span className="sr-only">Cerrar</span>
        <X className="h-5 w-5 text-red-500" />
      </button>
    </div>
  );
};

export default AuthErrorBanner;
