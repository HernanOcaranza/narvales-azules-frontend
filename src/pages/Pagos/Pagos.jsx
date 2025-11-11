import React from 'react';
import { Table, Button, Space, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
// import api from '../../services/api';
import { formatDate, formatCurrency } from '../../utils/helpers';

function Pagos() {
  const [pagos, setPagos] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    loadPagos();
  }, []);

  const loadPagos = async () => {
    setLoading(true);
    try {
      // TODO: Reemplazar con endpoint real
      // const data = await api.get('/pagos');
      // setPagos(data);
      setPagos([]);
    } catch (error) {
      console.error('Error al cargar pagos:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEstadoColor = (estado) => {
    const colors = {
      pagado: 'green',
      pendiente: 'orange',
      vencido: 'red',
      cancelado: 'default',
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
      title: 'Monto',
      dataIndex: 'monto',
      key: 'monto',
      render: (monto) => formatCurrency(monto),
    },
    {
      title: 'Fecha',
      dataIndex: 'fecha',
      key: 'fecha',
      render: (date) => formatDate(date),
    },
    {
      title: 'Método de Pago',
      dataIndex: 'metodoPago',
      key: 'metodoPago',
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
            Ver Detalle
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
        <Button type="primary" icon={<PlusOutlined />}>
          Registrar Pago
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={pagos}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
}

export default Pagos;

