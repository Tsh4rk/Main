import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import axios from 'axios';

const LoginContainer = styled(motion.div)`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.theme.colors.background.primary};
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(0, 255, 65, 0.03) 2px,
        rgba(0, 255, 65, 0.03) 4px
      );
    pointer-events: none;
  }
`;

const LoginForm = styled(motion.form)`
  background: ${props => props.theme.colors.background.secondary};
  border: 2px solid ${props => props.theme.colors.accent.cyan};
  border-radius: 8px;
  padding: 3rem;
  max-width: 400px;
  width: 100%;
  margin: 2rem;
  box-shadow: 
    0 0 30px rgba(120, 219, 226, 0.3),
    inset 0 0 20px rgba(0, 0, 0, 0.5);
  position: relative;
  z-index: 1;
`;

const Title = styled.h1`
  color: ${props => props.theme.colors.accent.cyan};
  text-align: center;
  margin-bottom: 2rem;
  font-family: ${props => props.theme.fonts.heading};
  font-size: 1.8rem;
  text-shadow: 0 0 10px rgba(120, 219, 226, 0.5);
  
  &::before {
    content: '🔐 ';
    font-size: 1.5rem;
  }
`;

const InputGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  background: ${props => props.theme.colors.background.primary};
  border: 1px solid ${props => props.theme.colors.border.primary};
  border-radius: 4px;
  color: ${props => props.theme.colors.text.primary};
  font-family: ${props => props.theme.fonts.terminal};
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.accent.cyan};
    box-shadow: 0 0 10px rgba(120, 219, 226, 0.3);
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.text.tertiary};
  }
`;

const LoginButton = styled(motion.button)`
  width: 100%;
  padding: 0.75rem;
  background: linear-gradient(135deg, ${props => props.theme.colors.accent.cyan} 0%, ${props => props.theme.colors.accent.blue} 100%);
  border: none;
  border-radius: 4px;
  color: ${props => props.theme.colors.background.primary};
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(120, 219, 226, 0.4);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const ErrorMessage = styled.div`
  background: rgba(255, 107, 107, 0.1);
  border: 1px solid #ff6b6b;
  color: #ff6b6b;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  text-align: center;
`;

const SuccessMessage = styled.div`
  background: rgba(46, 204, 113, 0.1);
  border: 1px solid #2ecc71;
  color: #2ecc71;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  text-align: center;
`;

interface LoginProps {}

const Login: React.FC<LoginProps> = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('/api/auth/login', credentials);
      
      if (response.data.success) {
        // Store token and user info
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        setSuccess('Login successful! Redirecting...');
        
        // Redirect to admin dashboard
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 1000);
      } else {
        setError(response.data.message || 'Login failed');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setError(
        error.response?.data?.message || 
        'Login failed. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <LoginForm
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        onSubmit={handleSubmit}
      >
        <Title>ADMIN ACCESS</Title>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}
        
        <InputGroup>
          <Label htmlFor="username">Username / Email</Label>
          <Input
            type="text"
            id="username"
            name="username"
            value={credentials.username}
            onChange={handleInputChange}
            placeholder="Enter username or email"
            required
            disabled={loading}
          />
        </InputGroup>
        
        <InputGroup>
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            id="password"
            name="password"
            value={credentials.password}
            onChange={handleInputChange}
            placeholder="Enter password"
            required
            disabled={loading}
          />
        </InputGroup>
        
        <LoginButton
          type="submit"
          disabled={loading || !credentials.username || !credentials.password}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? 'AUTHENTICATING...' : 'LOGIN'}
        </LoginButton>
      </LoginForm>
    </LoginContainer>
  );
};

export default Login;
