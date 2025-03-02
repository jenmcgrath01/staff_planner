import React from 'react';
import styled from 'styled-components';

const PageContainer = styled.div`
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  padding: 0 2rem;
  box-sizing: border-box;
`;

interface PageLayoutProps {
  children: React.ReactNode;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  return <PageContainer>{children}</PageContainer>;
}; 