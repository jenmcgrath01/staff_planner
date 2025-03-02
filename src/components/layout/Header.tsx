import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';

const HeaderContainer = styled.header`
  background-color: ${props => props.theme.colors.background.main};
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: ${props => props.theme.spacing.md};
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(8px);
`;

const Nav = styled.nav`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text.primary};
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};

  img {
    height: 24px;
    width: auto;
  }
`;

const MenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  padding: ${props => props.theme.spacing.xs};
  cursor: pointer;
  font-size: 1.5rem;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: block;
  }
`;

const NavLinks = styled.div<{ $isOpen: boolean }>`
  display: flex;
  gap: 2.5rem;
  align-items: center;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: ${props => props.theme.colors.background.main};
    flex-direction: column;
    padding: ${props => props.$isOpen ? props.theme.spacing.lg : 0};
    gap: ${props => props.theme.spacing.md};
    max-height: ${props => props.$isOpen ? '300px' : '0'};
    overflow: hidden;
    transition: all 0.3s ease;
    box-shadow: ${props => props.$isOpen ? props.theme.shadows.md : 'none'};
  }
`;

const NavLink = styled(Link)<{ $active?: boolean }>`
  color: ${props => props.$active ? props.theme.colors.primary : props.theme.colors.text.secondary};
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: 500;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const ActionButton = styled(Link)`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
  border-radius: 0.375rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    width: 100%;
    text-align: center;
  }
`;

const Overlay = styled.div<{ $isOpen: boolean }>`
  display: none;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    opacity: ${props => props.$isOpen ? 1 : 0};
    visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
    transition: all 0.3s ease;
    z-index: 10;
  }
`;

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <HeaderContainer>
      <Nav>
        <Logo to="/" onClick={closeMenu}>
          <img src="/images/apella-logo.svg" alt="Apella Staff Planner" />
          Staff Planner
        </Logo>
        <MenuButton onClick={toggleMenu}>
          {isMenuOpen ? '×' : '≡'}
        </MenuButton>
        <NavLinks $isOpen={isMenuOpen}>
          <NavLink 
            to="/staff-schedule" 
            $active={location.pathname === '/staff-schedule' || location.pathname === '/'}
            onClick={closeMenu}
          >
            Staff Schedule
          </NavLink>
          <NavLink 
            to="/or-schedule"
            $active={location.pathname === '/or-schedule'}
            onClick={closeMenu}
          >
            OR Schedule
          </NavLink>
        </NavLinks>
      </Nav>
      <Overlay $isOpen={isMenuOpen} onClick={closeMenu} />
    </HeaderContainer>
  );
}; 