import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Table, TableHead, TableBody, TableRow, TableHeadCell, TableCell } from '../ui';

export default function CategoriaTable({ categorias = [], onEdit, onDelete }) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeadCell>Nombre</TableHeadCell>
          <TableHeadCell>Descripción</TableHeadCell>
          <TableHeadCell className="text-right">Acciones</TableHeadCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {categorias.map((item) => (
          <TableRow key={item.id_categoria} hover>
            <TableCell className="font-medium">{item.categoria}</TableCell>
            <TableCell>{item.descripcion || item.descripcion_categoria || '-'}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-1">
                <button onClick={() => onEdit(item)} className="p-1.5 rounded-lg hover:bg-primary-main/10 text-primary-main">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => onDelete(item)} className="p-1.5 rounded-lg hover:bg-red-100 text-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}