import React from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';

const StepperContainer = styled.div`
  width: 100%;
  margin: 2rem 0;
  position: relative;
`;

const Steps = styled.div`
  display: flex;
  justify-content: center;  // Center the steps
  align-items: center;
  position: relative;
  margin-bottom: 1rem;
  gap: 4rem;  // Reduce gap between steps
  max-width: 400px;  // Constrain width to keep steps closer
  margin: 0 auto;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);  // Center the line
    width: 200px;  // Fixed width for the connecting line
    height: 2px;
    background: #E5E7EB;
    z-index: 0;
  }
`;

const Step = styled.div<{ $active?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 1;
  cursor: pointer;
  background: white;
  padding: 0 1rem;

  &:hover {
    opacity: 0.8;
  }
`;

const StepNumber = styled.div<{ $active?: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  margin-bottom: 0.5rem;

  /* Just two states: active (blue) or inactive (gray) */
  background: ${props => props.$active 
    ? '#0066F5'
    : '#E5E7EB'
  };
  
  color: ${props => props.$active
    ? '#FFFFFF'
    : '#6B7280'
  };

  border: 2px solid ${props => props.$active 
    ? '#0066F5'
    : '#E5E7EB'
  };

  box-shadow: ${props => props.$active 
    ? '0 2px 4px rgba(0, 0, 0, 0.1)' 
    : 'none'
  };
`;

const StepLabel = styled.div<{ $active?: boolean }>`
  font-size: 0.875rem;
  color: ${props => props.$active 
    ? props.theme.colors.text.primary 
    : '#6B7280'};
  font-weight: ${props => props.$active ? '600' : '500'};
  text-align: center;
  min-width: 100px;
`;

const StepDescription = styled.div`
  text-align: center;
  color: ${props => props.theme.colors.text.secondary};
  font-size: 0.875rem;
  line-height: 1.5;
  max-width: 600px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const steps = [
  {
    number: 1,
    label: 'Staff Schedule',
    path: 'staff-schedule',
    description: ''
  },
  {
    number: 2,
    label: 'Case Assignments',
    path: 'or-schedule',
    description: ''
  }
];

export const StepperNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the current path from the hash
  const currentPath = location.hash.slice(2);  // Remove '#/'

  const currentStep = steps.findIndex(step => step.path === currentPath) + 1;

  return (
    <StepperContainer>
      <Steps>
        {steps.map((step) => {
          const isActive = step.path === currentPath;
          
          return (
            <Step 
              key={step.number}
              onClick={() => navigate(`/${step.path}`)}
              $active={isActive}
            >
              <StepNumber $active={isActive}>
                {step.number}
              </StepNumber>
              <StepLabel $active={isActive}>
                {step.label}
              </StepLabel>
            </Step>
          );
        })}
      </Steps>
      <StepDescription>
        {steps[currentStep - 1]?.description}
      </StepDescription>
    </StepperContainer>
  );
}; 