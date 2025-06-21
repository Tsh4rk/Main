import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import axios from 'axios';

const DashboardContainer = styled.div`
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
  
  &::before {
    content: '🛡️ ';
    font-size: 1.5rem;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: ${props => props.theme.colors.text.primary};
`;

const LogoutButton = styled.button`
  background: linear-gradient(135deg, #ff4757, #ff3742);
  border: none;
  border-radius: 4px;
  color: white;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(255, 71, 87, 0.4);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled(motion.div)`
  background: ${props => props.theme.colors.background.secondary};
  border: 1px solid ${props => props.theme.colors.border.primary};
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const StatTitle = styled.h3`
  color: ${props => props.theme.colors.text.secondary};
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const StatValue = styled.div`
  color: ${props => props.theme.colors.accent.cyan};
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const StatChange = styled.div<{ positive?: boolean }>`
  color: ${props => props.positive ? '#2ecc71' : '#e74c3c'};
  font-size: 0.8rem;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Panel = styled.div`
  background: ${props => props.theme.colors.background.secondary};
  border: 1px solid ${props => props.theme.colors.border.primary};
  border-radius: 8px;
  padding: 1.5rem;
`;

const PanelTitle = styled.h2`
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: 1rem;
  font-size: 1.2rem;
`;

const QuickActions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const ActionButton = styled(motion.button)`
  background: linear-gradient(135deg, ${props => props.theme.colors.accent.cyan}, ${props => props.theme.colors.accent.blue});
  border: none;
  border-radius: 6px;
  color: ${props => props.theme.colors.background.primary};
  padding: 1rem;
  cursor: pointer;
  font-weight: 600;
  text-align: left;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(120, 219, 226, 0.4);
  }
`;

const ActivityList = styled.div`
  max-height: 300px;
  overflow-y: auto;
`;

const ActivityItem = styled.div`
  padding: 0.75rem 0;
  border-bottom: 1px solid ${props => props.theme.colors.border.primary};
  
  &:last-child {
    border-bottom: none;
  }
`;

const ActivityType = styled.span<{ type: string }>`
  background: ${props => {
    switch (props.type) {
      case 'content_update': return 'rgba(52, 152, 219, 0.2)';
      case 'user_login': return 'rgba(46, 204, 113, 0.2)';
      case 'error': return 'rgba(231, 76, 60, 0.2)';
      default: return 'rgba(149, 165, 166, 0.2)';
    }
  }};
  color: ${props => {
    switch (props.type) {
      case 'content_update': return '#3498db';
      case 'user_login': return '#2ecc71';
      case 'error': return '#e74c3c';
      default: return '#95a5a6';
    }
  }};
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: uppercase;
`;

const ActivityText = styled.div`
  color: ${props => props.theme.colors.text.primary};
  margin: 0.5rem 0;
`;

const ActivityTime = styled.div`
  color: ${props => props.theme.colors.text.tertiary};
  font-size: 0.8rem;
`;

interface DashboardData {
  stats: {
    totalContent: number;
    totalUsers: number;
    totalProjects: number;
    totalBlogs: number;
    terminalSessions: number;
    uniqueVisitors: number;
  };
  recentActivity: Array<{
    type: string;
    action: string;
    timestamp: string;
    user: string;
  }>;
  systemStatus: {
    server: string;
    database: string;
    lastBackup: string;
  };
}

const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/admin/login');
  }, [navigate]);

  const fetchDashboardData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/admin/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setDashboardData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // If token is invalid, redirect to login
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  }, [handleLogout]);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      navigate('/admin/login');
      return;
    }

    setUser(JSON.parse(userData));
    fetchDashboardData();
  }, [navigate, fetchDashboardData]);


  if (loading) {
    return (
      <DashboardContainer>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '50vh',
          color: '#78dbe2'
        }}>
          Loading dashboard...
        </div>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <Header>
        <Title>Admin Dashboard</Title>
        <UserInfo>
          <span>Welcome, {user?.username}</span>
          <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
        </UserInfo>
      </Header>

      <QuickActions>
        <ActionButton
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/admin/content')}
        >
          📝 Manage Content
        </ActionButton>
        <ActionButton
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/admin/users')}
        >
          👥 Manage Users
        </ActionButton>
        <ActionButton
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/admin/projects')}
        >
          🚀 Manage Projects
        </ActionButton>
        <ActionButton
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/admin/logs')}
        >
          📊 View Logs
        </ActionButton>
      </QuickActions>

      {dashboardData && (
        <>
          <StatsGrid>
            <StatCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <StatTitle>Total Content</StatTitle>
              <StatValue>{dashboardData.stats.totalContent}</StatValue>
              <StatChange positive>📈 Content items</StatChange>
            </StatCard>
            
            <StatCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <StatTitle>Users</StatTitle>
              <StatValue>{dashboardData.stats.totalUsers}</StatValue>
              <StatChange positive>👥 Registered users</StatChange>
            </StatCard>
            
            <StatCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <StatTitle>Terminal Sessions</StatTitle>
              <StatValue>{dashboardData.stats.terminalSessions}</StatValue>
              <StatChange positive>🖥️ Active sessions</StatChange>
            </StatCard>
            
            <StatCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <StatTitle>Unique Visitors</StatTitle>
              <StatValue>{dashboardData.stats.uniqueVisitors}</StatValue>
              <StatChange positive>📊 This month</StatChange>
            </StatCard>
          </StatsGrid>

          <ContentGrid>
            <Panel>
              <PanelTitle>Recent Activity</PanelTitle>
              <ActivityList>
                {dashboardData.recentActivity.map((activity, index) => (
                  <ActivityItem key={index}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <ActivityType type={activity.type}>
                        {activity.type.replace('_', ' ')}
                      </ActivityType>
                      <ActivityTime>
                        {new Date(activity.timestamp).toLocaleString()}
                      </ActivityTime>
                    </div>
                    <ActivityText>{activity.action}</ActivityText>
                    <div style={{ color: '#95a5a6', fontSize: '0.8rem' }}>
                      by {activity.user}
                    </div>
                  </ActivityItem>
                ))}
              </ActivityList>
            </Panel>

            <Panel>
              <PanelTitle>System Status</PanelTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Server Status:</span>
                  <span style={{ 
                    color: dashboardData.systemStatus.server === 'online' ? '#2ecc71' : '#e74c3c',
                    fontWeight: 'bold'
                  }}>
                    {dashboardData.systemStatus.server.toUpperCase()}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Database:</span>
                  <span style={{ 
                    color: dashboardData.systemStatus.database === 'connected' ? '#2ecc71' : '#e74c3c',
                    fontWeight: 'bold'
                  }}>
                    {dashboardData.systemStatus.database.toUpperCase()}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Last Backup:</span>
                  <span style={{ color: '#95a5a6', fontSize: '0.9rem' }}>
                    {new Date(dashboardData.systemStatus.lastBackup).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Panel>
          </ContentGrid>
        </>
      )}
    </DashboardContainer>
  );
};

export default Dashboard;
