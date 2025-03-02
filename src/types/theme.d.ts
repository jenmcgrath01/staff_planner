import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      secondary: string;
      border: string;
      background: {
        main: string;
        light: string;
        gradient: string;
      };
      text: {
        primary: string;
        secondary: string;
      };
    };
    spacing: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
    shadows: {
      sm: string;
    };
    typography: {
      fontFamily: string;
      h1: {
        fontSize: string;
        fontWeight: string;
        lineHeight: string;
      };
      h2: {
        fontSize: string;
        fontWeight: string;
        lineHeight: string;
      };
    };
    breakpoints: {
      mobile: string;
    };
  }
} 