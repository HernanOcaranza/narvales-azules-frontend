import React from 'react';
import { X } from 'lucide-react';
import { Button } from '../../components/ui';

function ConfirmDeleteDialog({ open, onClose, onConfirm, title, itemName }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-semibold text-text-primary mb-2">Confirmar eliminación</h2>
        <p className="text-text-secondary mb-4">
          ¿Estás seguro de eliminar {title} <strong>{itemName}</strong>? Esta acción no se puede deshacer.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button variant="danger" onClick={() => { onConfirm(); onClose(); }}>Eliminar</Button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDeleteDialog;