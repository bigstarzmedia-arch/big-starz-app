/** @type {const} */
const themeColors = {
  // Elite Luxury Lounge - Deep Obsidian Base
  primary: { light: '#FF007F', dark: '#FF007F' }, // Neon Hyper-Pink
  accent1: { light: '#9D00FF', dark: '#9D00FF' }, // Electric Purple
  accent2: { light: '#FF007F', dark: '#FF007F' }, // Neon Pink (secondary)
  accent3: { light: '#D4AF37', dark: '#D4AF37' }, // Metallic Gold (Elite only)
  
  // Luxury Base & Surfaces
  background: { light: '#0B0B0B', dark: '#0B0B0B' }, // Deep Obsidian/Matte Black
  surface: { light: '#1a1a1a', dark: '#1a1a1a' }, // Slightly lighter obsidian for cards
  surfaceGlass: { light: 'rgba(26, 26, 26, 0.7)', dark: 'rgba(26, 26, 26, 0.7)' }, // Frosted glass
  
  // Text & Foreground
  foreground: { light: '#FFFFFF', dark: '#FFFFFF' }, // Pure white for contrast
  muted: { light: '#B0B0B0', dark: '#B0B0B0' }, // Silver-gray for secondary text
  border: { light: '#2a2a2a', dark: '#2a2a2a' }, // Subtle dark borders
  
  // Status Colors (Luxury Adjusted)
  success: { light: '#00FF88', dark: '#00FF88' }, // Neon Green (success)
  warning: { light: '#FFB700', dark: '#FFB700' }, // Gold-Orange (warning)
  error: { light: '#FF0055', dark: '#FF0055' }, // Neon Red (error)
  
  // Neon Glow Effects
  glowPink: { light: '#FF007F', dark: '#FF007F' },
  glowPurple: { light: '#9D00FF', dark: '#9D00FF' },
  glowGold: { light: '#D4AF37', dark: '#D4AF37' },
};

module.exports = { themeColors };
