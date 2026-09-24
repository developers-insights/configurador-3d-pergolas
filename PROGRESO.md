# PROGRESO — Configurador 3D de Pérgolas (Demo Insights)

Previsualización navegable para un proveedor de materiales de pérgolas.
Cadena: **Proveedor (ultra admin) → Empresas de pérgolas (usuarios) → Cliente final → Despiece → Pedido de materiales.**

---

## ✅ Completado

### Bloque 1 — Setup y fundaciones
- Vite + React 18 + TypeScript + Tailwind CSS v3 + PostCSS/autoprefixer.
- Dependencias de runtime (three, R3F, drei, tailwind, vite, typescript…) en `dependencies` para Render.
- `vite.config.ts` con `base:'/'`, alias `@ → ./src` y manual chunks (three / r3f / charts).
- `render.yaml`: static site, plan free, `npm ci && npm run build`, publish `./dist`, rewrite SPA `/* → /index.html`.
- Tokens de diseño (CSS vars light/dark), fuentes Inter + Space Grotesk + JetBrains Mono, anti-flash inline en `index.html`.
- i18n ES/EN con diccionario `{clave: [es, en]}` y `useT()` (~240 claves).
- Primitivas UI estilo shadcn: Button, Card, Badge, Input/Textarea/Label, Slider, Modal, Toast.
- `DevNotice` (ámbar, ícono Wrench) con copy honesto por integración.
- Tipos TS del dominio y datos mock: 15 empresas, 20 pedidos históricos, 12 meses de serie, top materiales.
- Catálogo de materiales + motor de cálculo del despiece para Solstice y Tuuci.

### Bloque 2 — Login, shell y navegación
- Login centrado con pills de auto-fill (`empresa / Pergola2026`, `admin / Admin2026`), toggles de tema e idioma y link de WhatsApp.
- `SessionProvider`: login/logout, **role switcher en vivo** (sin logout, resetea a la vista default del rol) y registro de pedidos de la sesión.
- Router con guards por rol y deep links: `/configurador`, `/configurador/solstice`, `/configurador/tuuci`, `/despiece`, `/admin`, `/admin/empresas`, `/admin/pedidos`, 404.
- Pantalla de selección de modelo con tarjetas ilustradas, comparador Solstice vs Tuuci y tabla de diferencias clave.
- `TopBar` neutro con marca, role switcher, tema/idioma y logout.

## 🔜 Pendiente
- Bloque 3 — Componente 3D paramétrico con OrbitControls, Environment y ContactShadows.
- Bloque 4 — Configurador Solstice.
- Bloque 5 — Configurador Tuuci.
- Bloque 6 — Despiece + formulario de pedido + WhatsApp.
- Bloque 7 — Panel Admin.
- Bloque 8 — DevNotices, QA de i18n, mobile 375px y performance del canvas.

## 🧭 Decisiones
- **shadcn/ui a mano**: se escribieron las primitivas con la misma API (cva + cn) en lugar de correr el CLI, para no arrastrar Radix completo en una demo estática.
- **Persistencia**: preferencias (tema/idioma/sesión) en `localStorage`; config del configurador y pedidos de la demo en `sessionStorage`, así el Admin muestra los pedidos creados en vivo.
- **Despiece calculado, no hardcodeado**: `calcularDespiece(config)` deriva SKU, cantidades y precios desde las medidas y opciones elegidas, para que el listado sea coherente con lo que el cliente ve en el 3D.
- **tsconfig.node.json** usa `emitDeclarationOnly` porque un project reference compuesto no puede desactivar emit.

## 🚧 Bloqueos
- Ninguno.
