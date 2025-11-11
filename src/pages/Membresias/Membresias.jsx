import React from 'react';
import { Table, Button, Space, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
// import api from '../../services/api';
import { formatDate } from '../../utils/helpers';

function Membresias() {
  const [membresias, setMembresias] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    loadMembresias();
  }, []);

  const loadMembresias = async () => {
    setLoading(true);
    try {
      // TODO: Reemplazar con endpoint real
      // const data = await api.get('/membresias');
      // setMembresias(data);
      setMembresias([]);
    } catch (error) {
      console.error('Error al cargar membresías:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEstadoColor = (estado) => {
    const colors = {
      activo: 'green',
      inactivo: 'default',
      vencido: 'red',
    };
    return colors[estado] || 'default';
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Alumno',
      dataIndex: 'alumnoNombre',
      key: 'alumnoNombre',
    },
    {
      title: 'Tipo',
      dataIndex: 'tipo',
      key: 'tipo',
    },
    {
      title: 'Fecha Inicio',
      dataIndex: 'fechaInicio',
      key: 'fechaInicio',
      render: (date) => formatDate(date),
    },
    {
      title: 'Fecha Fin',
      dataIndex: 'fechaFin',
      key: 'fechaFin',
      render: (date) => formatDate(date),
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado',
      render: (estado) => (
        <Tag color={getEstadoColor(estado)}>{estado?.toUpperCase()}</Tag>
      ),
    },
    {
      title: 'Acciones',
      key: 'acciones',
      render: () => (
        <Space>
          <Button type="link" size="small">
            Editar
          </Button>
          <Button type="link" size="small" danger>
            Eliminar
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
        <Button type="primary" icon={<PlusOutlined />}>
          Nueva Membresía
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={membresias}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
}

export default Membresias;

