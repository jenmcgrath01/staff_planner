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
      <h2>Personalized Surgeon Tools</h2>
      <PlaceholderText>
        This is where surgeons go to see information about the staffing for their cases.

        Other features that mighb be here: review stats, view room, etc.
      </PlaceholderText>
    </PageLayout>
  );
}; 