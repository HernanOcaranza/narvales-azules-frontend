import React from 'react';
import { Layout, Menu, theme } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  CreditCardOutlined,
  DollarOutlined,
  BookOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';

const { Header, Content, Sider } = Layout;

function MainLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const menuItems = [
    {
      key: ROUTES.DASHBOARD,
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: ROUTES.ALUMNOS,
      icon: <UserOutlined />,
      label: 'Alumnos',
    },
    {
      key: ROUTES.MEMBRESIAS,
      icon: <CreditCardOutlined />,
      label: 'Membresías',
    },
    {
      key: ROUTES.PAGOS,
      icon: <DollarOutlined />,
      label: 'Pagos',
    },
    {
      key: ROUTES.CLASES,
      icon: <BookOutlined />,
      label: 'Clases',
    },
  ];

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div
          style={{
            height: 32,
            margin: 16,
            background: 'rgba(255, 255, 255, 0.3)',
            borderRadius: 6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
          }}
        >
          Natatorio
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout style={{ marginLeft: 200 }}>
        <Header
          style={{
            padding: '0 24px',
            background: colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 600 }}>
            Sistema de Gestión de Natatorio
          </h1>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}

export default MainLayout;

