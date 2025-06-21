import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  min-height: 100vh;
  padding: 6rem 2rem 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Blog: React.FC = () => {
  return (
    <Container>
      <h1>📝 Blog - Coming Soon</h1>
    </Container>
  );
};

export default Blog;
