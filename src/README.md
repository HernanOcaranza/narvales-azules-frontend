# Estructura del Proyecto - Sistema de Gestión de Natatorio

## 📁 Arquitectura de Carpetas

```
src/
├── components/          # Componentes reutilizables
│   └── Layout/         # Componentes de layout (MainLayout)
├── pages/              # Páginas principales de la aplicación
│   ├── Dashboard/      # Página principal con estadísticas
│   ├── Alumnos/        # Gestión de alumnos
│   ├── Membresias/     # Gestión de membresías
│   ├── Pagos/          # Gestión de pagos
│   └── Clases/         # Gestión de clases
├── services/           # Servicios para llamadas a la API
│   └── api.js         # Servicio base con fetch vanilla
├── utils/             # Utilidades y helpers
│   ├── constants.js   # Constantes del sistema
│   └── helpers.js     # Funciones de utilidad
├── hooks/             # Custom hooks (para uso futuro)
├── contexts/          # Contextos de React (para uso futuro)
└── assets/           # Recursos estáticos (imágenes, etc.)
```

## 🚀 Cómo usar

### Servicio de API

El servicio base está en `src/services/api.js` y proporciona métodos helper para hacer peticiones:

```javascript
import api from '../services/api';

// GET
const alumnos = await api.get('/alumnos');

// POST
const nuevoAlumno = await api.post('/alumnos', {
  nombre: 'Juan',
  apellido: 'Pérez',
  email: 'juan@example.com'
});

// PUT
const actualizado = await api.put('/alumnos/1', { nombre: 'Juan Carlos' });

// DELETE
await api.delete('/alumnos/1');
```

### Constantes

Las rutas y constantes están centralizadas en `src/utils/constants.js`:

```javascript
import { ROUTES, ESTADOS, TIPOS_MEMBRESIA } from '../utils/constants';
```

### Helpers

Funciones de utilidad en `src/utils/helpers.js`:

```javascript
import { formatDate, formatCurrency, isValidEmail } from '../utils/helpers';
```

## 📝 Próximos Pasos

1. **Configurar la URL de la API**: Crear un archivo `.env` basado en `.env.example`
2. **Implementar los endpoints reales**: Reemplazar los TODOs en las páginas con llamadas reales a la API
3. **Agregar formularios**: Crear modales/formularios para crear/editar registros
4. **Agregar validación**: Implementar validación de formularios con Ant Design
5. **Agregar autenticación**: Si es necesario, implementar login y protección de rutas

## 🎨 Ant Design

El proyecto usa Ant Design como librería de componentes. La configuración está en español y se encuentra en `src/App.jsx`.

## 📚 Recursos

- [Documentación de Ant Design](https://ant.design/)
- [React Router](https://reactrouter.com/)
- [Vite](https://vitejs.dev/)

