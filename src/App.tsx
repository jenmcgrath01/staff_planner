import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { theme } from './theme/theme';
import { GlobalStyle } from './styles/GlobalStyle';
import { StaffScheduleView } from './components/schedule/StaffScheduleView';
import { ORScheduleView } from './components/schedule/ORScheduleView';
import { SimpleHeader } from './components/layout/SimpleHeader';
import { StaffTools } from './components/pages/StaffTools';
import { SurgeonTools } from './components/pages/SurgeonTools';

const queryClient = new QueryClient();

// Create MUI theme
const muiTheme = createTheme({});

export const App = () => {
  return (
    <StyledThemeProvider theme={theme}>
      <GlobalStyle />
      <MuiThemeProvider theme={muiTheme}>
        <QueryClientProvider client={queryClient}>
          <Router>
            <SimpleHeader />
            <Routes>
              <Route path="" element={<Navigate to="staff-schedule" replace />} />
              <Route path="staff-schedule" element={<StaffScheduleView />} />
              <Route path="or-schedule" element={<ORScheduleView />} />
              <Route path="staff" element={<StaffTools />} />
              <Route path="surgeon" element={<SurgeonTools />} />
            </Routes>
          </Router>
        </QueryClientProvider>
      </MuiThemeProvider>
    </StyledThemeProvider>
  );
};

export default App;
