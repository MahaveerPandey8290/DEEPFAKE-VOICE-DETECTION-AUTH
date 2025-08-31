import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hover = true, 
  gradient = false 
}) => {
  return (
    <motion.div
      className={`
        ${gradient 
          ? 'bg-gradient-to-br from-white/10 via-white/5 to-transparent' 
          : 'bg-white/10 dark:bg-black/20'
        }
        backdrop-blur-lg rounded-xl border border-white/20 p-6 
        ${hover ? 'hover:border-white/30 transition-all duration-300' : ''}
        ${className}
      `}
      whileHover={hover ? { y: -2, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' } : {}}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      {children}
    </motion.div>
  );
};

export default Card;