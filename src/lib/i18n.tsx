import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

export type Lang = 'es' | 'en'

/** Diccionario plano: { clave: [español, inglés] } */
export const DICT: Record<string, [string, string]> = {
  // ── Marca / chrome global ────────────────────────────────────────────────
  'app.name': ['Configurador 3D', '3D Configurator'],
  'app.tagline': ['Pérgolas & Outdoor Living', 'Pergolas & Outdoor Living'],
  'app.demo': ['DEMO', 'DEMO'],
  'app.demoPreview': ['DEMO PREVIEW', 'DEMO PREVIEW'],
  'app.poweredBy': ['Powered by Insights', 'Powered by Insights'],
  'app.loading': ['Cargando…', 'Loading…'],
  'app.loading3d': ['Cargando modelo 3D…', 'Loading 3D model…'],

  // ── Login ────────────────────────────────────────────────────────────────
  'login.title': ['Ingresá a tu cuenta', 'Sign in to your account'],
  'login.subtitle': [
    'Configurá pérgolas en 3D y generá el despiece de materiales en segundos.',
    'Configure pergolas in 3D and generate the bill of materials in seconds.',
  ],
  'login.user': ['Usuario', 'Username'],
  'login.pass': ['Contraseña', 'Password'],
  'login.submit': ['Ingresar', 'Sign in'],
  'login.quickAccess': ['Acceso rápido para la demo', 'Quick access for the demo'],
  'login.fillCompany': ['Empresa de pérgolas', 'Pergola company'],
  'login.fillAdmin': ['Ultra administrador', 'Ultra administrator'],
  'login.autofillHint': [
    'Tocá una credencial para completarla automáticamente.',
    'Tap a credential to auto-fill it.',
  ],
  'login.invalid': ['Usuario o contraseña incorrectos.', 'Invalid username or password.'],
  'login.whatsapp': ['¿Consultas? Hablemos por WhatsApp', 'Questions? Let’s talk on WhatsApp'],
  'login.footNote': [
    'Previsualización navegable con datos de demostración.',
    'Navigable preview with demo data.',
  ],

  // ── Roles / navegación ───────────────────────────────────────────────────
  'role.switch': ['Cambiar rol', 'Switch role'],
  'role.config': ['Configurador', 'Configurator'],
  'role.configDesc': ['Empresa de pérgolas', 'Pergola company'],
  'role.admin': ['Ultra Admin', 'Ultra Admin'],
  'role.adminDesc': ['Proveedor de materiales', 'Materials supplier'],
  'role.changed': ['Rol cambiado a', 'Role switched to'],
  'nav.logout': ['Cerrar sesión', 'Log out'],
  'nav.back': ['Volver', 'Back'],
  'nav.theme': ['Tema', 'Theme'],
  'nav.lang': ['Idioma', 'Language'],

  // ── Selección de modelo ──────────────────────────────────────────────────
  'select.eyebrow': ['Paso 1 de 3', 'Step 1 of 3'],
  'select.title': ['Elegí el modelo de pérgola', 'Choose the pergola model'],
  'select.subtitle': [
    'Seleccioná la línea que querés configurar con tu cliente. Vas a poder girar el modelo en 3D y ver cada cambio en vivo.',
    'Select the line you want to configure with your client. You can rotate the model in 3D and see every change live.',
  ],
  'select.configure': ['Configurar', 'Configure'],
  'select.compare': ['Comparar modelos', 'Compare models'],
  'select.compareTitle': ['¿Cuál le conviene a tu cliente?', 'Which one fits your client?'],
  'select.diffKey': ['Diferencias clave', 'Key differences'],
  'select.material': ['Material', 'Material'],
  'select.roof': ['Techo', 'Roof'],
  'select.style': ['Estilo', 'Style'],
  'select.use': ['Uso típico', 'Typical use'],

  'solstice.name': ['Solstice', 'Solstice'],
  'solstice.short': [
    'Pérgola bioclimática moderna de aluminio.',
    'Modern bioclimatic aluminum pergola.',
  ],
  'solstice.long': [
    'Estructura de aluminio, techo de lamas orientables o panel aislado, integración de LED, ventiladores y calefactores. Look arquitectónico y minimalista. Ideal para patios y casas modernas.',
    'Aluminum structure, adjustable louvered roof or insulated panel, integrated LED, fans and heaters. Architectural, minimalist look. Ideal for modern patios and homes.',
  ],
  'solstice.material': ['Aluminio extruido', 'Extruded aluminum'],
  'solstice.roof': ['Lamas orientables / panel rígido', 'Adjustable louvers / rigid panel'],
  'solstice.style': ['Urbano arquitectónico', 'Architectural urban'],
  'solstice.use': ['Residencial moderno', 'Modern residential'],

  'tuuci.name': ['Tuuci', 'Tuuci'],
  'tuuci.short': ['Pérgola y cabana premium de madera.', 'Premium wooden pergola & cabana.'],
  'tuuci.long': [
    'Estructura de madera (teca) y techo de lona/canopy de tela. Varios modelos, incluida una cama de día. Look resort de lujo. Ideal para hoteles, piletas y espacios de hospitality.',
    'Teak wood structure with fabric canopy roof. Several models, including a day lounge. Luxury resort look. Ideal for hotels, pools and hospitality spaces.',
  ],
  'tuuci.material': ['Madera de teca', 'Teak wood'],
  'tuuci.roof': ['Lona tensada / canopy de tela', 'Tensioned fabric canopy'],
  'tuuci.style': ['Resort cálido', 'Warm resort'],
  'tuuci.use': ['Hospitality y lujo', 'Hospitality & luxury'],

  // ── Configurador: chrome ─────────────────────────────────────────────────
  'cfg.resetView': ['Reiniciar vista', 'Reset view'],
  'cfg.rotate': ['Girar', 'Rotate'],
  'cfg.autoRotate': ['Rotación automática', 'Auto-rotate'],
  'cfg.dragHint': ['Arrastrá para girar · Scroll para zoom', 'Drag to rotate · Scroll to zoom'],
  'cfg.seeBom': ['Ver despiece', 'View bill of materials'],
  'cfg.changeModel': ['Cambiar modelo', 'Change model'],
  'cfg.options': ['Opciones', 'Options'],
  'cfg.summary': ['Resumen', 'Summary'],
  'cfg.reset': ['Reiniciar configuración', 'Reset configuration'],
  'cfg.resetDone': ['Configuración reiniciada', 'Configuration reset'],
  'cfg.estimate': ['Estimado de referencia', 'Reference estimate'],

  // ── Solstice: secciones ──────────────────────────────────────────────────
  'sol.dimensions': ['Dimensiones', 'Dimensions'],
  'sol.posts': ['Columnas', 'Posts'],
  'sol.walls': ['Paredes', 'Walls'],
  'sol.cladding': ['Revestimiento', 'Cladding'],
  'sol.addons': ['Extras', 'Add-ons'],
  'sol.styling': ['Acabado', 'Styling'],
  'sol.overview': ['Resumen', 'Overview'],

  'sol.length': ['Largo', 'Length'],
  'sol.projection': ['Proyección', 'Projection'],
  'sol.height': ['Altura', 'Height'],
  'sol.sideOH': ['Voladizo lateral', 'Side overhang'],
  'sol.frontOH': ['Voladizo frontal', 'Front overhang'],
  'sol.dimHint': [
    'El modelo 3D escala en vivo con cada medida.',
    'The 3D model scales live with every measurement.',
  ],

  'sol.postCount': ['Cantidad de columnas', 'Number of posts'],
  'sol.postStyle': ['Estilo de columna', 'Post style'],
  'sol.postSquare': ['Cuadrada 100×100', 'Square 100×100'],
  'sol.postSlim': ['Slim 80×80', 'Slim 80×80'],
  'sol.postRound': ['Redonda Ø110', 'Round Ø110'],
  'sol.anchor': ['Tipo de anclaje', 'Anchor type'],
  'sol.anchorFloor': ['Base a piso', 'Floor mounted'],
  'sol.anchorWall': ['Adosada a pared', 'Wall mounted'],

  'sol.wallSides': ['Lados con pared', 'Walled sides'],
  'sol.wallNone': ['Ninguno', 'None'],
  'sol.wallType': ['Tipo de pared', 'Wall type'],
  'sol.wallGlass': ['Vidrio', 'Glass'],
  'sol.wallLouver': ['Persiana', 'Louvered'],
  'sol.wallSolid': ['Panel ciego', 'Solid panel'],

  'sol.roofType': ['Techo', 'Roof'],
  'sol.roofLouvered': ['Lamas orientables', 'Adjustable louvers'],
  'sol.roofPanel': ['Panel aislado', 'Insulated panel'],
  'sol.roofOpen': ['Abierto', 'Open'],
  'sol.louverAngle': ['Ángulo de lamas', 'Louver angle'],

  'sol.led': ['Tira LED perimetral', 'Perimeter LED strip'],
  'sol.fan': ['Ventilador de techo', 'Ceiling fan'],
  'sol.heater': ['Calefactor infrarrojo', 'Infrared heater'],
  'sol.rain': ['Sensor de lluvia', 'Rain sensor'],
  'sol.addonsHint': [
    'Los extras se muestran en el 3D al activarlos.',
    'Add-ons appear in the 3D view when enabled.',
  ],

  'sol.finish': ['Color de estructura', 'Structure finish'],
  'sol.charcoal': ['Carbón', 'Charcoal'],
  'sol.white': ['Blanco', 'White'],
  'sol.bronze': ['Bronce', 'Bronze'],
  'sol.anthracite': ['Gris antracita', 'Anthracite grey'],

  // ── Tuuci ────────────────────────────────────────────────────────────────
  'tu.collection': ['Colección', 'Collection'],
  'tu.size': ['Tamaño', 'Size'],
  'tu.wood': ['Acabado de madera', 'Wood finish'],
  'tu.canopy': ['Color de lona', 'Canopy color'],
  'tu.addons': ['Extras', 'Add-ons'],
  'tu.curtains': ['Cortinas laterales', 'Side curtains'],
  'tu.cushions': ['Cojines', 'Cushions'],
  'tu.warranty': ['15 años de garantía', '15-year warranty'],
  'tu.finishes': ['14 acabados de primera', '14 premium finishes'],
  'tu.maxSolanox': ['MAX Solanox Pergola', 'MAX Solanox Pergola'],
  'tu.maxSolanoxDesc': [
    'Pérgola con techo de lona tensada y estructura reforzada.',
    'Pergola with tensioned fabric roof and reinforced structure.',
  ],
  'tu.pergola': ['Pérgola', 'Pergola'],
  'tu.pergolaDesc': [
    'Clásica de madera con canopy de tela y cortinas opcionales.',
    'Classic wood frame with fabric canopy and optional curtains.',
  ],
  'tu.luluDesc': [
    'Cama de día con dosel, colchón y respaldo.',
    'Day bed with canopy, mattress and backrest.',
  ],
  'tu.lulu': ['Lulu Day Lounge', 'Lulu Day Lounge'],
  'tu.teak': ['Teca natural', 'Natural teak'],
  'tu.walnut': ['Nogal', 'Walnut'],
  'tu.ipe': ['Ipé oscuro', 'Dark ipe'],
  'tu.ash': ['Fresno claro', 'Light ash'],
  'tu.mahogany': ['Caoba', 'Mahogany'],
  'tu.driftwood': ['Driftwood', 'Driftwood'],
  'tu.canWhite': ['Blanco', 'White'],
  'tu.canSand': ['Arena', 'Sand'],
  'tu.canBlue': ['Azul', 'Blue'],
  'tu.canStripe': ['Rayado', 'Striped'],

  // ── Despiece ─────────────────────────────────────────────────────────────
  'bom.title': ['Despiece de materiales', 'Bill of materials'],
  'bom.eyebrow': ['Paso 2 de 3', 'Step 2 of 3'],
  'bom.subtitle': [
    'Listado completo calculado a partir de la configuración elegida.',
    'Complete list calculated from the selected configuration.',
  ],
  'bom.sku': ['Código', 'SKU'],
  'bom.desc': ['Descripción', 'Description'],
  'bom.qty': ['Cant.', 'Qty'],
  'bom.unit': ['Unidad', 'Unit'],
  'bom.price': ['Precio ref.', 'Ref. price'],
  'bom.subtotal': ['Subtotal', 'Subtotal'],
  'bom.total': ['Total de referencia', 'Reference total'],
  'bom.items': ['ítems', 'items'],
  'bom.pieces': ['piezas', 'pieces'],
  'bom.config': ['Configuración', 'Configuration'],
  'bom.send': ['Enviar pedido de materiales', 'Send materials order'],
  'bom.whatsapp': ['Pedir por WhatsApp', 'Order via WhatsApp'],
  'bom.pdf': ['Descargar despiece (PDF)', 'Download BOM (PDF)'],
  'bom.backToConfig': ['Seguir configurando', 'Keep configuring'],
  'bom.group.structure': ['Estructura', 'Structure'],
  'bom.group.roof': ['Techo', 'Roof'],
  'bom.group.walls': ['Cerramientos', 'Enclosures'],
  'bom.group.addons': ['Extras y eléctrico', 'Add-ons & electrical'],
  'bom.group.hardware': ['Herrajes y fijación', 'Hardware & fixing'],
  'bom.group.textile': ['Textil y confort', 'Textile & comfort'],
  'bom.notice': [
    'En producción el despiece se calcula contra el catálogo real de materiales del proveedor y el pedido llega a su base de datos con notificación automática.',
    'In production the BOM is calculated against the supplier’s real materials catalog and the order reaches their database with automatic notification.',
  ],

  // ── Formulario de pedido ─────────────────────────────────────────────────
  'order.eyebrow': ['Paso 3 de 3', 'Step 3 of 3'],
  'order.title': ['Enviar pedido de materiales', 'Send materials order'],
  'order.company': ['Empresa de pérgolas', 'Pergola company'],
  'order.companyName': ['Nombre de la empresa', 'Company name'],
  'order.contact': ['Persona de contacto', 'Contact person'],
  'order.email': ['Email', 'Email'],
  'order.phone': ['Teléfono', 'Phone'],
  'order.client': ['Cliente final', 'End client'],
  'order.clientName': ['Nombre del cliente', 'Client name'],
  'order.address': ['Dirección / proyecto', 'Address / project'],
  'order.city': ['Ciudad', 'City'],
  'order.notes': ['Notas para el proveedor', 'Notes for the supplier'],
  'order.notesPh': [
    'Ej.: entrega estimada, acceso al obrador, urgencias…',
    'E.g. estimated delivery, site access, urgencies…',
  ],
  'order.attached': ['Materiales adjuntos', 'Attached materials'],
  'order.readonly': ['Solo lectura', 'Read only'],
  'order.submit': ['Confirmar y enviar pedido', 'Confirm and send order'],
  'order.cancel': ['Cancelar', 'Cancel'],
  'order.required': ['Completá los campos obligatorios.', 'Please complete the required fields.'],
  'order.sent': ['Pedido enviado al proveedor', 'Order sent to the supplier'],
  'order.sentDesc': [
    'Ya figura como PEDIDO NUEVO en el Panel Admin.',
    'It now shows as NEW ORDER in the Admin Panel.',
  ],
  'order.goAdmin': ['Ver en Panel Admin', 'View in Admin Panel'],
  'order.newConfig': ['Configurar otra pérgola', 'Configure another pergola'],
  'order.successTitle': ['¡Pedido registrado!', 'Order registered!'],
  'order.successDesc': [
    'El proveedor recibió el despiece completo con los datos de tu empresa y del cliente final.',
    'The supplier received the full BOM with your company and end-client details.',
  ],

  // ── Admin ────────────────────────────────────────────────────────────────
  'admin.panel': ['Panel del proveedor', 'Supplier panel'],
  'admin.dashboard': ['Dashboard', 'Dashboard'],
  'admin.users': ['Empresas', 'Companies'],
  'admin.orders': ['Pedidos', 'Orders'],
  'admin.catalog': ['Catálogo', 'Catalog'],
  'admin.settings': ['Configuración', 'Settings'],
  'admin.welcome': ['Resumen general', 'General overview'],
  'admin.welcomeDesc': [
    'Actividad de las empresas instaladoras y pedidos de materiales entrantes.',
    'Installer company activity and incoming materials orders.',
  ],
  'kpi.activeCompanies': ['Empresas activas', 'Active companies'],
  'kpi.inactiveCompanies': ['Empresas inactivas', 'Inactive companies'],
  'kpi.ordersMonth': ['Pedidos del mes', 'Orders this month'],
  'kpi.topMaterial': ['Material más pedido', 'Top material'],
  'chart.ordersByMonth': ['Pedidos por mes', 'Orders per month'],
  'chart.topMaterials': ['Top materiales pedidos', 'Top requested materials'],
  'chart.companiesActivity': ['Empresas por actividad', 'Companies by activity'],
  'chart.units': ['unidades', 'units'],

  'users.title': ['Empresas de pérgolas', 'Pergola companies'],
  'users.desc': [
    'Las empresas instaladoras que usan el configurador.',
    'Installer companies using the configurator.',
  ],
  'users.company': ['Empresa', 'Company'],
  'users.status': ['Estado', 'Status'],
  'users.plan': ['Plan', 'Plan'],
  'users.lastAccess': ['Último acceso', 'Last access'],
  'users.orders': ['Pedidos', 'Orders'],
  'users.active': ['Activo', 'Active'],
  'users.inactive': ['Inactivo', 'Inactive'],
  'users.all': ['Todas', 'All'],
  'users.search': ['Buscar empresa…', 'Search company…'],
  'users.empty': ['No hay empresas con ese filtro.', 'No companies match this filter.'],
  'users.detail': ['Detalle de la empresa', 'Company detail'],
  'users.contact': ['Contacto', 'Contact'],
  'users.since': ['Cliente desde', 'Customer since'],
  'users.region': ['Región', 'Region'],
  'users.lastOrders': ['Últimos pedidos', 'Latest orders'],
  'users.noOrders': ['Sin pedidos registrados.', 'No orders on record.'],

  'orders.title': ['Pedidos de despiece', 'BOM orders'],
  'orders.desc': [
    'Pedidos de materiales enviados por las empresas.',
    'Materials orders sent by the companies.',
  ],
  'orders.id': ['Pedido', 'Order'],
  'orders.from': ['Empresa', 'Company'],
  'orders.client': ['Cliente final', 'End client'],
  'orders.model': ['Modelo', 'Model'],
  'orders.date': ['Fecha', 'Date'],
  'orders.status': ['Estado', 'Status'],
  'orders.new': ['Nuevo', 'New'],
  'orders.prep': ['En preparación', 'In preparation'],
  'orders.sentSt': ['Enviado', 'Shipped'],
  'orders.detail': ['Detalle del pedido', 'Order detail'],
  'orders.changeStatus': ['Cambiar estado', 'Change status'],
  'orders.statusChanged': ['Estado actualizado', 'Status updated'],
  'orders.empty': ['No hay pedidos con ese filtro.', 'No orders match this filter.'],
  'orders.fromDemo': ['Creado en esta sesión', 'Created in this session'],
  'orders.materials': ['Materiales del pedido', 'Order materials'],
  'orders.notesLabel': ['Notas', 'Notes'],

  // ── DevNotices ───────────────────────────────────────────────────────────
  'dev.title': ['Nota de desarrollo', 'Development note'],
  'dev.pdf': [
    'La descarga del despiece en PDF con la marca del proveedor está en desarrollo. Hoy la demo muestra el listado en pantalla; al desarrollar se genera el PDF con logo, precios y condiciones comerciales.',
    'The branded PDF download of the BOM is in development. Today the demo shows the list on screen; once developed it generates the PDF with logo, pricing and commercial terms.',
  ],
  'dev.catalog': [
    'Los materiales y precios son de muestra. Al desarrollar, el despiece se calcula contra el catálogo real del proveedor con stock y lista de precios vigente.',
    'Materials and prices are samples. Once developed, the BOM is calculated against the supplier’s real catalog with live stock and price list.',
  ],
  'dev.db': [
    'Los pedidos de esta demo viven solo en tu navegador. Al desarrollar se guardan en la base de datos del proveedor con notificación automática por email y WhatsApp.',
    'Orders in this demo live only in your browser. Once developed they are stored in the supplier’s database with automatic email and WhatsApp notifications.',
  ],
  'dev.users': [
    'El alta, baja y facturación de empresas es simulada. Al desarrollar se conecta con el sistema de cuentas y planes del proveedor.',
    'Company onboarding, deactivation and billing are simulated. Once developed it connects to the supplier’s accounts and plans system.',
  ],
  'dev.3d': [
    'Los modelos 3D son una representación estilizada para la demo. En producción se cargan los modelos CAD reales del proveedor con medidas exactas.',
    'The 3D models are a stylized representation for the demo. In production the supplier’s real CAD models with exact dimensions are loaded.',
  ],
  'dev.settings': [
    'La configuración de cuenta, roles y permisos es simulada en esta previsualización.',
    'Account, role and permission settings are simulated in this preview.',
  ],


  // ── Navegación comercial ─────────────────────────────────────────────────
  'nav.comercial': ['Comercial', 'Commercial'],
  'nav.propuesta': ['Propuesta', 'Proposal'],

  // ── Welcome modal ────────────────────────────────────────────────────────
  'welcome.hi': ['Hola {nombre} 👋', 'Hi {nombre} 👋'],
  'welcome.intro': [
    'Somos Juan y Fede de Insights. Construimos este MVP para que veas tu plataforma funcionando antes de invertir.',
    'We\u2019re Juan and Fede from Insights. We built this MVP so you can see your platform working before investing.',
  ],
  'welcome.body': [
    'Tus empresas de pérgolas van a poder configurar en 3D la pérgola del cliente, generar la imagen realista de cómo quedaría, y al confirmar reciben el despiece exacto de materiales que te llega como pedido a tu panel.',
    'Your pergola companies will be able to configure the client\u2019s pergola in 3D, generate a realistic image of how it would look, and on confirmation they get the exact bill of materials that reaches your panel as an order.',
  ],
  'welcome.close': [
    'Si te gusta lo que ves, hacé clic en «Quiero arrancar» y arrancamos.',
    'If you like what you see, click «I want to start» and we get going.',
  ],
  'welcome.cta': ['Ver la plataforma', 'See the platform'],

  // ── Imagen realista con IA ───────────────────────────────────────────────
  'ia.title': ['Imagen realista con IA', 'Realistic AI image'],
  'ia.eyebrow': ['Vista previa para el cliente', 'Client preview'],
  'ia.subtitle': [
    'Así vería tu cliente la pérgola instalada en su casa, con la configuración que acaban de armar.',
    'This is how your client would see the pergola installed at home, with the configuration you just built.',
  ],
  'ia.cta': ['Generar imagen realista', 'Generate realistic image'],
  'ia.generating': ['Generando la imagen…', 'Generating the image…'],
  'ia.regenerate': ['Generar otra variante', 'Generate another variant'],
  'ia.light': ['Iluminación', 'Lighting'],
  'ia.day': ['Día', 'Daylight'],
  'ia.dusk': ['Atardecer', 'Dusk'],
  'ia.night': ['Noche', 'Night'],
  'ia.compare': ['Antes / Después', 'Before / After'],
  'ia.before': ['Antes', 'Before'],
  'ia.after': ['Después', 'After'],
  'ia.dragHint': ['Arrastrá el control para comparar', 'Drag the handle to compare'],
  'ia.download': ['Descargar imagen', 'Download image'],
  'ia.backToConfig': ['Volver al configurador', 'Back to configurator'],
  'ia.toBom': ['Ver despiece', 'View bill of materials'],
  'ia.scene': ['Escena', 'Scene'],
  'ia.scenePatio': ['Patio de casa', 'Home patio'],
  'ia.scenePool': ['Borde de pileta', 'Poolside'],
  'ia.sceneTerrace': ['Terraza urbana', 'Urban terrace'],
  'dev.ia': [
    'Imagen realista con IA · función en desarrollo — En la demo la imagen es de ejemplo; al desarrollar se genera una imagen fotorrealista real a partir de la foto del patio del cliente y la configuración elegida.',
    'Realistic AI image · feature in development — In the demo the image is a sample; once developed, a truly photorealistic image is generated from the photo of the client\u2019s patio and the chosen configuration.',
  ],

  // ── Propuesta comercial ──────────────────────────────────────────────────
  'prop.badge': ['Propuesta comercial', 'Commercial proposal'],
  'prop.title': ['Propuesta para {nombre}', 'Proposal for {nombre}'],
  'prop.subtitle': [
    'Plataforma de configuración 3D de pérgolas con despiece automático de materiales y pedidos centralizados.',
    '3D pergola configuration platform with automatic bill of materials and centralized orders.',
  ],
  'prop.print': ['Imprimir', 'Print'],
  'prop.whatsapp': ['Avanzar por WhatsApp', 'Move forward on WhatsApp'],

  // Circuito
  'prop.flowTitle': ['El circuito', 'How it works'],
  'prop.step': ['Paso', 'Step'],
  'prop.step1': [
    'La empresa de pérgolas entra a su cuenta segura y elige el modelo (Solstice o Tuuci).',
    'The pergola company signs in to its secure account and picks the model (Solstice or Tuuci).',
  ],
  'prop.step2': [
    'Configura la pérgola en 3D con el cliente delante: medidas, techo, paredes, add-ons, y la gira en vivo.',
    'Configures the pergola in 3D with the client right there: sizes, roof, walls, add-ons, and rotates it live.',
  ],
  'prop.step3': [
    'Genera la imagen realista para que el cliente vea cómo quedaría en su casa y se decida.',
    'Generates the realistic image so the client sees how it would look at home and makes up their mind.',
  ],
  'prop.step4': [
    'Al confirmar, el sistema arma el despiece: el listado exacto de cada material a comprar.',
    'On confirmation, the system builds the BOM: the exact list of every material to buy.',
  ],
  'prop.step5': [
    'Envía el pedido y te llega a tu panel, con la empresa y el cliente final identificados.',
    'Sends the order and it reaches your panel, with the company and the end client identified.',
  ],
  'prop.flowFoot': [
    'Y cada pedido queda registrado y listo para que lo prepares y despaches.',
    'And every order stays on record, ready for you to prepare and ship.',
  ],

  // Módulos
  'prop.modulesTitle': ['Qué incluye la plataforma', 'What the platform includes'],
  'prop.modulesCount': ['{n} módulos', '{n} modules'],
  'prop.seeDemo': ['Ver en el demo', 'See it in the demo'],

  'prop.m1.name': ['Renderizador 3D estilo Solstice', 'Solstice-style 3D renderer'],
  'prop.m1.desc': [
    'Configurador de pérgola de aluminio moderna, se gira en vivo.',
    'Modern aluminum pergola configurator, rotates live.',
  ],
  'prop.m1.b1': ['Dimensiones, postes y paredes', 'Dimensions, posts and walls'],
  'prop.m1.b2': ['Techo de lamas o panel', 'Louvered or panel roof'],
  'prop.m1.b3': ['Add-ons (LED, ventilador)', 'Add-ons (LED, fan)'],
  'prop.m1.b4': ['Acabados de color', 'Color finishes'],

  'prop.m2.name': ['Renderizador 3D estilo Tuuci', 'Tuuci-style 3D renderer'],
  'prop.m2.desc': [
    'Configurador de pérgola/cabana premium de madera.',
    'Premium wooden pergola/cabana configurator.',
  ],
  'prop.m2.b1': ['Varios sub-modelos', 'Several sub-models'],
  'prop.m2.b2': ['Acabados de madera', 'Wood finishes'],
  'prop.m2.b3': ['Lona/canopy de color', 'Colored fabric canopy'],
  'prop.m2.b4': ['Look resort', 'Resort look'],

  'prop.m3.name': ['Despiece automático de materiales', 'Automatic bill of materials'],
  'prop.m3.desc': [
    'Al terminar, el listado completo de cada pieza.',
    'When finished, the complete list of every piece.',
  ],
  'prop.m3.b1': ['Código y cantidad por material', 'Code and quantity per material'],
  'prop.m3.b2': ['Calculado desde la configuración', 'Calculated from the configuration'],
  'prop.m3.b3': ['Exportable', 'Exportable'],
  'prop.m3.b4': ['Base para el pedido', 'Basis for the order'],

  'prop.m4.name': ['Imagen realista con IA', 'Realistic AI image'],
  'prop.m4.desc': [
    'Foto realista de cómo quedaría instalada.',
    'Realistic photo of how it would look installed.',
  ],
  'prop.m4.b1': ['A partir de la config elegida', 'From the chosen configuration'],
  'prop.m4.b2': ['Variantes de iluminación', 'Lighting variants'],
  'prop.m4.b3': ['Lista para mostrarle al cliente', 'Ready to show the client'],
  'prop.m4.b4': ['Descargable', 'Downloadable'],

  'prop.m5.name': ['Pedido de materiales centralizado', 'Centralized materials order'],
  'prop.m5.desc': [
    'Envía el despiece como pedido al proveedor.',
    'Sends the BOM to the supplier as an order.',
  ],
  'prop.m5.b1': ['Formulario con empresa y cliente final', 'Form with company and end client'],
  'prop.m5.b2': ['Opción WhatsApp', 'WhatsApp option'],
  'prop.m5.b3': ['Queda registrado', 'Stays on record'],
  'prop.m5.b4': ['Notificación al proveedor', 'Supplier notification'],

  'prop.m6.name': ['Panel de administración del proveedor', 'Supplier admin panel'],
  'prop.m6.desc': ['Control total de la operación.', 'Full control of the operation.'],
  'prop.m6.b1': ['Empresas activas e inactivas', 'Active and inactive companies'],
  'prop.m6.b2': ['Pedidos entrantes con detalle', 'Incoming orders with detail'],
  'prop.m6.b3': ['Estados del pedido', 'Order statuses'],
  'prop.m6.b4': ['Métricas', 'Metrics'],

  'prop.m7.name': ['Seguridad y accesos multi-usuario', 'Security and multi-user access'],
  'prop.m7.desc': [
    'Cada empresa cliente con su cuenta y acceso seguro.',
    'Each client company with its own account and secure access.',
  ],
  'prop.m7.b1': ['Cuentas por empresa', 'Accounts per company'],
  'prop.m7.b2': ['Permisos por rol', 'Role-based permissions'],
  'prop.m7.b3': ['Acceso seguro a la base de datos de pedidos', 'Secure access to the orders database'],
  'prop.m7.b4': [
    'El proveedor ve todo desde el panel central',
    'The supplier sees everything from the central panel',
  ],

  // Inversión
  'prop.investTitle': ['Inversión', 'Investment'],
  'prop.investShow': ['Ver inversión', 'View investment'],
  'prop.investHide': ['Ocultar inversión', 'Hide investment'],
  'prop.investTotal': ['Inversión total', 'Total investment'],
  'prop.delivery': ['Entrega', 'Delivery'],
  'prop.deliveryValue': ['2 meses', '2 months'],
  'prop.includes': ['Incluye', 'Includes'],
  'prop.includesValue': [
    'Plataforma completa — Renderizador 3D Solstice + Tuuci, despiece automático, imagen realista con IA, pedidos centralizados, panel de administración, y seguridad/accesos multi-usuario.',
    'Complete platform — Solstice + Tuuci 3D renderer, automatic BOM, realistic AI image, centralized orders, admin panel, and security/multi-user access.',
  ],
  'prop.payment': ['Condiciones de pago', 'Payment terms'],
  'prop.paymentValue': ['50% al inicio / 50% a la entrega', '50% upfront / 50% on delivery'],
  'prop.discount': [
    'Pagando el 100% por adelantado: 15% de descuento',
    'Paying 100% upfront: 15% discount',
  ],

  // Cierre
  'prop.closeTitle': ['¿Arrancamos?', 'Shall we start?'],
  'prop.closeDesc': [
    'Escribinos y coordinamos el arranque esta misma semana.',
    'Write to us and we can kick off this very week.',
  ],

  // Previsualización con retorno
  'prop.backToProposal': ['Volver a la propuesta', 'Back to the proposal'],
  'prop.watching': ['Estás viendo:', 'You are viewing:'],

  // ── Varios ───────────────────────────────────────────────────────────────
  'misc.soon': ['Disponible al desarrollar', 'Available once developed'],
  'misc.close': ['Cerrar', 'Close'],
  'misc.of': ['de', 'of'],
  'misc.yes': ['Sí', 'Yes'],
  'misc.no': ['No', 'No'],
  'misc.none': ['Ninguno', 'None'],
  'misc.optional': ['opcional', 'optional'],
  'misc.total': ['Total', 'Total'],
  'misc.view': ['Ver', 'View'],
  'misc.filter': ['Filtrar', 'Filter'],
  'misc.copied': ['Copiado al portapapeles', 'Copied to clipboard'],
  'misc.notFound': ['No encontramos esta página.', 'We couldn’t find this page.'],
  'misc.goHome': ['Ir al inicio', 'Go home'],
}

type Vars = Record<string, string | number>
type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k: string, vars?: Vars) => string }
const LangCtx = createContext<Ctx | null>(null)

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      const v = localStorage.getItem('ins.lang')
      return v === 'en' ? 'en' : 'es'
    } catch {
      return 'es'
    }
  })

  useEffect(() => {
    document.documentElement.setAttribute('lang', lang)
    try {
      localStorage.setItem('ins.lang', lang)
    } catch {
      /* noop */
    }
  }, [lang])

  const setLang = useCallback((l: Lang) => setLangState(l), [])
  const t = useCallback(
    (k: string, vars?: Vars) => {
      const entry = DICT[k]
      if (!entry) return k
      const txt = lang === 'es' ? entry[0] : entry[1]
      if (!vars) return txt
      // Reemplaza {nombre} y demás marcadores del diccionario.
      return txt.replace(/\{(\w+)\}/g, (m, key) => (key in vars ? String(vars[key]) : m))
    },
    [lang],
  )

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t])
  return <LangCtx.Provider value={value}>{children}</LangCtx.Provider>
}

export function useT() {
  const ctx = useContext(LangCtx)
  if (!ctx) throw new Error('useT debe usarse dentro de <LangProvider>')
  return ctx
}
