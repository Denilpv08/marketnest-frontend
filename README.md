# MarketNest Frontend

Aplicación web construida con **Next.js 14** y **TypeScript** para la plataforma de gestión de establecimientos y e-commerce multi-tenant MarketNest.

---

## 📋 Tabla de contenidos

- [Descripción general](#descripción-general)
- [Stack tecnológico](#stack-tecnológico)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Páginas y rutas](#páginas-y-rutas)
- [Instalación y configuración](#instalación-y-configuración)
- [Variables de entorno](#variables-de-entorno)
- [Arquitectura del frontend](#arquitectura-del-frontend)
- [Estado global](#estado-global)
- [Comunicación con el backend](#comunicación-con-el-backend)
- [Roles y acceso](#roles-y-acceso)
- [Comandos útiles](#comandos-útiles)

---

## Descripción general

MarketNest Frontend es la interfaz de usuario de la plataforma. Está dividida en tres experiencias distintas según el rol del usuario:

- **Público** — Landing page, lista de tiendas, detalle de tienda, registro y login
- **Customer** — Carrito de compras, órdenes y citas
- **Admin** — Panel de gestión de su tienda, productos, servicios, órdenes y citas
- **Superadmin** — Panel de control global, gestión de establecimientos y usuarios

---

## Stack tecnológico

| Herramienta       | Versión | Propósito                      |
| ----------------- | ------- | ------------------------------ |
| Next.js           | 14      | Framework React con App Router |
| TypeScript        | 5       | Tipado estático                |
| Tailwind CSS      | 3       | Estilos utilitarios            |
| Material UI (MUI) | 5       | Componentes de formularios     |
| React Icons       | 5       | Iconografía                    |
| Recharts          | 2       | Gráficas del dashboard         |
| Axios             | 1       | Peticiones HTTP al backend     |
| Zustand           | 4       | Manejo de estado global        |
| React Hot Toast   | 2       | Notificaciones                 |
| pnpm              | —       | Gestor de paquetes             |

---

## Estructura del proyecto

```
marketnest-frontend/
│
├── src/
│   ├── app/                          # Páginas (Next.js App Router)
│   │   ├── layout.tsx                # Layout raíz — Toaster global
│   │   ├── page.tsx                  # Landing page pública
│   │   │
│   │   ├── auth/
│   │   │   ├── login/page.tsx        # Inicio de sesión
│   │   │   └── register/page.tsx     # Registro — selector customer/admin
│   │   │
│   │   ├── stores/
│   │   │   ├── page.tsx              # Lista pública de tiendas
│   │   │   └── [slug]/
│   │   │       ├── page.tsx          # Detalle de tienda — productos y servicios
│   │   │       └── appointment/
│   │   │           └── page.tsx      # Agendar cita en una tienda
│   │   │
│   │   ├── cart/
│   │   │   └── page.tsx              # Carrito de compras
│   │   │
│   │   ├── orders/
│   │   │   ├── page.tsx              # Lista de órdenes del customer
│   │   │   └── [id]/page.tsx         # Detalle de una orden
│   │   │
│   │   ├── appointments/
│   │   │   └── page.tsx              # Mis citas agendadas
│   │   │
│   │   ├── admin/                    # Panel de administración
│   │   │   ├── dashboard/page.tsx    # Estadísticas de la tienda
│   │   │   ├── store/page.tsx        # Editar tienda y personalización
│   │   │   ├── products/page.tsx     # Gestión de productos e inventario
│   │   │   ├── services/page.tsx     # Gestión de servicios y categorías
│   │   │   ├── orders/page.tsx       # Órdenes recibidas
│   │   │   └── appointments/page.tsx # Citas agendadas en la tienda
│   │   │
│   │   └── superadmin/               # Panel del superadmin
│   │       ├── dashboard/page.tsx    # Estadísticas globales
│   │       ├── stores/page.tsx       # Gestión de establecimientos
│   │       └── users/
│   │           ├── page.tsx          # Lista y gestión de usuarios
│   │           ├── create/page.tsx   # Crear usuario admin
│   │           └── [id]/
│   │               └── edit/page.tsx # Editar usuario
│   │
│   ├── components/
│   │   ├── ui/                       # Componentes base reutilizables
│   │   │   ├── Badge.tsx             # Badges de estado con colores semánticos
│   │   │   ├── Button.tsx            # Botón con variantes y estado de carga
│   │   │   ├── Card.tsx              # Contenedor con sombra y bordes redondeados
│   │   │   ├── EmptyState.tsx        # Estado vacío con ícono y acción
│   │   │   └── LoadingSpinner.tsx    # Spinner de carga
│   │   │
│   │   └── layout/                   # Layouts y navegación
│   │       ├── Navbar.tsx            # Barra de navegación pública responsive
│   │       ├── Footer.tsx            # Pie de página
│   │       ├── PublicLayout.tsx      # Layout para páginas públicas
│   │       ├── AdminSidebar.tsx      # Sidebar del panel admin
│   │       ├── AdminLayout.tsx       # Layout protegido para admins
│   │       ├── SuperadminSidebar.tsx # Sidebar del panel superadmin
│   │       └── SuperadminLayout.tsx  # Layout protegido para superadmins
│   │
│   ├── hooks/                        # Hooks personalizados
│   │   ├── useAuth.ts                # Login, registro, logout con redirección por rol
│   │   ├── useCart.ts                # Operaciones del carrito sincronizadas
│   │   └── useStore.ts               # Carga y actualización de tienda por slug
│   │
│   ├── lib/
│   │   ├── axios.ts                  # Instancia de Axios con interceptores JWT
│   │   └── api/                      # Funciones de llamadas al backend
│   │       ├── auth.ts               # Register, login, perfil
│   │       ├── stores.ts             # CRUD de tiendas
│   │       ├── products.ts           # CRUD de productos
│   │       ├── cart.ts               # Operaciones del carrito
│   │       ├── orders.ts             # Órdenes
│   │       ├── appointments.ts       # Citas
│   │       ├── services.ts           # Servicios y categorías
│   │       ├── dashboard.ts          # Estadísticas
│   │       └── index.ts              # Exportaciones centralizadas
│   │
│   ├── store/                        # Estado global con Zustand
│   │   ├── authStore.ts              # Usuario autenticado, token, persistencia
│   │   └── cartStore.ts              # Carrito y contador de ítems
│   │
│   ├── types/
│   │   └── index.ts                  # Interfaces y enums TypeScript
│   │
│   └── middleware.ts                 # Protección de rutas en el servidor
│
├── .env.local                        # Variables de entorno locales
├── next.config.ts                    # Configuración de Next.js
├── tailwind.config.ts                # Configuración de Tailwind CSS
├── tsconfig.json                     # Configuración de TypeScript
└── package.json                      # Dependencias del proyecto
```

---

## Páginas y rutas

### Páginas públicas (sin autenticación)

| Ruta                         | Descripción                                                   |
| ---------------------------- | ------------------------------------------------------------- |
| `/`                          | Landing page con hero, características y CTA                  |
| `/auth/login`                | Formulario de inicio de sesión                                |
| `/auth/register`             | Registro con selector de tipo de cuenta (comprador / negocio) |
| `/stores`                    | Lista de tiendas activas con búsqueda y filtros               |
| `/stores/[slug]`             | Detalle de tienda con productos, servicios y horarios         |
| `/stores/[slug]/appointment` | Formulario para agendar cita en una tienda                    |

### Páginas del customer (autenticación requerida)

| Ruta            | Descripción                                            |
| --------------- | ------------------------------------------------------ |
| `/cart`         | Carrito de compras con controles de cantidad y resumen |
| `/orders`       | Historial de órdenes con estados                       |
| `/orders/[id]`  | Detalle de una orden específica                        |
| `/appointments` | Mis citas agendadas con opción de cancelar             |

### Panel Admin (rol admin requerido)

| Ruta                  | Descripción                                              |
| --------------------- | -------------------------------------------------------- |
| `/admin/dashboard`    | Estadísticas — ventas, órdenes, productos, stock         |
| `/admin/store`        | Editar información, contacto, personalización y horarios |
| `/admin/products`     | CRUD de productos con modal, stock e imagen              |
| `/admin/services`     | CRUD de servicios y categorías con tabs                  |
| `/admin/orders`       | Órdenes recibidas con actualización de estado            |
| `/admin/appointments` | Citas con filtro por fecha, confirmación y cancelación   |

### Panel Superadmin (rol superadmin requerido)

| Ruta                          | Descripción                                         |
| ----------------------------- | --------------------------------------------------- |
| `/superadmin/dashboard`       | Estadísticas globales — ingresos, tiendas, usuarios |
| `/superadmin/stores`          | Lista de establecimientos con aprobar/suspender     |
| `/superadmin/users`           | Lista de usuarios con filtros, aprobar/suspender    |
| `/superadmin/users/create`    | Crear usuario admin aprobado directamente           |
| `/superadmin/users/[id]/edit` | Editar datos de cualquier usuario                   |

---

## Instalación y configuración

### Requisitos previos

- Node.js 18+
- pnpm
- Backend de MarketNest corriendo en `http://localhost:8000`

### Pasos

**1. Clonar el repositorio**

```bash
git clone <url-del-repo>
cd marketnest-frontend
```

**2. Instalar dependencias**

```bash
pnpm install
```

**3. Configurar variables de entorno**

```bash
cp .env.local.example .env.local
```

Edita el `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**4. Levantar el servidor de desarrollo**

```bash
pnpm dev
```

La aplicación corre en `http://localhost:3000`

---

## Variables de entorno

| Variable              | Descripción                  | Ejemplo                 |
| --------------------- | ---------------------------- | ----------------------- |
| `NEXT_PUBLIC_API_URL` | URL base del backend FastAPI | `http://localhost:8000` |

Las variables con prefijo `NEXT_PUBLIC_` son accesibles en el navegador. Las demás solo en el servidor.

---

## Arquitectura del frontend

### Flujo de una petición

```
Componente/Página
      │
      ▼
Hook personalizado (useAuth, useCart, useStore)
      │
      ▼
Función de API (src/lib/api/*.ts)
      │
      ▼
Instancia de Axios (src/lib/axios.ts)
      │  ← Interceptor agrega token JWT automáticamente
      ▼
Backend FastAPI (http://localhost:8000)
```

### Interceptores de Axios

**Request interceptor** — lee el token de `localStorage` y lo agrega al header `Authorization: Bearer <token>` en cada petición automáticamente.

**Response interceptor** — si el servidor devuelve `401 Unauthorized`, limpia el token del `localStorage` y redirige al login automáticamente.

### Protección de rutas

Hay dos niveles de protección:

**Middleware (servidor)** — `src/middleware.ts` verifica la cookie `token` antes de renderizar la página. Si no existe redirige al login instantáneamente.

**Layout (cliente)** — `AdminLayout` y `SuperadminLayout` verifican el rol del usuario en Zustand. Si el rol no coincide redirigen a la página de inicio.

---

## Estado global

### `authStore` — Autenticación

```typescript
{
  user: User | null; // Datos del usuario autenticado
  token: string | null; // Token JWT
  isAuthenticated: boolean; // Si hay sesión activa

  setAuth(user, token); // Guarda sesión en store + localStorage + cookie
  logout(); // Limpia sesión de store + localStorage + cookie
  updateUser(user); // Actualiza datos del usuario sin cambiar el token
}
```

El store usa `persist` de Zustand — los datos se guardan en `localStorage` y se restauran automáticamente cuando el usuario recarga la página.

### `cartStore` — Carrito

```typescript
{
  cart: Cart | null; // Datos del carrito con ítems y total
  itemCount: number; // Total de ítems (para el badge del navbar)

  setCart(cart); // Actualiza el carrito y recalcula itemCount
  clearCart(); // Vacía el carrito
}
```

---

## Comunicación con el backend

Todas las llamadas al backend están organizadas en `src/lib/api/`:

```typescript
// Ejemplo de uso en un componente
import { productsApi } from "@/lib/api";

const products = await productsApi.getByStore(storeId);
```

### Módulos de API disponibles

| Módulo            | Funciones principales                                                                 |
| ----------------- | ------------------------------------------------------------------------------------- |
| `authApi`         | `register`, `login`, `getMe`, `updateProfile`                                         |
| `storesApi`       | `create`, `getBySlug`, `getMyStores`, `update`, `getAll`, `getPublic`, `changeStatus` |
| `productsApi`     | `getByStore`, `getAllByStore`, `getById`, `create`, `update`, `delete`                |
| `cartApi`         | `getCart`, `addItem`, `updateItem`, `removeItem`, `clearCart`                         |
| `ordersApi`       | `create`, `getMyOrders`, `getById`, `getByStore`, `updateStatus`                      |
| `appointmentsApi` | `create`, `getMyAppointments`, `getByStore`, `updateStatus`, `cancel`                 |
| `servicesApi`     | `getByStore`, `getCategories`, `create`, `update`, `delete`, `createCategory`         |
| `dashboardApi`    | `getStoreDashboard`, `getSuperadminDashboard`                                         |

---

## Roles y acceso

### Flujo de registro

```
Usuario elige "Soy comprador"
  → role: customer
  → status: active
  → Puede iniciar sesión de inmediato
  → Redirige a la página de inicio

Usuario elige "Tengo un negocio"
  → role: admin
  → status: pending
  → NO puede iniciar sesión
  → Redirige al login con mensaje de espera
  → Superadmin aprueba → status: active
  → Puede iniciar sesión y crear tienda
```

### Redirección por rol al hacer login

| Rol          | Redirección             |
| ------------ | ----------------------- |
| `superadmin` | `/superadmin/dashboard` |
| `admin`      | `/admin/dashboard`      |
| `customer`   | `/`                     |

### Rutas protegidas

| Ruta              | Acceso                          |
| ----------------- | ------------------------------- |
| `/admin/*`        | Solo rol `admin` o `superadmin` |
| `/superadmin/*`   | Solo rol `superadmin`           |
| `/cart`           | Usuario autenticado             |
| `/orders/*`       | Usuario autenticado             |
| `/appointments/*` | Usuario autenticado             |

---

## Comandos útiles

**Levantar servidor de desarrollo**

```bash
pnpm dev
```

**Build de producción**

```bash
pnpm build
```

**Iniciar servidor de producción**

```bash
pnpm start
```

**Verificar errores de TypeScript**

```bash
pnpm tsc --noEmit
```

**Instalar una dependencia nueva**

```bash
pnpm add nombre-paquete
```

**Instalar una dependencia de desarrollo**

```bash
pnpm add -D nombre-paquete
```
