import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Card } from '../ui';

export default function CategoriaCards({ categorias = [], onEdit, onDelete }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {categorias.map((item) => (
        <Card key={item.id_categoria} hover>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-text-primary">{item.categoria}</h3>
              <p className="text-sm text-text-secondary mt-1">{item.descripcion || item.descripcion_categoria || 'Sin descripción'}</p>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={() => onEdit(item)} className="p-2 rounded-lg hover:bg-primary-main/10 text-primary-main">
              <Edit className="w-4 h-4" />
            </button>
            <button onClick={() => onDelete(item)} className="p-2 rounded-lg hover:bg-red-100 text-red-600">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </Card>
      ))}
    </div>
  );
}