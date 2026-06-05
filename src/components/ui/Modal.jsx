import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  fullScreen = false,
  className = '',
}) {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
  };
  const overlayClickRef = useRef(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onMouseDown={(e) => { overlayClickRef.current = (e.target === e.currentTarget); }}
      onMouseUp={(e) => { if (e.target === e.currentTarget && overlayClickRef.current) onClose(); }}
    >
      <div
        className={`
          bg-white rounded-2xl shadow-xl w-full
          ${fullScreen ? 'h-screen max-h-screen' : sizes[size]}
          ${fullScreen ? 'flex flex-col' : 'max-h-[90vh] flex flex-col'}
          ${className}
        `}
      >
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-text-primary">{title}</h2>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-text-secondary" />
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {children}
        </div>

        {footer && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = 'Confirmar',
  message = '¿Estás seguro de realizar esta acción?',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger',
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      size="sm"
      footer={
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 text-text-primary hover:bg-gray-50 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`
              px-4 py-2 rounded-lg text-white transition-colors
              ${variant === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-primary-main hover:bg-primary-dark'}
            `}
          >
            {confirmText}
          </button>
        </div>
      }
    >
      <p className="text-text-secondary">{message}</p>
    </Modal>
  );
}

export default Modal;