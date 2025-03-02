import React from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';

const StepperContainer = styled.div`
  width: 100%;
  margin: 2rem 0;  // Increase top margin
`;

const Steps = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  margin-bottom: 1rem;
  padding: 0 2rem;
  max-width: 800px;
  margin: 0 auto;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 2rem;
    right: 2rem;
    height: 2px;
    background: #E5E7EB;
    z-index: 0;
  }
`;

const Step = styled.div<{ $active?: boolean; $completed?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 1;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

const StepNumber = styled.div<{ $active?: boolean; $completed?: boolean }>`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${props => props.$active 
    ? 'white'  // Active step: white background
    : props.$completed 
      ? '#F3F4F6'  // Completed step: light gray background
      : '#E5E7EB'  // Inactive step: slightly darker gray
  };
  color: ${props => props.$active
    ? props.theme.colors.primary  // Active step: primary color text
    : props.$completed
      ? props.theme.colors.text.secondary  // Completed step: secondary text
      : '#6B7280'  // Inactive step: gray text
  };
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  margin-bottom: 0.5rem;
  border: 2px solid ${props => props.$active 
    ? props.theme.colors.primary  // Active step: primary color border
    : props.$completed
      ? props.theme.colors.text.secondary  // Completed step: secondary border
      : '#E5E7EB'  // Inactive step: light gray border
  };
  box-shadow: ${props => props.$active 
    ? '0 2px 4px rgba(0, 0, 0, 0.1)' 
    : 'none'
  };

  /* Add checkmark for completed steps */
  ${props => props.$completed && `
    &::after {
      content: '✓';
      font-size: 0.875rem;
    }
  `}
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
    path: '/staff-schedule',
    description: ''
  },
  {
    number: 2,
    label: 'OR Assignments',
    path: '/or-schedule',
    description: ''
  }
];

export const StepperNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentStep = steps.findIndex(step => step.path === location.pathname) + 1;

  return (
    <StepperContainer>
      <Steps>
        {steps.map((step, index) => (
          <Step 
            key={step.number}
            onClick={() => navigate(step.path)}
            $active={currentStep === step.number}
          >
            <StepNumber 
              $active={currentStep === step.number}
              $completed={currentStep > step.number}
            >
              {step.number}
            </StepNumber>
            <StepLabel $active={currentStep === step.number}>
              {step.label}
            </StepLabel>
          </Step>
        ))}
      </Steps>
      <StepDescription>
        {steps[currentStep - 1]?.description}
      </StepDescription>
    </StepperContainer>
  );
}; 