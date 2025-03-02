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

export const SurgeonTools = () => {
  return (
    <PageLayout>
      <PlaceholderText>
        This is where surgeons go to see information about the staffing for their cases, 
        queue up a video/backtable, etc.
      </PlaceholderText>
    </PageLayout>
  );
}; 