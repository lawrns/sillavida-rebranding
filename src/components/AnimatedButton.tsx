import React, { ButtonHTMLAttributes } from 'react';
import { motion } from 'framer-motion';

interface AnimatedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  animationLevel?: 'subtle' | 'medium' | 'playful';
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  iconPosition = 'left',
  loading = false,
  animationLevel = 'medium',
  className = '',
  disabled,
  ...props
}) => {
  // Base styles
  const baseStyles = 'font-heading font-semibold rounded-md focus:outline-none transition-all';
  
  // Size styles
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };
  
  // Variant styles
  const variantStyles = {
    primary: 'bg-teal text-white hover:bg-teal-light shadow-button hover:shadow-button-hover',
    secondary: 'bg-sage text-white hover:bg-sage-light shadow-button hover:shadow-button-hover',
    accent: 'bg-terracotta text-white hover:bg-terracotta-light shadow-button hover:shadow-button-hover',
    outline: 'bg-transparent border-2 border-teal text-teal hover:bg-teal-extralight',
    ghost: 'bg-transparent text-teal hover:bg-teal-extralight'
  };
  
  // Width styles
  const widthStyles = fullWidth ? 'w-full' : '';
  
  // Disabled styles
  const disabledStyles = disabled || loading ? 'opacity-60 cursor-not-allowed' : '';
  
  // Animation variants based on level
  const getAnimationProps = () => {
    switch (animationLevel) {
      case 'subtle':
        return {
          whileHover: { scale: 1.02 },
          whileTap: { scale: 0.98 }
        };
      case 'playful':
        return {
          whileHover: { scale: 1.05, rotate: 1 },
          whileTap: { scale: 0.95, rotate: -1 }
        };
      case 'medium':
      default:
        return {
          whileHover: { scale: 1.05 },
          whileTap: { scale: 0.95 }
        };
    }
  };
  
  // Combine all styles
  const buttonStyles = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyles} ${disabledStyles} ${className}`;
  
  // Get animation properties
  const animationProps = getAnimationProps();
  
  return (
    <motion.button
      className={buttonStyles}
      disabled={disabled || loading}
      whileHover={animationProps.whileHover}
      whileTap={animationProps.whileTap}
      // Safely spread only HTML button props
      onClick={props.onClick}
      type={props.type}
      name={props.name}
      value={props.value}
      id={props.id}
      form={props.form}
      formAction={props.formAction}
      formEncType={props.formEncType}
      formMethod={props.formMethod}
      formNoValidate={props.formNoValidate}
      formTarget={props.formTarget}
      aria-label={props['aria-label']}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <motion.div
            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <span className="ml-2">{children}</span>
        </div>
      ) : (
        <div className="flex items-center justify-center">
          {icon && iconPosition === 'left' && <span className="mr-2">{icon}</span>}
          {children}
          {icon && iconPosition === 'right' && <span className="ml-2">{icon}</span>}
        </div>
      )}
    </motion.button>
  );
};

export default AnimatedButton;
