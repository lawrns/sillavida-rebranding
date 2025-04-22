import React, { useEffect, useRef, ReactNode } from 'react';
import { motion, useAnimation, Variants } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface ScrollRevealProps {
  children: ReactNode;
  variant?: 'fadeIn' | 'fadeUp' | 'fadeDown' | 'fadeLeft' | 'fadeRight' | 'scale' | 'stagger';
  delay?: number;
  duration?: number;
  threshold?: number;
  className?: string;
  once?: boolean;
  staggerChildren?: number;
  staggerDirection?: 'forward' | 'reverse';
  childrenClassName?: string;
}

const variants: Record<string, Variants> = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  },
  fadeUp: {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  },
  fadeDown: {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0 }
  },
  fadeLeft: {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 }
  },
  fadeRight: {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 }
  },
  scale: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 }
  },
  stagger: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  }
};

const childVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  variant = 'fadeUp',
  delay = 0,
  duration = 0.5,
  threshold = 0.1,
  className = '',
  once = true,
  staggerChildren = 0.1,
  staggerDirection = 'forward',
  childrenClassName = ''
}) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: once,
    threshold
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    } else if (!once) {
      controls.start('hidden');
    }
  }, [controls, inView, once]);

  const isStaggered = variant === 'stagger';
  const containerVariant = variants[variant];

  if (isStaggered) {
    // For staggered animations, we need to wrap each child in a motion.div
    const childrenArray = React.Children.toArray(children);
    
    return (
      <motion.div
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren,
              delayChildren: delay,
              staggerDirection: staggerDirection === 'reverse' ? -1 : 1
            }
          }
        }}
        className={className}
      >
        {childrenArray.map((child, index) => (
          <motion.div
            key={index}
            variants={childVariants}
            transition={{ duration }}
            className={childrenClassName}
          >
            {child}
          </motion.div>
        ))}
      </motion.div>
    );
  }

  // For non-staggered animations
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={containerVariant}
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
