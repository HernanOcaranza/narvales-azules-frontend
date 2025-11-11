import React from 'react';
import { Table, Button, Space, Input } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
// import api from '../../services/api';

function Alumnos() {
  const [alumnos, setAlumnos] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [searchText, setSearchText] = React.useState('');

  React.useEffect(() => {
    loadAlumnos();
  }, []);

  const loadAlumnos = async () => {
    setLoading(true);
    try {
      // TODO: Reemplazar con endpoint real
      // const data = await api.get('/alumnos');
      // setAlumnos(data);
      setAlumnos([]);
    } catch (error) {
      console.error('Error al cargar alumnos:', error);
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
      title: 'Apellido',
      dataIndex: 'apellido',
      key: 'apellido',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Teléfono',
      dataIndex: 'telefono',
      key: 'telefono',
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
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Input
          placeholder="Buscar alumno..."
          prefix={<SearchOutlined />}
          style={{ width: 300 }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Button type="primary" icon={<PlusOutlined />}>
          Nuevo Alumno
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={alumnos}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
}

export default Alumnos;

