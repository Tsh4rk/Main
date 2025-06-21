import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

const Container = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.colors.background.primary};
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${props => props.theme.colors.border.primary};
`;

const Title = styled.h1`
  color: ${props => props.theme.colors.accent.cyan};
  font-family: ${props => props.theme.fonts.heading};
  font-size: 2rem;
`;

const BackButton = styled.button`
  background: ${props => props.theme.colors.background.secondary};
  border: 1px solid ${props => props.theme.colors.border.primary};
  border-radius: 4px;
  color: ${props => props.theme.colors.text.primary};
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${props => props.theme.colors.accent.cyan};
    color: ${props => props.theme.colors.accent.cyan};
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  background: ${props => props.variant === 'primary' 
    ? `linear-gradient(135deg, ${props.theme.colors.accent.cyan}, ${props.theme.colors.accent.blue})`
    : props.theme.colors.background.secondary
  };
  border: 1px solid ${props => props.variant === 'primary' 
    ? 'transparent' 
    : props.theme.colors.border.primary
  };
  border-radius: 4px;
  color: ${props => props.variant === 'primary' 
    ? props.theme.colors.background.primary 
    : props.theme.colors.text.primary
  };
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px ${props => props.variant === 'primary' 
      ? 'rgba(120, 219, 226, 0.4)' 
      : 'rgba(0, 0, 0, 0.1)'
    };
  }
`;

const ContentList = styled.div`
  background: ${props => props.theme.colors.background.secondary};
  border: 1px solid ${props => props.theme.colors.border.primary};
  border-radius: 8px;
  overflow: hidden;
`;

const ContentItem = styled.div`
  display: grid;
  grid-template-columns: 1fr 150px 120px 100px 150px;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid ${props => props.theme.colors.border.primary};
  align-items: center;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background: ${props => props.theme.colors.background.primary};
  }
`;

const ContentHeader = styled(ContentItem)`
  background: ${props => props.theme.colors.background.primary};
  font-weight: 600;
  color: ${props => props.theme.colors.text.primary};
  border-bottom: 2px solid ${props => props.theme.colors.border.primary};
  
  &:hover {
    background: ${props => props.theme.colors.background.primary};
  }
`;

const ContentTitle = styled.div`
  color: ${props => props.theme.colors.text.primary};
  font-weight: 500;
`;

const ContentKey = styled.div`
  color: ${props => props.theme.colors.text.secondary};
  font-family: ${props => props.theme.fonts.terminal};
  font-size: 0.9rem;
`;

const ContentCategory = styled.div<{ category: string }>`
  background: ${props => {
    switch (props.category) {
      case 'home': return 'rgba(52, 152, 219, 0.2)';
      case 'about': return 'rgba(46, 204, 113, 0.2)';
      case 'skills': return 'rgba(155, 89, 182, 0.2)';
      case 'projects': return 'rgba(241, 196, 15, 0.2)';
      case 'blog': return 'rgba(230, 126, 34, 0.2)';
      case 'contact': return 'rgba(231, 76, 60, 0.2)';
      default: return 'rgba(149, 165, 166, 0.2)';
    }
  }};
  color: ${props => {
    switch (props.category) {
      case 'home': return '#3498db';
      case 'about': return '#2ecc71';
      case 'skills': return '#9b59b6';
      case 'projects': return '#f1c40f';
      case 'blog': return '#e67e22';
      case 'contact': return '#e74c3c';
      default: return '#95a5a6';
    }
  }};
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  text-align: center;
  text-transform: capitalize;
`;

const StatusBadge = styled.div<{ published: boolean }>`
  background: ${props => props.published ? 'rgba(46, 204, 113, 0.2)' : 'rgba(149, 165, 166, 0.2)'};
  color: ${props => props.published ? '#2ecc71' : '#95a5a6'};
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  text-align: center;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const SmallButton = styled.button<{ variant?: 'edit' | 'delete' }>`
  background: ${props => {
    switch (props.variant) {
      case 'edit': return 'rgba(52, 152, 219, 0.2)';
      case 'delete': return 'rgba(231, 76, 60, 0.2)';
      default: return 'rgba(149, 165, 166, 0.2)';
    }
  }};
  color: ${props => {
    switch (props.variant) {
      case 'edit': return '#3498db';
      case 'delete': return '#e74c3c';
      default: return '#95a5a6';
    }
  }};
  border: none;
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.2s ease;
  
  &:hover {
    opacity: 0.8;
    transform: scale(1.05);
  }
`;

interface ContentItemType {
  _id: string;
  key: string;
  title: string;
  content: any;
  contentType: string;
  category: string;
  isPublished: boolean;
  lastModified: string;
  modifiedBy?: {
    username: string;
  };
}

const ContentManager: React.FC = () => {
  const [content, setContent] = useState<ContentItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchContent = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/admin/content', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setContent(response.data.data.content);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this content?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/admin/content/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Refresh the content list
      fetchContent();
    } catch (error) {
      console.error('Error deleting content:', error);
      alert('Failed to delete content');
    }
  };

  if (loading) {
    return (
      <Container>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '50vh',
          color: '#78dbe2'
        }}>
          Loading content...
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>📝 Content Manager</Title>
        <BackButton onClick={() => navigate('/admin/dashboard')}>
          ← Back to Dashboard
        </BackButton>
      </Header>

      <Actions>
        <ActionButton 
          variant="primary"
          onClick={() => navigate('/admin/content/new')}
        >
          + Add New Content
        </ActionButton>
        <ActionButton onClick={() => fetchContent()}>
          🔄 Refresh
        </ActionButton>
      </Actions>

      <ContentList>
        <ContentHeader>
          <div>Title / Key</div>
          <div>Category</div>
          <div>Type</div>
          <div>Status</div>
          <div>Actions</div>
        </ContentHeader>
        
        {content.map((item) => (
          <ContentItem key={item._id}>
            <div>
              <ContentTitle>{item.title}</ContentTitle>
              <ContentKey>{item.key}</ContentKey>
            </div>
            <ContentCategory category={item.category}>
              {item.category}
            </ContentCategory>
            <div style={{ color: '#95a5a6', fontSize: '0.9rem' }}>
              {item.contentType}
            </div>
            <StatusBadge published={item.isPublished}>
              {item.isPublished ? 'Published' : 'Draft'}
            </StatusBadge>
            <ActionButtons>
              <SmallButton 
                variant="edit"
                onClick={() => navigate(`/admin/content/edit/${item._id}`)}
              >
                Edit
              </SmallButton>
              <SmallButton 
                variant="delete"
                onClick={() => handleDelete(item._id)}
              >
                Delete
              </SmallButton>
            </ActionButtons>
          </ContentItem>
        ))}
        
        {content.length === 0 && (
          <div style={{ 
            padding: '3rem', 
            textAlign: 'center', 
            color: '#95a5a6' 
          }}>
            No content found. Click "Add New Content" to get started.
          </div>
        )}
      </ContentList>
    </Container>
  );
};

export default ContentManager;
