import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const glitchAnimation = keyframes`
  0% {
    clip: rect(42px, 9999px, 44px, 0);
    transform: skew(0.85deg);
  }
  5% {
    clip: rect(12px, 9999px, 59px, 0);
    transform: skew(0.4deg);
  }
  10% {
    clip: rect(48px, 9999px, 29px, 0);
    transform: skew(0.7deg);
  }
  15% {
    clip: rect(42px, 9999px, 73px, 0);
    transform: skew(0.1deg);
  }
  20% {
    clip: rect(63px, 9999px, 27px, 0);
    transform: skew(0.3deg);
  }
  25% {
    clip: rect(34px, 9999px, 55px, 0);
    transform: skew(0.9deg);
  }
  30% {
    clip: rect(86px, 9999px, 73px, 0);
    transform: skew(0.5deg);
  }
  35% {
    clip: rect(20px, 9999px, 20px, 0);
    transform: skew(0.7deg);
  }
  40% {
    clip: rect(26px, 9999px, 60px, 0);
    transform: skew(0.35deg);
  }
  45% {
    clip: rect(25px, 9999px, 66px, 0);
    transform: skew(0.8deg);
  }
  50% {
    clip: rect(57px, 9999px, 98px, 0);
    transform: skew(0.2deg);
  }
  55% {
    clip: rect(5px, 9999px, 46px, 0);
    transform: skew(0.9deg);
  }
  60% {
    clip: rect(82px, 9999px, 31px, 0);
    transform: skew(0.6deg);
  }
  65% {
    clip: rect(54px, 9999px, 27px, 0);
    transform: skew(0.4deg);
  }
  70% {
    clip: rect(28px, 9999px, 99px, 0);
    transform: skew(0.3deg);
  }
  75% {
    clip: rect(5px, 9999px, 73px, 0);
    transform: skew(0.7deg);
  }
  80% {
    clip: rect(84px, 9999px, 5px, 0);
    transform: skew(0.1deg);
  }
  85% {
    clip: rect(28px, 9999px, 84px, 0);
    transform: skew(0.8deg);
  }
  90% {
    clip: rect(92px, 9999px, 70px, 0);
    transform: skew(0.4deg);
  }
  95% {
    clip: rect(35px, 9999px, 25px, 0);
    transform: skew(0.6deg);
  }
  100% {
    clip: rect(71px, 9999px, 44px, 0);
    transform: skew(0.5deg);
  }
`;

const scanlines = keyframes`
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 0 100vh;
  }
`;

const GlitchOverlay = styled.div<{ isActive: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9998;
  opacity: ${props => props.isActive ? 0.1 : 0};
  transition: opacity 0.3s ease;
  
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
        rgba(255, 0, 0, 0.03) 2px,
        rgba(255, 0, 0, 0.03) 4px
      );
    animation: ${scanlines} 0.1s linear infinite;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(120, 219, 226, 0.02);
    animation: ${glitchAnimation} 0.3s infinite linear alternate-reverse;
  }
`;

const NoiseOverlay = styled.div<{ isActive: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9997;
  opacity: ${props => props.isActive ? 0.02 : 0};
  transition: opacity 0.3s ease;
  background: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
`;

const GlitchEffect: React.FC = () => {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const triggerGlitch = () => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 500);
    };

    // Random glitch effects
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        triggerGlitch();
      }
    }, 5000);

    // Glitch on page interactions
    const handleInteraction = () => {
      if (Math.random() > 0.8) {
        triggerGlitch();
      }
    };

    document.addEventListener('click', handleInteraction);
    document.addEventListener('keydown', handleInteraction);

    return () => {
      clearInterval(glitchInterval);
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
    };
  }, []);

  return (
    <>
      <GlitchOverlay isActive={isGlitching} />
      <NoiseOverlay isActive={isGlitching} />
    </>
  );
};

export default GlitchEffect;
