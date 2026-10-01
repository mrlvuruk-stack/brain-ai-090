/**
 * Design Token definitions in TypeScript
 * Matches CSS custom properties in src/styles/tokens.css
 */

export const colors = {
  bg: '#FAF9F6',
  bgSubtle: '#F3EFEA',
  surface: '#FFFFFF',

  primary: '#0E6251',
  primaryLight: '#1B7A66',
  primaryDark: '#084B3E',
  primaryMuted: '#E8F3F1',

  secondary: '#B45309',
  secondaryLight: '#D97706',
  secondaryMuted: '#FEF3C7',

  textPrimary: '#18201E',
  textSecondary: '#4A5568',
  textTertiary: '#718096',
  inverse: '#FFFFFF',

  borderSubtle: '#E6E1DA',
  borderMedium: '#CBD5E0',

  focus: '#0E6251',

  healthNormal: '#1B7A43',
  healthNormalMuted: '#E8F7EE',
  healthWarning: '#C05621',
  healthWarningMuted: '#FDF2E9',
  healthCritical: '#9E2A2B',
  healthCriticalMuted: '#FBEBEB',
  emergency: '#C1121F',
  emergencyMuted: '#FDE8E8',
} as const;

export const fonts = {
  heading: "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  devanagari: "'Noto Sans Devanagari', 'Inter', sans-serif",
} as const;

export const spacing = {
  '0.5': '0.125rem', // 2px
  '1': '0.25rem',     // 4px
  '2': '0.5rem',      // 8px
  '3': '0.75rem',     // 12px
  '4': '1rem',        // 16px
  '5': '1.25rem',     // 20px
  '6': '1.5rem',      // 24px
  '8': '2rem',        // 32px
  '10': '2.5rem',     // 40px
  '12': '3rem',       // 48px
  '16': '4rem',       // 64px
  '20': '5rem',       // 80px
  '24': '6rem',       // 96px
} as const;

export const radii = {
  none: '0px',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '9999px',
} as const;

export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(24, 32, 30, 0.05)',
  md: '0 4px 6px -1px rgba(24, 32, 30, 0.06), 0 2px 4px -2px rgba(24, 32, 30, 0.04)',
  lg: '0 10px 15px -3px rgba(24, 32, 30, 0.07), 0 4px 6px -4px rgba(24, 32, 30, 0.03)',
} as const;

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1200px',
  '2xl': '1360px',
} as const;

export const zIndex = {
  base: 1,
  dropdown: 1000,
  sticky: 1100,
  overlay: 1200,
  modal: 1300,
  toast: 1400,
} as const;

export type ThemeColors = typeof colors;
export type ThemeSpacing = typeof spacing;
export type ThemeRadii = typeof radii;
