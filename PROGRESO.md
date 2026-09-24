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

### Bloque 3 — Motor 3D
- `Viewer`: un único `<Canvas>` por configurador (OrbitControls con damping, `Environment`, `ContactShadows`, dpr [1, 1.8]). Botones de reiniciar vista y rotación automática; hint de arrastrar/zoom.
- `SolsticeModel`: geometría paramétrica completa — medidas y voladizos, 2/4/6 columnas (cuadrada, slim, redonda), anclaje a piso o pared, vigas perimetrales e intermedias, techo de lamas orientables / panel aislado / abierto, cerramientos de vidrio, persiana y panel ciego, tira LED emisiva, ventiladores animados, calefactores y sensor de lluvia.
- `TuuciModel`: tres sub-modelos (MAX Solanox con cables tensores, Pérgola clásica y Lulu Day Lounge con cama), canopy piramidal con faldón ondulado, 6 acabados de madera, 4 colores de lona (el rayado usa una `CanvasTexture` generada), cortinas y cojines.
- Ambos modelos leen sus medidas en pies y las convierten a metros, así el 3D y el despiece hablan de lo mismo.

### Bloque 4 — Configurador Solstice
- UI oscura con acento azul eléctrico `#1FA2FF`: visor a la izquierda (fondo claro), panel de opciones a la derecha fijo al viewport (`h-[100dvh]`), tabs de sección en el orden pedido: Dimensiones · Columnas · Paredes · Revestimiento · Extras · Acabado · Resumen.
- Cada control actualiza el 3D en vivo: sliders de largo/proyección/altura/voladizos, cantidad y estilo de columnas, anclaje, lados y tipo de pared, tipo de techo y ángulo de lamas, 4 extras toggleables y 4 acabados con swatches.
- Resumen con toda la configuración, chips de extras y estimado de referencia calculado con `calcularDespiece`.
- Estado persistido en `sessionStorage` (`useConfig`), botón de reiniciar configuración con toast.

### Bloque 5 — Configurador Tuuci
- Estética clara / lujo resort: visor sobre blanco, panel derecho blanco con acento negro carbón y wordmark TUUCI centrado sobre el visor.
- Colección en tarjetas (MAX Solanox Pergola · Pérgola · Lulu Day Lounge) con garantía, rango de medidas y acabados, más flechas de navegación tipo la referencia.
- Opciones: tamaño por sub-modelo (la Lulu es de medida única), 6 swatches de madera, 4 colores de lona (el rayado con textura generada) y extras de cortinas y cojines. Todo repinta el 3D en vivo.
- Los paneles de cada configurador fuerzan su propia identidad de color, así el tema global no les pisa el contraste.

## 🔜 Pendiente
- Bloque 6 — Despiece + formulario de pedido + WhatsApp.
- Bloque 7 — Panel Admin.
- Bloque 8 — DevNotices, QA de i18n, mobile 375px y performance del canvas.

## 🧭 Decisiones
- **shadcn/ui a mano**: se escribieron las primitivas con la misma API (cva + cn) en lugar de correr el CLI, para no arrastrar Radix completo en una demo estática.
- **Persistencia**: preferencias (tema/idioma/sesión) en `localStorage`; config del configurador y pedidos de la demo en `sessionStorage`, así el Admin muestra los pedidos creados en vivo.
- **Despiece calculado, no hardcodeado**: `calcularDespiece(config)` deriva SKU, cantidades y precios desde las medidas y opciones elegidas, para que el listado sea coherente con lo que el cliente ve en el 3D.
- **Sombra del piso propia**: `ContactShadows` de drei no emitía nada en este entorno, así que la sombra se resuelve con un plano `shadowMaterial` que recibe la sombra real de la luz direccional más un blob radial de contacto. Se ve mejor (las lamas proyectan su rayado) y no depende de un render target extra.
- **`preserveDrawingBuffer: true`** en el canvas: necesario para capturar el thumbnail del 3D que va en el encabezado del despiece.
- **tsconfig.node.json** usa `emitDeclarationOnly` porque un project reference compuesto no puede desactivar emit.

## 🚧 Bloqueos
- Ninguno.
