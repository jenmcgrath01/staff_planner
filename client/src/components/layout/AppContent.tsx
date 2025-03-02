import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { StepperNav } from '../common/StepperNav';
import { StaffScheduleView } from '../schedule/StaffScheduleView';
import { ORScheduleView } from '../schedule/ORScheduleView';
import { StaffTools } from '../pages/StaffTools';
import { SurgeonTools } from '../pages/SurgeonTools';
import { SimpleHeader } from './SimpleHeader';
import styled from 'styled-components';

const AppContainer = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.colors.background.gradient};
  font-family: ${props => props.theme.typography.fontFamily};
`;

const MainContent = styled.main`
  width: 100%;
  margin: 0 auto;
  padding: 0;
  box-sizing: border-box;
`;

export const AppContent = () => {
  const location = useLocation();
  const showStepper = location.pathname === '/staff-schedule' || 
                      location.pathname === '/or-schedule';

  return (
    <AppContainer>
      <SimpleHeader />
      <MainContent>
        {showStepper && <StepperNav />}
        <Routes>
          <Route path="/" element={<Navigate to="/manager" replace />} />
          <Route path="/manager" element={<Navigate to="/staff-schedule" replace />} />
          <Route path="/staff-schedule" element={<StaffScheduleView />} />
          <Route path="/or-schedule" element={<ORScheduleView />} />
          <Route path="/staff" element={<StaffTools />} />
          <Route path="/surgeon" element={<SurgeonTools />} />
        </Routes>
      </MainContent>
    </AppContainer>
  );
}; 