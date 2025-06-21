import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import { AnimatePresence } from 'framer-motion';

// Components
import Navigation from './components/Navigation/Navigation';
import Loading from './components/Loading/Loading';
import MatrixRain from './components/Effects/MatrixRain';
import GlitchEffect from './components/Effects/GlitchEffect';

// Pages
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Skills from './pages/Skills/Skills';
import Projects from './pages/Projects/Projects';
import Blog from './pages/Blog/Blog';
import Terminal from './pages/Terminal/Terminal';
import Contact from './pages/Contact/Contact';

// Admin Pages
import AdminLogin from './pages/Admin/Login';
import AdminDashboard from './pages/Admin/Dashboard';
import ContentManager from './pages/Admin/ContentManager';

// Theme
import { watchDogsTheme } from './styles/theme';

// Global Styles
const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    font-family: 'JetBrains Mono', monospace;
    background: ${props => props.theme.colors.background.primary};
    color: ${props => props.theme.colors.text.primary};
    overflow-x: hidden;
    position: relative;
    
    /* Cyberpunk noise overlay */
    &::before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: 
        radial-gradient(circle at 20% 80%, rgba(120, 219, 226, 0.02) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(255, 107, 107, 0.02) 0%, transparent 50%),
        radial-gradient(circle at 40% 40%, rgba(78, 205, 196, 0.01) 0%, transparent 50%);
      pointer-events: none;
      z-index: -1;
    }

    /* Custom scrollbar */
    &::-webkit-scrollbar {
      width: 8px;
    }

    &::-webkit-scrollbar-track {
      background: ${props => props.theme.colors.background.secondary};
    }

    &::-webkit-scrollbar-thumb {
      background: ${props => props.theme.colors.accent.cyan};
      border-radius: 4px;
      
      &:hover {
        background: ${props => props.theme.colors.accent.blue};
      }
    }
  }

  /* Selection styling */
  ::selection {
    background: ${props => props.theme.colors.accent.cyan};
    color: ${props => props.theme.colors.background.primary};
  }

  ::-moz-selection {
    background: ${props => props.theme.colors.accent.cyan};
    color: ${props => props.theme.colors.background.primary};
  }

  /* Typography */
  h1, h2, h3, h4, h5, h6 {
    font-family: 'Orbitron', monospace;
    font-weight: 600;
    line-height: 1.2;
  }

  h1 {
    font-size: clamp(2rem, 5vw, 4rem);
    font-weight: 800;
  }

  h2 {
    font-size: clamp(1.5rem, 4vw, 2.5rem);
    font-weight: 700;
  }

  h3 {
    font-size: clamp(1.25rem, 3vw, 2rem);
    font-weight: 600;
  }

  p {
    line-height: 1.6;
    font-size: 1rem;
  }

  code {
    font-family: 'JetBrains Mono', monospace;
    background: ${props => props.theme.colors.background.secondary};
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.9em;
  }

  pre {
    font-family: 'JetBrains Mono', monospace;
    background: ${props => props.theme.colors.background.secondary};
    padding: 1rem;
    border-radius: 8px;
    overflow-x: auto;
    border-left: 4px solid ${props => props.theme.colors.accent.cyan};
  }

  /* Links */
  a {
    color: ${props => props.theme.colors.accent.cyan};
    text-decoration: none;
    transition: all 0.2s ease;
    
    &:hover {
      color: ${props => props.theme.colors.accent.blue};
      text-shadow: 0 0 8px ${props => props.theme.colors.accent.blue};
    }
  }

  /* Button base styles */
  button {
    font-family: 'JetBrains Mono', monospace;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  /* Input base styles */
  input, textarea {
    font-family: 'JetBrains Mono', monospace;
    background: ${props => props.theme.colors.background.secondary};
    border: 1px solid ${props => props.theme.colors.accent.cyan}40;
    color: ${props => props.theme.colors.text.primary};
    border-radius: 4px;
    padding: 0.75rem;
    transition: all 0.2s ease;
    
    &:focus {
      outline: none;
      border-color: ${props => props.theme.colors.accent.cyan};
      box-shadow: 0 0 12px ${props => props.theme.colors.accent.cyan}40;
    }
    
    &::placeholder {
      color: ${props => props.theme.colors.text.secondary};
    }
  }

  /* Hide scrollbar for specific elements */
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
    
    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

const AppContainer = styled.div`
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
  position: relative;
  z-index: 1;
`;

const BackgroundEffects = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
`;

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showEffects, setShowEffects] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Performance optimization - disable effects on mobile
    const handleResize = () => {
      setShowEffects(window.innerWidth > 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <ThemeProvider theme={watchDogsTheme}>
      <GlobalStyle />
      <Router>
        <AppContainer>
          <AnimatePresence mode="wait">
            {isLoading ? (
              <Loading key="loading" />
            ) : (
              <>
                {showEffects && (
                  <BackgroundEffects>
                    <MatrixRain />
                  </BackgroundEffects>
                )}
                
                <Navigation />
                
                <MainContent>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/skills" element={<Skills />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/terminal" element={<Terminal />} />
                    <Route path="/contact" element={<Contact />} />
                    
                    {/* Admin Routes */}
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/content" element={<ContentManager />} />
                  </Routes>
                </MainContent>

                <GlitchEffect />
              </>
            )}
          </AnimatePresence>
        </AppContainer>
      </Router>
    </ThemeProvider>
  );
};

export default App;
