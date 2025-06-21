import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const HomeContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  padding-top: 6rem;
  text-align: center;
`;

const Title = styled(motion.h1)`
  font-size: 4rem;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, ${props => props.theme.colors.accent.cyan}, ${props => props.theme.colors.accent.blue});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled(motion.p)`
  font-size: 1.5rem;
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: 2rem;
  max-width: 600px;
`;

const CTAButton = styled(motion.button)`
  background: linear-gradient(135deg, ${props => props.theme.colors.accent.cyan}, ${props => props.theme.colors.accent.blue});
  color: ${props => props.theme.colors.background.primary};
  border: none;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  margin: 0.5rem;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(120, 219, 226, 0.3);
  }
`;

const Home: React.FC = () => {
  return (
    <HomeContainer>
      <Title
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        🔒 CYBERSEC PORTFOLIO
      </Title>
      
      <Subtitle
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        Advanced cybersecurity professional specializing in red team operations, 
        penetration testing, and security research.
      </Subtitle>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <CTAButton
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.href = '/terminal'}
        >
          Launch Terminal
        </CTAButton>
        
        <CTAButton
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.href = '/projects'}
        >
          View Projects
        </CTAButton>
      </motion.div>
    </HomeContainer>
  );
};

export default Home;
