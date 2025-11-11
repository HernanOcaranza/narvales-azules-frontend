import React from 'react';
import { Table, Button, Space, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
// import api from '../../services/api';
// import { formatDate } from '../../utils/helpers';

function Clases() {
  const [clases, setClases] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    loadClases();
  }, []);

  const loadClases = async () => {
    setLoading(true);
    try {
      // TODO: Reemplazar con endpoint real
      // const data = await api.get('/clases');
      // setClases(data);
      setClases([]);
    } catch (error) {
      console.error('Error al cargar clases:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'nombre',
    },
    {
      title: 'Instructor',
      dataIndex: 'instructor',
      key: 'instructor',
    },
    {
      title: 'Día',
      dataIndex: 'dia',
      key: 'dia',
    },
    {
      title: 'Hora',
      dataIndex: 'hora',
      key: 'hora',
    },
    {
      title: 'Capacidad',
      dataIndex: 'capacidad',
      key: 'capacidad',
    },
    {
      title: 'Inscriptos',
      dataIndex: 'inscriptos',
      key: 'inscriptos',
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado',
      render: (estado) => (
        <Tag color={estado === 'activo' ? 'green' : 'default'}>
          {estado?.toUpperCase()}
        </Tag>
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
          <Button type="link" size="small">
            Ver Inscriptos
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
        <Button type="primary" icon={<PlusOutlined />}>
          Nueva Clase
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={clases}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
}

export default Clases;

