'use client';

import React from 'react';

/**
 * Reusable formatting helper for Labs aesthetic
 * Parses *text* as a highlighted block/color and **text** as white bold text.
 * Also handles \n as <br />.
 */
export const renderFormattedText = (text: string, type: 'title' | 'description', theme: any) => {
  if (!text) return null;
  
  // Split by *text* or **text** or \n
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|\n)/g);
  
  return parts.map((part, i) => {
    if (part === '\n') {
      return <br key={i} />;
    }
    
    if (part.startsWith('**') && part.endsWith('**')) {
      // Double asterisk: Bold (white)
      return <span key={i} className="text-white font-bold">{part.slice(2, -2)}</span>;
    } else if (part.startsWith('*') && part.endsWith('*')) {
      // Single asterisk: Highlight (Primary block for titles, Primary color for desc)
      if (type === 'title') {
        return (
          <span 
            key={i} 
            className="px-2 py-0.5 rounded mx-1 inline-block" 
            style={{ backgroundColor: theme.colors.textRestagMarkedBG, color: theme.colors.textRestagMarked }}
          >
            {part.slice(1, -1)}
          </span>
        );
      } else {
        return <span key={i} style={{ color: theme.colors.primary }}>{part.slice(1, -1)}</span>;
      }
    }
    return part;
  });
};
