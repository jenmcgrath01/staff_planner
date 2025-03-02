import styled from 'styled-components';
import { theme } from '../theme/theme';
import { Link } from 'react-router-dom';

type Theme = typeof theme;

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${props => props.theme.colors.background.primary};
  padding: ${props => props.theme.spacing.md};
`;

const Logo = styled.h1`
  font-size: 1.5rem;
  color: ${props => props.theme.colors.text.primary};
`;

const Nav = styled.nav`
  display: flex;
`;

const NavLink = styled(Link)`
  color: ${props => props.theme.colors.text.secondary};
  text-decoration: none;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.sm};
  
  &:hover {
    background-color: ${props => props.theme.colors.background.secondary};
    color: ${props => props.theme.colors.text.primary};
  }
`;

export const Header = () => {
  return (
    <HeaderContainer>
      <Logo>
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          Staff Planner
        </Link>
      </Logo>
      <Nav>
        <NavLink to="/roster">Staff Roster</NavLink>
        <NavLink to="/schedule">Schedule</NavLink>
        <NavLink to="/assignments">Assignments</NavLink>
      </Nav>
    </HeaderContainer>
  );
};
