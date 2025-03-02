import React from 'react';
import styled from 'styled-components';
import { PageLayout } from '../layout/PageLayout';

const PlaceholderText = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${props => props.theme.colors.text.secondary};
  font-size: 1.125rem;
  line-height: 1.5;
`;

export const StaffTools = () => {
  return (
    <PageLayout>
      <h2>Personalized Staff Tools</h2>
      <PlaceholderText>
        This is where staff (RN, CRNA, etc.)could go to see info about their assignments.
        
        Features that might be here: sign up for change notifications, etc.
      </PlaceholderText>
    </PageLayout>
  );
}; 