'use client';

import { useState, useEffect } from 'react';

/**
 * useRestagScroll - Dedicated hook for RESTAG cinematic scroll tracking.
 * Cloned from global usePageScroll to ensure isolation.
 */
export function useRestagScroll() {
  const [offset, setOffset] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        setOffset(window.scrollY / scrollHeight);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return offset;
}
