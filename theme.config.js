/** @type {const} */
const themeColors = {
  // Big Starz Wireframe Colors
  primary: { light: '#FF007F', dark: '#FF007F' }, // Neon Pink
  accent1: { light: '#00FFFF', dark: '#00FFFF' }, // Cyan Blue
  accent2: { light: '#FFFF00', dark: '#FFFF00' }, // Vibrant Yellow
  accent3: { light: '#D4AF37', dark: '#D4AF37' }, // Metallic Gold (Elite only)
  
  // Dark Mode Base & Surfaces
  background: { light: '#0B0B0B', dark: '#0B0B0B' }, // Deep Obsidian
  surface: { light: '#1a1a1a', dark: '#1a1a1a' }, // Dark Charcoal for cards
  surfaceGlass: { light: 'rgba(26, 26, 26, 0.7)', dark: 'rgba(26, 26, 26, 0.7)' }, // Frosted glass
  
  // Text & Foreground
  foreground: { light: '#FFFFFF', dark: '#FFFFFF' }, // Pure white for contrast
  muted: { light: '#888888', dark: '#888888' }, // Gray for secondary text
  border: { light: '#333333', dark: '#333333' }, // Dark borders
  
  // Status Colors
  success: { light: '#00FF00', dark: '#00FF00' }, // Neon Green (success)
  warning: { light: '#FFFF00', dark: '#FFFF00' }, // Yellow (warning)
  error: { light: '#FF0000', dark: '#FF0000' }, // Red (error/live)
  
  // Neon Glow Effects
  glowPink: { light: '#FF007F', dark: '#FF007F' },
  glowCyan: { light: '#00FFFF', dark: '#00FFFF' },
  glowYellow: { light: '#FFFF00', dark: '#FFFF00' },
  glowGold: { light: '#D4AF37', dark: '#D4AF37' },
};

module.exports = { themeColors };
