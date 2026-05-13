---
name: premium-3d-scroll-page
description: "A skill focused on creating high-end 3D scroll-triggered landing pages using **Next.js**, **React** Three Fiber (R3F), and Lerp-based animation physics. It includes patterns for smooth scrolling, glassmorphism UI, and optimized 3D rendering."
---

# Premium 3D Scroll Experience

This skill provides comprehensive instructions and patterns for building immersive, high-conversion landing pages that blend 3D interactive scenes with modern UI elements.

## 🚀 Core Technology Stack

- **Framework**: Next.js (App Router preferred)
- **3D Engine**: `@react-three/fiber` (R3F) & `@react-three/drei`
- **Math/Physics**: `three.js` (for vectors and math)
- **Styling**: Tailwind CSS (for layout and Glassmorphism)
- **Animations**: Lerp (Linear Interpolation) for weighted feel, Framer Motion for micro-interactions.

## 🛠️ Key Implementation Patterns

### 1. The Dynamic Loader Pattern
To avoid SSR issues and "Canvas not found" errors, always isolate the 3D scene in a client component and import it dynamically.

```tsx
// components/Basic3DSceneLoader.tsx
'use client'
import dynamic from 'next/dynamic'

const Basic3DScene = dynamic(
  () => import('@/components/Basic3DScene'),
  { ssr: false, loading: () => <PremiumSpinner /> }
)
```

### 2. Smooth Scroll & Lerp Physics
Instead of using raw scroll values, use a `lerp` function within a `useFrame` loop to give the 3D objects and UI elements a "weighted" feel.

```tsx
// inside a ScrollManager component (R3F context)
useFrame((state, delta) => {
  // Lerp factor: 0.05 - 0.1 for smooth inertia
  lerpedScroll.current = THREE.MathUtils.lerp(
    lerpedScroll.current,
    scrollOffsetRaw,
    0.1
  );
  
  // Apply to objects
  meshRef.current.rotation.y = lerpedScroll.current * Math.PI * 2;
});
```

### 3. Glassmorphism UI Identity
Use the following Tailwind classes to achieve the "Agência 47" premium look:
- `bg-white/[0.03] backdrop-blur-xl`
- `border border-white/10`
- `shadow-[0_0_40px_rgba(0,0,0,0.5)]`
- `bg-gradient-to-br from-white/10 to-transparent`

### 4. Sequential Scroll Triggers
Divide the scroll progress (0 to 1) into ranges for different components.
- **Intro**: 0.0 - 0.2
- **Service 1**: 0.2 - 0.45
- **Service 2**: 0.5 - 0.75
- **CTA**: 0.8 - 1.0

### 5. Hybrid 3D Strategy (Performance Mode)
For complex, high-fidelity 3D scenes that don't require user rotation, use pre-rendered **WebM/MP4 videos** with transparent backgrounds (or matching black backgrounds) instead of real-time WebGL.
- **Benefit**: Consistent 60fps on mobile.
- **Implementation**: Use `<video autoPlay loop muted playsInline />` with `object-cover`.
- **Sync**: Use the scroll offset to control `video.currentTime` for "scrollable" videos.

## 🎨 Design Philosophy (The "Astral" Feel)

1. **Vibrant Accents**: Use high-contrast gradients (Blue/Purple/Pink) only for key focus points or typewriter text.
2. **Negative Space**: Ensure the 3D object has "breathing room" in the center or following a specific path.
3. **Micro-interactions**: Use `animate-bounce` for scroll indicators and pulsing effects for hotspots.
4. **Typography**: Use font-black, tracking-tighter, and uppercase for "Big Bold" impact sections.

## ⚠️ Common Pitfalls & Fixes

- **R3F Hooks Scope**: `useFrame` and `useThree` MUST be inside a component rendered UNDER `<Canvas>`.
- **Texture Loading**: Use `useTexture` from `@react-three/drei` and wrap it in `<Suspense>`.
- **Mobile Performance**: Reduce `dpr` to `[1, 1.5]` on low-end devices and simplify mesh geometry if needed.
