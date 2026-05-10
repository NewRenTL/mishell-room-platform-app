# Mishell Room — Web App

App mobile-first para búsqueda y reserva de habitaciones en Lima. Permite a inquilinos explorar propiedades, reservar, firmar contratos digitalmente y pagar con MercadoPago o Yape. Los socios (propietarios) gestionan sus propiedades y también pueden reservar como inquilinos.

---

## Stack

| Capa | Tecnología |
|---|---|
| Framework | React 19 + TypeScript |
| Build | Vite 8 |
| Estilos | Tailwind CSS v4 (tokens via `@theme`) |
| Estado global | Zustand v5 |
| Data fetching | TanStack Query v5 |
| Routing | React Router v7 |
| Animaciones | Motion (Framer) v12 |
| HTTP | Axios |
| Maps | Leaflet + react-leaflet |
| WebSockets | socket.io-client v4 |
| Fuente | Sora (Google Fonts) |

---

## Requisitos

- Node.js 22+
- Backend corriendo (`contract-platform-backend`)

---

## Variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=http://localhost:3000/api
VITE_IS_SANDBOX=true
```

| Variable | Descripción | Default |
|---|---|---|
| `VITE_API_URL` | URL base del backend (incluye `/api`) | `http://localhost:3000/api` |
| `VITE_IS_SANDBOX` | Activa el modo sandbox de MercadoPago | `true` |

> **Importante:** las variables `VITE_*` se inyectan en tiempo de build. En Railway, deben estar configuradas antes de ejecutar el deploy.

---

## Desarrollo local

```bash
npm install
npm run dev       # http://localhost:5174
```

```bash
npm run build     # TypeScript check + build de producción
npm run preview   # Previsualizar el build
npm run lint      # ESLint
```

---

## Estructura

```
src/
├── components/
│   ├── layout/         # MobileLayout, AuthLayout
│   └── ui/             # Button, Input, TabSwitcher, PropertyCard, SignatureCanvas, Stepper
├── hooks/
│   └── useChat.ts      # useChat (inquilino/socio) + useAdminChatMobile (admin)
├── pages/
│   ├── auth/           # LoginPage, RegisterPage
│   ├── marketplace/    # HomePage, MarketplacePage, PropertyDetailPage
│   ├── booking/        # BookingFlowPage (4 steps), BookingSuccessPage, MpReturnPage
│   ├── tenant/         # MyBookingsPage, ProfilePage
│   ├── socio/          # SocioDashboardPage, PropertyManagePage, AddPropertyPage
│   ├── messages/       # MessagesPage (inquilino/socio), ChatPage (admin mobile)
│   └── admin/          # AdminChatListPage
├── services/           # auth, properties, bookings, chat — wrappers de Axios
├── stores/
│   └── authStore.ts    # Zustand: token, user, isAuthenticated
└── types/
    └── index.ts        # Interfaces TS: User, Property, Booking, ChatMessage, etc.
```

---

## Roles y rutas

| Rol | Landing | Rutas principales |
|---|---|---|
| `INQUILINO` | `/home` | `/properties`, `/booking/:id`, `/my-bookings`, `/messages`, `/profile` |
| `SOCIO` | `/socio` | Todo lo de inquilino + `/socio/*` para gestión de propiedades |
| `ADMIN` | `/admin-chat` | `/admin-chat`, `/admin-chat/:id` |

Los socios pueden acceder a todas las rutas de inquilino (buscar, reservar, mensajes) además de su panel de gestión.

---

## Design system

Los tokens se definen en `src/index.css` con la directiva `@theme` de Tailwind v4.

| Token | Valor | Uso |
|---|---|---|
| `mishell-600` | `#E8272A` | Color de marca principal, botones, accents |
| `mishell-500` | `#F04040` | Hover states |
| `mishell-700` | `#C41F22` | Active / pressed |
| `ink-900` | `#1A1A1A` | Texto principal |
| `ink-600` | `#6B6B6B` | Texto secundario |
| `ink-100` | `#E5E5E5` | Bordes |
| `ink-50` | `#F5F5F5` | Fondos de página |

Fuente: **Sora** — headings y body.

---

## Chat en tiempo real

Implementado con Socket.io. El namespace es `/chat` y los eventos son:

| Evento | Dirección | Descripción |
|---|---|---|
| `chat:join` | cliente → server | Unirse a sala de conversación |
| `chat:send` | cliente → server | Enviar mensaje |
| `chat:message` | server → cliente | Nuevo mensaje entrante |
| `chat:typing` | bidireccional | Indicador de escritura |
| `chat:stop_typing` | bidireccional | Detener indicador |
| `chat:read` | bidireccional | Marcar como leído |

---

## Flujo de reserva

```
Seleccionar propiedad
  → Step 1: Datos del huésped + fechas
  → Step 2: Firma digital del contrato (canvas)
  → Step 3: Método de pago (Tarjeta / MercadoPago / Yape)
  → Step 4: Confirmación + pago
  → Pantalla de éxito con resumen
```

---

## Deploy en Railway

Ver sección de Railway en el `TESTING_GUIDE.md` del repositorio raíz para instrucciones detalladas de despliegue.
