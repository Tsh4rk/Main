export const watchDogsTheme = {
  colors: {
    // Primary background colors inspired by Watch Dogs 2
    background: {
      primary: '#0A0A0A',      // Deep black
      secondary: '#1A1A1A',    // Dark gray
      tertiary: '#252525',     // Medium gray
      modal: '#0F0F0F',        // Modal background
      card: '#161616',         // Card background
      overlay: 'rgba(0, 0, 0, 0.85)', // Overlay
    },
    
    // Text colors
    text: {
      primary: '#E8E8E8',      // Light gray
      secondary: '#B0B0B0',    // Medium gray
      tertiary: '#808080',     // Darker gray
      muted: '#606060',        // Muted text
      inverse: '#0A0A0A',      // Dark text on light bg
    },
    
    // Accent colors from Watch Dogs 2 palette
    accent: {
      cyan: '#78DBE2',         // Signature cyan
      blue: '#4A90E2',         // Blue accent
      purple: '#9B59B6',       // Purple accent
      orange: '#F39C12',       // Warning orange
      red: '#E74C3C',          // Error red
      green: '#2ECC71',        // Success green
      yellow: '#F1C40F',       // Attention yellow
      pink: '#E91E63',         // Highlight pink
    },
    
    // Status colors
    status: {
      success: '#2ECC71',
      warning: '#F39C12',
      error: '#E74C3C',
      info: '#4A90E2',
    },
    
    // Security level colors
    security: {
      low: '#2ECC71',          // Green
      medium: '#F39C12',       // Orange
      high: '#E74C3C',         // Red
      critical: '#8E44AD',     // Purple
    },
    
    // Terminal colors
    terminal: {
      background: '#0C0C0C',
      text: '#00FF41',         // Matrix green
      prompt: '#78DBE2',       // Cyan prompt
      error: '#FF6B6B',        // Red error
      warning: '#FFD93D',      // Yellow warning
      success: '#6BCF7F',      // Green success
      comment: '#6A9955',      // Comment green
      keyword: '#569CD6',      // Keyword blue
      string: '#CE9178',       // String orange
      number: '#B5CEA8',       // Number light green
    },
    
    // Gradient definitions
    gradients: {
      primary: 'linear-gradient(135deg, #78DBE2 0%, #4A90E2 100%)',
      secondary: 'linear-gradient(135deg, #9B59B6 0%, #E91E63 100%)',
      accent: 'linear-gradient(135deg, #F39C12 0%, #E74C3C 100%)',
      terminal: 'linear-gradient(135deg, #0C0C0C 0%, #1A1A1A 100%)',
      matrix: 'linear-gradient(180deg, transparent 0%, #00FF41 50%, transparent 100%)',
    },
    
    // Border colors
    border: {
      primary: '#333333',
      secondary: '#444444',
      accent: '#78DBE2',
      focus: '#4A90E2',
      hover: '#9B59B6',
    },
  },
  
  // Typography
  fonts: {
    primary: "'JetBrains Mono', monospace",
    heading: "'Orbitron', monospace",
    terminal: "'JetBrains Mono', 'Courier New', monospace",
  },
  
  // Font sizes
  fontSizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
    '6xl': '4rem',    // 64px
  },
  
  // Font weights
  fontWeights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    black: 800,
  },
  
  // Spacing scale
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '3rem',    // 48px
    '3xl': '4rem',    // 64px
    '4xl': '5rem',    // 80px
    '5xl': '6rem',    // 96px
  },
  
  // Border radius
  borderRadius: {
    none: '0',
    sm: '0.125rem',   // 2px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    full: '9999px',
  },
  
  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    glow: {
      cyan: '0 0 20px rgba(120, 219, 226, 0.5)',
      blue: '0 0 20px rgba(74, 144, 226, 0.5)',
      purple: '0 0 20px rgba(155, 89, 182, 0.5)',
      green: '0 0 20px rgba(46, 204, 113, 0.5)',
      red: '0 0 20px rgba(231, 76, 60, 0.5)',
    },
    terminal: '0 0 30px rgba(0, 255, 65, 0.3)',
  },
  
  // Z-index layers
  zIndex: {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800,
  },
  
  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  
  // Animation durations
  durations: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
    slower: '750ms',
    slowest: '1000ms',
  },
  
  // Animation easings
  easings: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    elastic: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  },
  
  // Layout
  layout: {
    maxWidth: '1280px',
    containerPadding: '1rem',
    navHeight: '64px',
    footerHeight: '200px',
  },
  
  // Effects
  effects: {
    glitch: {
      duration: '2s',
      intensity: 'medium',
    },
    matrix: {
      speed: 'slow',
      density: 'medium',
    },
    typing: {
      speed: '50ms',
      cursor: true,
    },
  },
};

// Type definitions for TypeScript
export type Theme = typeof watchDogsTheme;

// Helper functions for theme usage
export const getColor = (path: string) => {
  return path.split('.').reduce((obj, key) => obj[key], watchDogsTheme.colors);
};

export const getSpacing = (size: keyof typeof watchDogsTheme.spacing) => {
  return watchDogsTheme.spacing[size];
};

export const getFontSize = (size: keyof typeof watchDogsTheme.fontSizes) => {
  return watchDogsTheme.fontSizes[size];
};

// Media query helpers
export const mediaQueries = {
  sm: `@media (min-width: ${watchDogsTheme.breakpoints.sm})`,
  md: `@media (min-width: ${watchDogsTheme.breakpoints.md})`,
  lg: `@media (min-width: ${watchDogsTheme.breakpoints.lg})`,
  xl: `@media (min-width: ${watchDogsTheme.breakpoints.xl})`,
  '2xl': `@media (min-width: ${watchDogsTheme.breakpoints['2xl']})`,
};

export default watchDogsTheme;
