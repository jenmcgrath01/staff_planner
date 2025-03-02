export const theme = {
  colors: {
    primary: '#0066F5', // Apella's blue
    secondary: '#6B7280',
    background: {
      main: '#FFFFFF',
      light: '#F9FAFB',
      gradient: 'linear-gradient(180deg, #F9FAFB 0%, #FFFFFF 100%)'
    },
    text: {
      primary: '#111827',
      secondary: '#6B7280'
    }
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    h1: {
      fontSize: '3.5rem',
      fontWeight: '600',
      lineHeight: '1.2'
    },
    h2: {
      fontSize: '2rem',
      fontWeight: '600',
      lineHeight: '1.3'
    }
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
  },
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px'
  },
  spacing: {
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem'
  }
}; 