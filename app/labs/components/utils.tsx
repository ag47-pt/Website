'use client';

import React from 'react';

/**
 * Reusable formatting helper for Labs aesthetic
 * Parses *text* as a highlighted block/color and **text** as white bold text.
 * Also handles \n as <br />.
 */
export const renderFormattedText = (text: string, type: 'title' | 'description', theme: any) => {
  if (!text) return null;
  
  // Split by **text** or *text* or \n
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|\n)/g);
  
  return parts.map((part, i) => {
    if (part === '\n') {
      return <br key={i} />;
    }
    
    // Handle both ** and * as highlighted/branded text based on user preference
    if ((part.startsWith('**') && part.endsWith('**')) || (part.startsWith('*') && part.endsWith('*'))) {
      const content = part.startsWith('**') ? part.slice(2, -2) : part.slice(1, -1);
      
      if (type === 'title') {
        return (
          <span 
            key={i} 
            className="px-2 py-0.5 rounded mx-1 inline-block font-black" 
            style={{ 
              backgroundColor: theme.colors.textRestagMarkedBG, 
              color: theme.colors.textRestagMarked,
              boxShadow: `0 0 15px ${theme.colors.textRestagMarkedBG}40`
            }}
          >
            {content}
          </span>
        );
      } else {
        return <span key={i} className="font-bold" style={{ color: theme.colors.primary }}>{content}</span>;
      }
    }
    
    return part;
  });
};
