'use client';

import React from 'react';

interface GeminiCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  duration?: string;
}

export function GeminiCard({
  children,
  className = '',
  duration = '4s',
  style,
  ...props
}: GeminiCardProps) {
  return (
    <div
      className={`relative rounded-2xl bg-zinc-950/60 backdrop-blur-md p-6 ${className}`}
      style={style}
      {...props}
    >
      {/* Glow Blur behind card */}
      <div className="gemini-glow-blur" />
      {/* Masked Border */}
      <div className="gemini-glow-border" />
      
      {/* Content wrapper */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

interface GeminiButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  duration?: string;
}

export function GeminiButton({
  children,
  className = '',
  duration = '3s',
  style,
  ...props
}: GeminiButtonProps) {
  return (
    <button
      className={`relative px-6 py-2.5 rounded-xl bg-zinc-950/60 backdrop-blur-md text-white font-mono text-xs uppercase tracking-widest border border-white/10 hover:border-transparent transition-colors overflow-hidden group ${className}`}
      style={style}
      {...props}
    >
      {/* Glow Blur (only on hover) */}
      <div className="gemini-glow-blur opacity-0 group-hover:opacity-60 transition-opacity duration-300" style={{ filter: 'blur(10px)' }} />
      {/* Masked Border (only on hover) */}
      <div className="gemini-glow-border opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <span className="relative z-10">{children}</span>
    </button>
  );
}

interface GeminiInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  duration?: string;
  isFocused?: boolean;
}

export function GeminiInput({
  className = '',
  duration = '4s',
  isFocused,
  style,
  ...props
}: GeminiInputProps) {
  const [focused, setFocused] = React.useState(false);
  const active = isFocused !== undefined ? isFocused : focused;

  return (
    <div 
      className="relative w-full rounded-xl overflow-hidden p-[1.5px]"
      style={style}
    >
      {/* Glow Blur (subtle, active state) */}
      <div className={`gemini-glow-blur transition-opacity duration-500 ${active ? 'opacity-40' : 'opacity-0'}`} style={{ filter: 'blur(8px)' }} />
      {/* Masked Border */}
      <div className={`gemini-glow-border transition-opacity duration-500 ${active ? 'opacity-100' : 'opacity-20'}`} />
      
      <input
        onFocus={(e) => {
          setFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          props.onBlur?.(e);
        }}
        className={`w-full px-4 py-3 rounded-[inherit] bg-zinc-950 text-white placeholder-zinc-500 focus:outline-none relative z-10 text-sm ${className}`}
        {...props}
      />
    </div>
  );
}

interface GeminiAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  duration?: string;
}

export function GeminiAvatar({
  src,
  alt = 'Avatar',
  fallback = 'U',
  duration = '3s',
  className = '',
  style,
  ...props
}: GeminiAvatarProps) {
  return (
    <div 
      className={`relative w-16 h-16 rounded-full flex items-center justify-center p-[1.5px] ${className}`}
      style={style}
      {...props}
    >
      {/* Glow Blur */}
      <div className="gemini-glow-blur rounded-full" style={{ filter: 'blur(8px)', opacity: 0.6 }} />
      {/* Masked Border */}
      <div className="gemini-glow-border rounded-full" />

      <div className="relative w-full h-full bg-zinc-950 rounded-full overflow-hidden flex items-center justify-center border border-black/40 z-10">
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={alt} className="w-full h-full object-cover" />
        ) : (
          <span className="text-white font-bold text-lg font-mono">{fallback}</span>
        )}
      </div>
    </div>
  );
}

interface BorderBeamProps {
  className?: string;
  duration?: string;
  colors?: string;
  borderWidth?: number;
  size?: number;
  isPaused?: boolean;
  style?: React.CSSProperties;
}

export function BorderBeam({
  className = '',
  duration = '4s',
  colors,
  borderWidth = 1.5,
  size = 20,
  isPaused = false,
  style,
}: BorderBeamProps) {
  const gradientColors = colors || '#4285f4, #9b51e0, #e91e63, #3b82f6, #4285f4';
  const startColorPercent = 100 - size;
  
  return (
    <div 
      className={`border-beam-line ${className}`}
      style={{
        padding: `${borderWidth}px`,
        '--gemini-glow-colors': gradientColors,
        animationPlayState: isPaused ? 'paused' : 'running',
        ...style,
      } as React.CSSProperties}
    >
      <div
        className="absolute w-[200%] h-[200%] top-[-50%] left-[-50%] -z-10"
        style={{
          background: `conic-gradient(from var(--angle), transparent 0%, transparent ${startColorPercent}%, var(--gemini-glow-colors) 100%)`,
          animation: 'spin linear infinite',
          animationDuration: duration,
          animationPlayState: isPaused ? 'paused' : 'running',
        }}
      />
    </div>
  );
}
