'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  className = "", 
  width, 
  height, 
  borderRadius = "0.75rem" 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0.3 }}
      animate={{ opacity: [0.3, 0.6, 0.3] }}
      transition={{ 
        duration: 1.5, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }}
      className={`bg-white/5 relative overflow-hidden ${className}`}
      style={{ 
        width, 
        height, 
        borderRadius 
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
    </motion.div>
  );
};

export const CardSkeleton = () => (
  <div className="p-6 bg-white/5 border border-white/10 rounded-[32px] space-y-6">
    <Skeleton height="160px" borderRadius="1.5rem" />
    <div className="space-y-3">
      <Skeleton width="40%" height="12px" />
      <Skeleton width="80%" height="24px" />
      <Skeleton width="100%" height="40px" />
    </div>
    <div className="flex gap-2">
      <Skeleton width="60px" height="20px" borderRadius="1rem" />
      <Skeleton width="60px" height="20px" borderRadius="1rem" />
    </div>
  </div>
);

export const MetricSkeleton = () => (
  <div className="flex flex-col items-center gap-4">
    <Skeleton width="64px" height="64px" borderRadius="1rem" />
    <Skeleton width="80px" height="40px" />
    <Skeleton width="120px" height="12px" />
  </div>
);
