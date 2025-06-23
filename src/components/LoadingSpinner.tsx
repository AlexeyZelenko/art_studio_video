import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  text = 'Завантаження...' 
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <motion.div
        className={`${sizeClasses[size]} bg-gradient-to-r from-pink-500 to-violet-600 rounded-full`}
        animate={{
          rotate: 360,
          scale: [1, 1.1, 1],
        }}
        transition={{
          rotate: { duration: 1, repeat: Infinity, ease: "linear" },
          scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        }}
        style={{
          background: 'conic-gradient(from 0deg, #ec4899, #8b5cf6, #ec4899)',
          maskImage: 'radial-gradient(circle, transparent 30%, black 30%)',
          WebkitMaskImage: 'radial-gradient(circle, transparent 30%, black 30%)',
        }}
      />
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className={`text-white ${textSizeClasses[size]} font-medium`}
      >
        {text}
      </motion.p>
    </div>
  );
};

export default LoadingSpinner; 