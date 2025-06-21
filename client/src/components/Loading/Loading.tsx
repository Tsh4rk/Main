import React from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

const glitch = keyframes`
  0% { transform: translate(0); }
  20% { transform: translate(-2px, 2px); }
  40% { transform: translate(-2px, -2px); }
  60% { transform: translate(2px, 2px); }
  80% { transform: translate(2px, -2px); }
  100% { transform: translate(0); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
`;

const scan = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100vw); }
`;

const LoadingContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${props => props.theme.colors.background.primary};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(120, 219, 226, 0.03) 2px,
        rgba(120, 219, 226, 0.03) 4px
      );
    pointer-events: none;
  }
`;

const LoadingTitle = styled.h1`
  font-family: ${props => props.theme.fonts.heading};
  font-size: 3rem;
  color: ${props => props.theme.colors.accent.cyan};
  margin-bottom: 2rem;
  animation: ${glitch} 2s infinite;
  text-shadow: 
    0 0 20px ${props => props.theme.colors.accent.cyan},
    2px 2px 0 ${props => props.theme.colors.accent.red},
    -2px -2px 0 ${props => props.theme.colors.accent.blue};
    
  &::before {
    content: '🔒 ';
    font-size: 0.8em;
  }
`;

const LoadingSubtitle = styled.p`
  color: ${props => props.theme.colors.text.secondary};
  font-size: 1.2rem;
  margin-bottom: 3rem;
  animation: ${pulse} 2s infinite;
`;

const ProgressContainer = styled.div`
  width: 400px;
  height: 6px;
  background: ${props => props.theme.colors.background.secondary};
  border-radius: 3px;
  overflow: hidden;
  position: relative;
  border: 1px solid ${props => props.theme.colors.accent.cyan}40;
`;

const ProgressBar = styled.div`
  height: 100%;
  background: linear-gradient(90deg, 
    ${props => props.theme.colors.accent.cyan}, 
    ${props => props.theme.colors.accent.blue}
  );
  border-radius: 3px;
  animation: loading 3s ease-in-out;
  
  @keyframes loading {
    0% { width: 0%; }
    100% { width: 100%; }
  }
`;

const ScanLine = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 2px;
  height: 100%;
  background: ${props => props.theme.colors.accent.cyan};
  box-shadow: 0 0 10px ${props => props.theme.colors.accent.cyan};
  animation: ${scan} 2s linear infinite;
`;

const StatusText = styled.div`
  position: absolute;
  bottom: 4rem;
  font-family: ${props => props.theme.fonts.terminal};
  color: ${props => props.theme.colors.terminal.text};
  font-size: 0.9rem;
  animation: ${pulse} 1.5s infinite;
`;

const Loading: React.FC = () => {
  return (
    <LoadingContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <LoadingTitle>CYBERSEC PORTFOLIO</LoadingTitle>
      <LoadingSubtitle>Initializing Secure Connection...</LoadingSubtitle>
      
      <ProgressContainer>
        <ProgressBar />
        <ScanLine />
      </ProgressContainer>
      
      <StatusText>
        Loading security modules...
      </StatusText>
    </LoadingContainer>
  );
};

export default Loading;
