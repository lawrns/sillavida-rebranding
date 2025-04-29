/**
 * SillaVida Animation Tokens
 * 
 * This file defines all animation tokens used in the application.
 * Based on the Vida redesign animation system.
 */

export const animations = {
  // Duration values (in ms and s)
  duration: {
    fastest: '100ms',
    fast: '150ms',
    medium: '300ms',
    slow: '500ms',
    slowest: '1000ms',
    // Seconds for easier use with JS animations
    fastestSec: 0.1,
    fastSec: 0.15,
    mediumSec: 0.3,
    slowSec: 0.5,
    slowestSec: 1,
  },
  
  // Easing functions
  easing: {
    // Standard easings
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    // Special easings
    bounce: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    elastic: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    // For JS animations (Framer Motion)
    framerEaseIn: [0.4, 0, 1, 1],
    framerEaseOut: [0, 0, 0.2, 1],
    framerEaseInOut: [0.4, 0, 0.2, 1],
    framerBounce: [0.175, 0.885, 0.32, 1.275],
    framerElastic: [0.68, -0.55, 0.265, 1.55],
  },
  
  // Transition presets
  transition: {
    // CSS transitions
    default: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
    fast: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: 'all 500ms cubic-bezier(0.4, 0, 0.2, 1)',
    color: 'color 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    transform: 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1)',
    opacity: 'opacity 300ms cubic-bezier(0.4, 0, 0.2, 1)',
    background: 'background-color 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    border: 'border-color 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    shadow: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'transform 300ms cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    
    // Framer Motion transition presets
    framer: {
      default: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      },
      fast: {
        duration: 0.15,
        ease: [0.4, 0, 0.2, 1],
      },
      slow: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
      },
      bounce: {
        duration: 0.3,
        ease: [0.175, 0.885, 0.32, 1.275],
      },
      elastic: {
        duration: 0.5,
        ease: [0.68, -0.55, 0.265, 1.55],
      },
      spring: {
        type: 'spring',
        stiffness: 400,
        damping: 30,
      },
      stagger: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  },
  
  // Animation keyframes
  keyframes: {
    // Fade animations
    fadeIn: {
      from: { opacity: 0 },
      to: { opacity: 1 },
    },
    fadeOut: {
      from: { opacity: 1 },
      to: { opacity: 0 },
    },
    
    // Slide animations
    slideUp: {
      from: { transform: 'translateY(20px)', opacity: 0 },
      to: { transform: 'translateY(0)', opacity: 1 },
    },
    slideDown: {
      from: { transform: 'translateY(-20px)', opacity: 0 },
      to: { transform: 'translateY(0)', opacity: 1 },
    },
    slideLeft: {
      from: { transform: 'translateX(20px)', opacity: 0 },
      to: { transform: 'translateX(0)', opacity: 1 },
    },
    slideRight: {
      from: { transform: 'translateX(-20px)', opacity: 0 },
      to: { transform: 'translateX(0)', opacity: 1 },
    },
    
    // Scale animations
    scaleUp: {
      from: { transform: 'scale(0.95)', opacity: 0 },
      to: { transform: 'scale(1)', opacity: 1 },
    },
    scaleDown: {
      from: { transform: 'scale(1.05)', opacity: 0 },
      to: { transform: 'scale(1)', opacity: 1 },
    },
    
    // Special animations
    pulse: {
      '0%, 100%': { transform: 'scale(1)' },
      '50%': { transform: 'scale(1.05)' },
    },
    spin: {
      from: { transform: 'rotate(0deg)' },
      to: { transform: 'rotate(360deg)' },
    },
    bounce: {
      '0%, 100%': { transform: 'translateY(0)' },
      '50%': { transform: 'translateY(-10px)' },
    },
  },
  
  // Component-specific animations
  component: {
    // Button animations
    button: {
      hover: {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
      },
      tap: {
        transform: 'translateY(1px)',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
      },
      loading: {
        opacity: 0.8,
      },
    },
    
    // Card animations
    card: {
      hover: {
        transform: 'translateY(-4px)',
        boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
      },
    },
    
    // Modal animations
    modal: {
      enter: {
        opacity: [0, 1],
        transform: ['scale(0.95)', 'scale(1)'],
      },
      exit: {
        opacity: [1, 0],
        transform: ['scale(1)', 'scale(0.95)'],
      },
    },
    
    // Dropdown animations
    dropdown: {
      enter: {
        opacity: [0, 1],
        transform: ['translateY(-10px)', 'translateY(0)'],
      },
      exit: {
        opacity: [1, 0],
        transform: ['translateY(0)', 'translateY(-10px)'],
      },
    },
    
    // Page transition animations
    page: {
      enter: {
        opacity: [0, 1],
        transform: ['translateY(20px)', 'translateY(0)'],
      },
      exit: {
        opacity: [1, 0],
        transform: ['translateY(0)', 'translateY(20px)'],
      },
    },
  },
  
  // Media query based animations (for reduced motion preferences)
  reducedMotion: {
    transition: {
      default: 'opacity 300ms cubic-bezier(0.4, 0, 0.2, 1)',
      fast: 'opacity 150ms cubic-bezier(0.4, 0, 0.2, 1)',
      slow: 'opacity 500ms cubic-bezier(0.4, 0, 0.2, 1)',
    },
    keyframes: {
      fadeIn: {
        from: { opacity: 0 },
        to: { opacity: 1 },
      },
      fadeOut: {
        from: { opacity: 1 },
        to: { opacity: 0 },
      },
    },
  },
};

// Export types for TypeScript support
export type AnimationTokens = typeof animations;
