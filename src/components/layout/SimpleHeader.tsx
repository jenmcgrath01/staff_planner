import React from 'react';
import styled from 'styled-components';
import { MainNav } from './MainNav';

const HeaderContainer = styled.header`
  background: white;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
`;

const Logo = styled.img`
  height: 32px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 1.5rem;
  color: ${props => props.theme.colors.text.primary};
`;

export const SimpleHeader = () => {
  return (
    <HeaderContainer>
      <LogoSection>
        <Logo src="/images/apella-logo.svg" alt="Apella" />
        <Title>Surgical Team Navigator</Title>
      </LogoSection>
      <MainNav />
    </HeaderContainer>
  );
}; 