# Configurador 3D de Pérgolas — Demo Insights

Previsualización navegable (no producción) de un **configurador 3D de pérgolas** para un proveedor de materiales.
Todo es visual, con datos mock, y vive 100% en el front.

> Cadena de valor que muestra la demo:
> **Proveedor de materiales (ultra admin)** → instala el sistema en → **empresas de pérgolas** → configuran para → **clientes finales** → se genera el **despiece** → **pedido de materiales** → vuelve al proveedor.

## Accesos de la demo

| Rol | Usuario | Contraseña | Entra a |
|-----|---------|-----------|---------|
| Configurador (empresa de pérgolas) | `empresa` | `Pergola2026` | Selección de modelo |
| Ultra Admin (proveedor) | `admin` | `Admin2026` | Dashboard |

El **role switcher** cambia de rol en vivo, sin necesidad de cerrar sesión.

## Las 3 secciones

1. **Configurador** — Solstice (aluminio bioclimática, UI oscura con acento azul) y Tuuci (madera y lona, UI clara de lujo resort). El visor 3D gira, hace zoom y se actualiza en vivo con cada opción.
2. **Despiece y pedido** — listado de materiales calculado desde la configuración elegida (SKU, descripción, cantidad, unidad, precio de referencia), formulario de pedido y salida por WhatsApp.
3. **Panel Admin** — KPIs y gráficos, empresas activas/inactivas y pedidos entrantes. Los pedidos generados durante la demo aparecen arriba marcados como creados en la sesión.

## Stack

Vite · React 18 · TypeScript · Tailwind CSS v3 · three + @react-three/fiber + @react-three/drei · framer-motion · Recharts · lucide-react

## Desarrollo

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npx serve -s dist
```

## Deploy

Static Site en Render (`render.yaml` incluido): build `npm ci && npm run build`, publish `./dist`, rewrite SPA `/* → /index.html`.

---

Powered by Insights · DEMO PREVIEW
