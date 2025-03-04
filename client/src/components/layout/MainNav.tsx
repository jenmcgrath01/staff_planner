import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import type { IconBaseProps } from 'react-icons';
import { IconType } from 'react-icons';

const NavContainer = styled.nav`
  position: relative;
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  color: ${props => props.theme.colors.text.secondary};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;

  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const NavList = styled.ul<{ $isOpen: boolean }>`
  list-style: none;
  margin: 0;
  padding: 0.5rem 0;
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-width: 200px;
  display: ${props => props.$isOpen ? 'block' : 'none'};
  z-index: 1000;
`;

const NavItem = styled.li<{ $active: boolean }>`
  a {
    color: ${props => props.$active ? props.theme.colors.primary : props.theme.colors.text.secondary};
    text-decoration: none;
    font-weight: ${props => props.$active ? '600' : '500'};
    padding: 0.75rem 1rem;
    display: block;

    &:hover {
      background: ${props => props.theme.colors.background.main};
      color: ${props => props.theme.colors.primary};
    }
  }
`;

const MenuIcon = () => {
  return React.createElement(FaBars, { size: 16 });
};

export const MainNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const path = location.pathname;

  const isActive = (route: string) => {
    if (route === '/staff-schedule') {
      return path === '/staff-schedule' || path === '/or-schedule';
    }
    return path === route;
  };

  return (
    <NavContainer>
      <MenuButton onClick={() => setIsOpen(!isOpen)}>
        <MenuIcon />
        Menu
      </MenuButton>
      <NavList $isOpen={isOpen}>
        <NavItem $active={isActive('/staff-schedule')}>
          <Link to="/staff-schedule" onClick={() => setIsOpen(false)}>
            Manager/Charge Tools
          </Link>
        </NavItem>
        <NavItem $active={isActive('/staff')}>
          <Link to="/staff" onClick={() => setIsOpen(false)}>
            Staff Tools
          </Link>
        </NavItem>
        <NavItem $active={isActive('/surgeon')}>
          <Link to="/surgeon" onClick={() => setIsOpen(false)}>
            Surgeon Tools
          </Link>
        </NavItem>
      </NavList>
    </NavContainer>
  );
}; 