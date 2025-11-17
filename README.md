# 🏊 Sistema de Gestión de Natatorio - Frontend

Sistema de gestión para natatorio desarrollado con React + Vite + Ant Design.

---

## 📁 Estructura del Proyecto - Guía Visual

### 🌳 Vista General del Árbol de Carpetas

```
narvales-azules-frontend/
│
├── 📁 src/                          ← TODO el código de la app va aquí
│   │
│   ├── 📄 main.jsx                  ← PUNTO DE ENTRADA (no tocar)
│   │                                 Renderiza la app en el navegador
│   │
│   ├── 📄 App.jsx                   ← CONFIGURACIÓN PRINCIPAL
│   │                                 Define las rutas y el layout general
│   │
│   ├── 📁 components/                ← 🎨 COMPONENTES REUTILIZABLES
│   │   └── 📁 Layout/
│   │       └── MainLayout.jsx       ← Menú lateral y estructura de la página
│   │
│   ├── 📁 pages/                     ← 📄 PÁGINAS (lo que ven los usuarios)
│   │   ├── 📁 Dashboard/
│   │   │   └── Dashboard.jsx        ← Página principal con estadísticas
│   │   ├── 📁 Alumnos/
│   │   │   └── Alumnos.jsx          ← Página de gestión de alumnos
│   │   ├── 📁 Membresias/
│   │   │   └── Membresias.jsx       ← Página de membresías
│   │   ├── 📁 Pagos/
│   │   │   └── Pagos.jsx            ← Página de pagos
│   │   └── 📁 Clases/
│   │       └── Clases.jsx           ← Página de clases
│   │
│   ├── 📁 services/                  ← 🔌 COMUNICACIÓN CON EL BACKEND
│   │   └── api.js                    ← Funciones para hacer peticiones HTTP
│   │
│   ├── 📁 utils/                     ← 🛠️ HERRAMIENTAS Y CONSTANTES
│   │   ├── constants.js              ← Rutas, estados, tipos (valores fijos)
│   │   └── helpers.js                 ← Funciones útiles (formatear fechas, etc.)
│   │
│   ├── 📁 hooks/                     ← 🎣 CUSTOM HOOKS (para el futuro)
│   │   └── (vacío por ahora)
│   │
│   ├── 📁 contexts/                  ← 🌐 CONTEXTOS (para el futuro)
│   │   └── (vacío por ahora)
│   │
│   └── 📁 assets/                    ← 🖼️ IMÁGENES, ICONOS, etc.
│
├── 📁 public/                        ← Archivos estáticos (no tocar)
├── 📄 package.json                   ← Dependencias del proyecto
└── 📄 vite.config.js                 ← Configuración de Vite (no tocar)
```

---

## 🎯 ¿Dónde Poner Cada Cosa?

### 1️⃣ **Componentes Reutilizables** → `src/components/`

Componentes que se usan en **varias páginas diferentes**.

**Ejemplos:**
- Botones personalizados
- Formularios reutilizables
- Modales
- Tarjetas
- Tablas personalizadas

**Estructura sugerida:**
```
src/components/
├── Layout/
│   └── MainLayout.jsx          ← Ya existe
├── Buttons/
│   └── PrimaryButton.jsx       ← Ejemplo: botón personalizado
├── Forms/
│   └── AlumnoForm.jsx          ← Ejemplo: formulario de alumno
└── Modals/
    └── ConfirmModal.jsx        ← Ejemplo: modal de confirmación
```

**Ejemplo de componente:**
```jsx
// src/components/Buttons/PrimaryButton.jsx
import React from 'react';
import { Button } from 'antd';

function PrimaryButton({ children, onClick }) {
  return (
    <Button type="primary" onClick={onClick}>
      {children}
    </Button>
  );
}

export default PrimaryButton;
```

---

### 2️⃣ **Páginas** → `src/pages/`

Cada página va en su **carpeta con el mismo nombre**.

**Estructura:**
```
src/pages/
└── Alumnos/
    └── Alumnos.jsx              ← Componente principal de la página
```

**Si una página crece mucho, puedes dividirla:**
```
src/pages/
└── Alumnos/
    ├── Alumnos.jsx              ← Componente principal
    ├── AlumnoTable.jsx          ← Tabla de alumnos (solo para esta página)
    └── AlumnoForm.jsx           ← Formulario de alumno (solo para esta página)
```

**Ejemplo de página:**
```jsx
// src/pages/Alumnos/Alumnos.jsx
import React from 'react';
import { Table, Button } from 'antd';
import api from '../../services/api';

function Alumnos() {
  const [alumnos, setAlumnos] = React.useState([]);

  React.useEffect(() => {
    // Obtener alumnos al cargar la página
    api.get('/alumnos').then(setAlumnos);
  }, []);

  return (
    <div>
      <h2>Lista de Alumnos</h2>
      <Table dataSource={alumnos} columns={[...]} />
    </div>
  );
}

export default Alumnos;
```

---

### 3️⃣ **Servicios** → `src/services/`

Funciones para comunicarse con el backend. **NO incluyas lógica de UI aquí**.

