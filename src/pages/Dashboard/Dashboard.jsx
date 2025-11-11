import React from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import {
  UserOutlined,
  CreditCardOutlined,
  DollarOutlined,
  BookOutlined,
} from '@ant-design/icons';

function Dashboard() {
  // TODO: Obtener datos reales de la API
  const stats = {
    totalAlumnos: 0,
    totalMembresias: 0,
    pagosPendientes: 0,
    clasesHoy: 0,
  };

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>Dashboard</h2>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Alumnos"
              value={stats.totalAlumnos}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Membresías Activas"
              value={stats.totalMembresias}
              prefix={<CreditCardOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Pagos Pendientes"
              value={stats.pagosPendientes}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Clases Hoy"
              value={stats.clasesHoy}
              prefix={<BookOutlined />}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard;

