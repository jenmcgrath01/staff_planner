import React from 'react';
import styled from 'styled-components';

const LayoutContainer = styled.div`
  min-height: 100vh;  // Full viewport height
  display: flex;
  flex-direction: column;
  width: 100%;  // Ensure full width
`;

const ContentContainer = styled.main`
  flex: 1;
  padding: 2rem;
  width: 100%;  // Ensure full width
  background: ${props => props.theme.colors.background.main};

  h1, h2 {
    margin-top: 0;  // Remove top margin from headings
    color: ${props => props.theme.colors.text.primary};
  }
`;

export const PageLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <LayoutContainer>
      <ContentContainer>
        {children}
      </ContentContainer>
    </LayoutContainer>
  );
}; 