**Ejemplo de uso en una página:**
```jsx
// En una página
import api from '../../services/api';

// Obtener datos
const alumnos = await api.get('/alumnos');

// Crear algo nuevo
const nuevoAlumno = await api.post('/alumnos', {
  nombre: 'Juan',
  apellido: 'Pérez'
});

// Actualizar
await api.put('/alumnos/1', { nombre: 'Juan Carlos' });

// Eliminar
await api.delete('/alumnos/1');
```

---

### 4️⃣ **Utilidades** → `src/utils/`

- **`constants.js`**: Valores fijos (rutas, estados, tipos)
- **`helpers.js`**: Funciones reutilizables (formatear fechas, validar emails, etc.)

**Ejemplo de constantes:**
```jsx
// src/utils/constants.js
export const ROUTES = {
  DASHBOARD: '/',
  ALUMNOS: '/alumnos',
  // ...
};
```

**Ejemplo de helpers:**
```jsx
// src/utils/helpers.js
export function formatDate(date) {
  return new Date(date).toLocaleDateString('es-ES');
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS'
  }).format(amount);
}
```

---

## 🔄 Flujo de Datos

```
┌─────────────────┐
│   Usuario       │
│   (Navegador)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   App.jsx       │ ← Define las rutas
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  MainLayout.jsx │ ← Menú y estructura
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Página        │ ← Ej: Alumnos.jsx
│   (Componente)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   api.js        │ ← Hace petición HTTP
│   (services)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Backend API   │ ← Servidor
└─────────────────┘
```

---

## ✅ Reglas Simples para Principiantes

1. **¿Es un componente que se usa en varias páginas?**
   - → `src/components/`

2. **¿Es una página completa?**
   - → `src/pages/[NombrePagina]/[NombrePagina].jsx`

3. **¿Necesitas hacer una petición al backend?**
   - → Usa `api` de `src/services/api.js`

4. **¿Necesitas un valor fijo o una función útil?**
   - → `src/utils/constants.js` o `src/utils/helpers.js`

5. **¿Es una imagen o recurso estático?**
   - → `src/assets/`

---

## 🚀 Ejemplo Práctico: Crear una Nueva Página

### Paso 1: Crear la carpeta y el archivo
```
src/pages/
└── Profesores/
    └── Profesores.jsx
```

### Paso 2: Crear el componente
```jsx
// src/pages/Profesores/Profesores.jsx
import React from 'react';
import { Table } from 'antd';

function Profesores() {
  return (
    <div>
      <h2>Profesores</h2>
      <Table dataSource={[]} columns={[]} />
    </div>
  );
}

export default Profesores;
```

### Paso 3: Agregar la ruta en `App.jsx`
```jsx
// Agregar import
import Profesores from './pages/Profesores/Profesores';

// Agregar ruta en <Routes>
<Route path="/profesores" element={<Profesores />} />
```

### Paso 4: Agregar al menú en `MainLayout.jsx`
```jsx
// Agregar item al array menuItems
{
  key: '/profesores',
  icon: <UserOutlined />,
  label: 'Profesores',
}
```

---

## 📊 Resumen Visual

```
┌─────────────────────────────────────────┐
│         ESTRUCTURA DEL PROYECTO         │
├─────────────────────────────────────────┤
│                                         │
│  📁 components/  →  Componentes        │
│                   reutilizables         │
│                                         │
│  📁 pages/       →  Páginas completas  │
│                                         │
│  📁 services/    →  Comunicación API   │
│                                         │
│  📁 utils/       →  Constantes y        │
│                   funciones útiles     │
│                                         │
│  📁 hooks/       →  Custom hooks        │
│                   (futuro)              │
│                                         │
│  📁 contexts/    →  Contextos React    │
│                   (futuro)              │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🛠️ Tecnologías Utilizadas

- **React 19** - Librería de UI
- **Vite** - Build tool y dev server
- **Ant Design 5** - Librería de componentes UI
- **React Router DOM 7** - Navegación y rutas

---

## 📦 Instalación y Uso

### Instalar dependencias
```bash
npm install
```

### Ejecutar en desarrollo
```bash
npm run dev
```

### Construir para producción
```bash
npm run build
```

### Preview de producción
```bash
npm run preview
```

---

## 🔌 Configuración de API

El proyecto usa variables de entorno para la URL de la API. Crea un archivo `.env` en la raíz:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

---

## 📚 Recursos Adicionales

- [Documentación de Ant Design](https://ant.design/)
- [React Router](https://reactrouter.com/)
- [Vite](https://vitejs.dev/)
- [React](https://react.dev/)

---

## 💡 Tips para el Equipo

- **Siempre importa React**: `import React from 'react'`
- **Usa hooks de React**: `React.useState`, `React.useEffect`, etc.
- **Componentes en PascalCase**: `MiComponente.jsx`
- **Archivos en camelCase**: `miArchivo.jsx`
- **Mantén los componentes pequeños y enfocados**
- **Reutiliza componentes cuando sea posible**

---

## 📝 Notas Importantes

- El proyecto está configurado en español (Ant Design en español)
- Las rutas están centralizadas en `src/utils/constants.js`
- El servicio de API maneja automáticamente el token de autenticación si existe en `localStorage`
- Los componentes deben seguir las convenciones de React y Ant Design

---

**¡Listo para empezar a desarrollar! 🚀**
