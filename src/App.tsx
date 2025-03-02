import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { theme } from './theme/theme';
import { GlobalStyle } from './styles/GlobalStyle';
import { AppContent } from './components/layout/AppContent';

const queryClient = new QueryClient();

// Create MUI theme
const muiTheme = createTheme({});

function App() {
  return (
    <StyledThemeProvider theme={theme}>
      <GlobalStyle />
      <MuiThemeProvider theme={muiTheme}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </QueryClientProvider>
      </MuiThemeProvider>
    </StyledThemeProvider>
  );
}

export default App;
