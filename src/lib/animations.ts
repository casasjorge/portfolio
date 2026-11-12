import { Variants } from 'framer-motion';

export const standardDuration = 0.3;
export const standardEase: [number, number, number, number] = [0.22, 1, 0.36, 1];
export const standardStaggerChildren = 0.05;
export const standardDelayChildren = 0.02;
export const interactionDuration = 0.24;
export const interactionTapScale = 0.985;
export const interactionHoverLiftY = -6;
export const interactionTapLiftY = -2;
export const interactionSpring = {
  stiffness: 300,
  damping: 30,
  restDelta: 0.5,
};

export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: standardDuration, ease: standardEase },
  },
};

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { duration: 0.2, ease: standardEase },
  },
};

export const slideInLeft: Variants = {
  initial: { opacity: 0, x: -40 },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: { duration: standardDuration, ease: standardEase },
  },
};

export const slideInRight: Variants = {
  initial: { opacity: 0, x: 40 },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: { duration: standardDuration, ease: standardEase },
  },
};

export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: standardDuration, ease: standardEase },
  },
};

export const staggerContainer: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: standardStaggerChildren,
      delayChildren: 0,
    },
  },
};

export const heroStagger: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

export const heroReveal: Variants = {
  initial: { opacity: 0, y: 18 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: standardEase },
  },
};

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: standardDuration, ease: standardEase },
  },
};

// New animations for enhanced portfolio
export const floatIn: Variants = {
  initial: { opacity: 0, y: 30 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: standardDuration, ease: standardEase },
  },
};

export const hoverLift: Variants = {
  initial: { y: 0, scale: 1 },
  hover: {
    y: interactionHoverLiftY,
    transition: { duration: interactionDuration, ease: standardEase },
  },
  tap: {
    y: interactionTapLiftY,
    scale: interactionTapScale,
    transition: { duration: interactionDuration, ease: standardEase },
  },
};
