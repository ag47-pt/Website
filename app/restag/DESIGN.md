# RESTAG Labs Design Blueprint

This document defines the visual and interaction logic for Project RESTAG.

## Brand Identity
RESTAG (Restaurant + Tag) is the hospitality arm of Agência 47 Labs. It represents the "Gastro-Engineering" philosophy: treating fine dining with the precision of high-end software.

## Colors
- **Primary**: `#059669` (Emerald 600) - Represents freshness and technical growth.
- **Surface**: `#000000` (Pure Black) - The base canvas for all Labs projects.
- **Accents**: `#F472B6` (Pink 400) - Used for system status and high-end highlights.
- **HUD Labels**: `#94A3B8` (Slate 400) - For coordinates and technical metadata.

## Typography
- **Headlines**: `Outfit` (Bold) - Modern, geometric, clean.
- **Body**: `Inter` - Maximum readability.
- **Technical**: `JetBrains Mono` - For "System Readouts" and prices.

## Layout & Components
- **The Grid**: Based on a 12-column blueprint.
- **Glassmorphism**: `backdrop-blur-xl` on all overlays.
- **Borders**: 1px solid `#1A1A1A` with subtle glows on hover.
- **Corners**: 
  - Platform/HUD: `0px` (Rigid)
  - Food/Cards: `16px` (Appetizing)

## Interaction
- **Staggered Entry**: Components must enter the screen with a `0.05s` delay between them.
- **Glow Hover**: Cards should emit a soft Emerald glow (`drop-shadow`) on hover.
