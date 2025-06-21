import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const Nav = styled(motion.nav)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: ${props => props.theme.colors.background.primary}cc;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid ${props => props.theme.colors.accent.cyan}40;
  padding: 1rem 2rem;
`;

const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  font-family: ${props => props.theme.fonts.heading};
  font-size: 1.5rem;
  font-weight: 800;
  color: ${props => props.theme.colors.accent.cyan};
  text-decoration: none;
  
  &::before {
    content: '🔒 ';
  }
`;

const NavLinks = styled.ul`
  display: flex;
  list-style: none;
  gap: 2rem;
  margin: 0;
  padding: 0;
`;

const NavLink = styled(Link)<{ isActive: boolean }>`
  color: ${props => props.isActive ? props.theme.colors.accent.cyan : props.theme.colors.text.primary};
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.2s ease;
  
  &:hover {
    color: ${props => props.theme.colors.accent.cyan};
    background: ${props => props.theme.colors.accent.cyan}10;
    text-shadow: 0 0 8px ${props => props.theme.colors.accent.cyan};
  }
`;

const Navigation: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/skills', label: 'Skills' },
    { path: '/projects', label: 'Projects' },
    { path: '/blog', label: 'Blog' },
    { path: '/terminal', label: 'Terminal' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <Nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <NavContainer>
        <Logo to="/">CYBERSEC</Logo>
        <NavLinks>
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                isActive={location.pathname === item.path}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </NavLinks>
      </NavContainer>
    </Nav>
  );
};

export default Navigation;
