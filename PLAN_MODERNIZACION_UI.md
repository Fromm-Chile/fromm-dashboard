# Plan de Modernizacion UI - Fromm Dashboard

## Resumen del Proyecto Actual

- **Stack**: React 19 + TypeScript + Vite + Tailwind CSS 4
- **UI**: Componentes custom + Lucide icons, sin libreria de componentes externa
- **Estilo actual**: Fondo gris claro (#ecebeb), acento rojo (#ec2536), sidebar ancho, tarjetas con sombras, tipografia Poppins
- **Paginas**: ~16 paginas (dashboard, cotizaciones, contactos, clientes, servicio tecnico, admin, banners)

---

## Objetivo

Transformar el dashboard a un estilo **moderno y minimalista** manteniendo toda la funcionalidad existente. Inspiracion: dashboards tipo Linear, Vercel, Notion — limpios, con mucho espacio en blanco, tipografia clara y micro-interacciones sutiles.

---

## Fase 1: Sistema de Diseno Base

### Paso 1.1 — Definir nueva paleta de colores
- Reemplazar el fondo gris (#ecebeb) por **blanco puro (#ffffff)** o un gris muy sutil (#fafafa)
- Reducir el uso del rojo intenso (#ec2536) a solo acciones primarias criticas
- Introducir un **color primario neutro-oscuro** (slate/zinc de Tailwind) para encabezados y texto principal
- Definir colores de estado mas suaves y pastel (en lugar de green-400, yellow-500 saturados)
- Actualizar las CSS custom properties en `src/assets/index.css`

### Paso 1.2 — Actualizar tipografia
- Evaluar cambiar de Poppins a una fuente mas moderna como **Inter** o **Geist Sans** (mas legible en dashboards)
- Reducir tamanos de fuente generales (los `text-3xl` de titulos bajarlos a `text-2xl` o `text-xl`)
- Usar `font-medium` en lugar de `font-bold` para encabezados — se ve mas limpio
- Establecer jerarquia tipografica consistente: h1, h2, h3, body, caption

### Paso 1.3 — Definir espaciado y bordes
- Aumentar el espaciado general (mas "breathing room" entre elementos)
- Cambiar de `rounded-lg` con sombras a **bordes sutiles** (`border border-gray-200`) — tendencia actual
- Reducir o eliminar box-shadows en tarjetas, reemplazar con bordes finos
- Estandarizar padding interno de tarjetas y secciones

---

## Fase 2: Layout y Navegacion

### Paso 2.1 — Redisenar Sidebar (`Layout.tsx`)
- Reducir el ancho del sidebar de 330px a **240px** (o menos)
- Simplificar los items del menu: quitar iconos pesados, usar solo texto con indicador sutil de pagina activa
- Cambiar el fondo oscuro del sidebar a **blanco con borde derecho** (`border-r border-gray-200`)
- El logo y branding del header deben ser mas compactos
- Mejorar la animacion de colapso del sidebar (transicion suave)

### Paso 2.2 — Redisenar Header
- Hacer el header mas delgado y limpio
- Mover el saludo del usuario a algo mas discreto (solo nombre + avatar pequeno)
- Agregar un breadcrumb sutil para navegacion contextual
- El area de contenido principal debe usar `max-w-[1280px]` con `mx-auto` y padding lateral generoso

### Paso 2.3 — Mejorar MenuItem (`MenuItem.tsx`)
- Redisenar los items de navegacion: fondo transparente por defecto, `bg-gray-100` sutil al hacer hover
- Item activo: texto en color primario + indicador lateral izquierdo (barra vertical de 2-3px)
- Reducir el tamano de los iconos y espaciado entre items
- Tipografia mas pequena y ligera para los items del menu

---

## Fase 3: Componentes Core

### Paso 3.1 — Modernizar Tarjetas de Resumen (`Summary.tsx`)
- Redisenar las stat cards: fondo blanco, borde sutil, sin sombra pesada
- Numeros grandes en `font-semibold` con color oscuro
- Labels en gris claro y tamano pequeno
- Agregar un icono sutil o indicador de tendencia (flecha arriba/abajo)
- Layout en grid responsivo con gap consistente

### Paso 3.2 — Modernizar Tabla (`Table.tsx`)
- Simplificar el header de la tabla: sin fondo gris, solo un `border-b` mas grueso
- Filas con hover sutil (`hover:bg-gray-50`)
- Celdas con mas padding vertical para mejor legibilidad
- Badges de estado: usar pills con colores pastel y texto oscuro (en vez de fondos saturados)
- Paginacion: botones minimalistas tipo ghost buttons
- El buscador debe ser un input limpio con icono de lupa integrado

### Paso 3.3 — Modernizar Botones (`Button.tsx`)
- Boton primario: fondo oscuro (slate-900) con texto blanco, `rounded-md`, sin borde
- Boton secundario: fondo transparente, borde gris, texto oscuro
- Boton destructivo: mantener rojo pero mas sutil (rojo suave de fondo, texto rojo oscuro)
- Reducir el tamano general de los botones (padding mas compacto)
- Hover states sutiles con transicion de 150ms

### Paso 3.4 — Modernizar Inputs (`InputController.tsx`, `TextareaController.tsx`)
- Bordes mas finos y redondeados
- Focus state: ring azul/indigo sutil en vez de borde rojo
- Labels encima del input en gris medio, tamano pequeno
- Placeholders mas claros
- Reducir altura de los inputs ligeramente

### Paso 3.5 — Modernizar Modal (`ModalConfirmacion.tsx`)
- Overlay mas oscuro y con blur (`backdrop-blur-sm`)
- Modal con bordes redondeados mas grandes (`rounded-xl`)
- Botones de accion alineados a la derecha con espaciado consistente
- Animacion de entrada/salida suave (scale + opacity)

### Paso 3.6 — Modernizar Loader (`Loader.tsx`)
- Reemplazar spinner actual por un loader minimalista (barra de progreso thin o dots animados)
- Skeleton loaders para tablas y tarjetas mientras cargan datos (placeholder gris animado)

---

## Fase 4: Paginas Principales

### Paso 4.1 — Redisenar Login (`LogIn.tsx`)
- Layout centrado con fondo blanco limpio
- Card de login con sombra muy sutil o sin sombra
- Inputs modernos con labels flotantes o encima
- Boton de login prominente pero elegante
- Logo de Fromm centrado arriba del formulario

### Paso 4.2 — Redisenar Home / Inicio (`Home.tsx`, `Inicio.tsx`)
- Titulo de bienvenida mas discreto
- Dashboard cards en grid limpio con metricas claras
- Graficos (Recharts) con colores de la nueva paleta
- Mas espacio en blanco entre secciones

### Paso 4.3 — Redisenar paginas de listado (Cotizaciones, Contactos, Clientes, ServicioTecnico)
- Header de pagina: titulo + descripcion breve + boton de accion primaria alineado a la derecha
- Barra de filtros: inline, compacta, con selects y search integrados
- Tabla ocupando el ancho completo del contenedor
- Empty states con ilustracion o icono sutil + mensaje claro

### Paso 4.4 — Redisenar paginas de detalle (DetalleCotizacion, DetalleContacto, etc.)
- Layout en secciones con titulos de seccion claros
- Informacion organizada en grid de 2-3 columnas
- Acciones (editar, eliminar, cambiar estado) agrupadas en area de acciones
- Historial/timeline con linea vertical sutil y puntos de estado
- Formularios de edicion inline o en paneles laterales

### Paso 4.5 — Redisenar formularios (NuevaCotizacion, NuevoUsuario)
- Layout de formulario centrado con ancho maximo de ~600px
- Campos agrupados en secciones logicas con separadores sutiles
- Validacion inline con mensajes de error en rojo suave
- Boton de submit fijo en la parte inferior o sticky

### Paso 4.6 — Redisenar Admin y Banners (AdminUsers, BannersFromm)
- Mismos patrones de listado modernizado
- Cards de usuario con avatar placeholder y info compacta
- Gestion de banners con preview visual limpio

---

## Fase 5: Micro-interacciones y Polish

### Paso 5.1 — Transiciones y animaciones
- Agregar `transition-colors duration-150` a todos los elementos interactivos
- Sidebar collapse/expand con animacion suave
- Modales con fade-in y scale sutil
- Filas de tabla con hover transition suave

### Paso 5.2 — Estados vacios y feedback
- Disenar empty states para tablas sin datos (icono + mensaje + CTA)
- Loading skeletons en lugar de spinners donde sea posible
- Feedback visual en acciones exitosas (toast notification minimalista)

### Paso 5.3 — Responsive y detalles finales
- Asegurar que el contenedor principal no tenga `min-w` fijo — hacerlo flexible
- Revisar que todos los componentes se vean bien en pantallas de 1280px a 1920px
- Consistencia final: revisar que todos los bordes, sombras, colores y espaciados sean uniformes

---

## Orden de Ejecucion Sugerido

| # | Paso | Impacto | Archivos principales |
|---|------|---------|---------------------|
| 1 | 1.1 Paleta de colores | Alto | `index.css` |
| 2 | 1.2 Tipografia | Alto | `index.css`, todos los componentes |
| 3 | 2.1 Sidebar | Alto | `Layout.tsx`, `MenuItem.tsx` |
| 4 | 2.2 Header | Medio | `Layout.tsx` |
| 5 | 3.3 Botones | Alto | `Button.tsx` |
| 6 | 3.4 Inputs | Medio | `InputController.tsx`, `TextareaController.tsx` |
| 7 | 3.2 Tabla | Alto | `Table.tsx`, `SelectTable.tsx` |
| 8 | 3.1 Summary cards | Medio | `Summary.tsx` |
| 9 | 3.5 Modal | Bajo | `ModalConfirmacion.tsx` |
| 10 | 3.6 Loader | Bajo | `Loader.tsx` |
| 11 | 4.1 Login | Medio | `LogIn.tsx` |
| 12 | 4.2 Home/Inicio | Medio | `Home.tsx`, `Inicio.tsx` |
| 13 | 4.3 Listados | Alto | `Cotizaciones.tsx`, `Contactos.tsx`, etc. |
| 14 | 4.4 Detalles | Medio | `DetalleCotizacion.tsx`, etc. |
| 15 | 4.5 Formularios | Medio | `NuevaCotizacion.tsx`, `NuevoUsuario.tsx` |
| 16 | 4.6 Admin/Banners | Bajo | `AdminUsers.tsx`, `BannersFromm.tsx` |
| 17 | 5.1-5.3 Polish | Medio | Todos |

---

## Notas

- **No se agrega ninguna libreria nueva de UI** (como shadcn, Radix, etc.) — todo se logra con Tailwind CSS que ya esta en el proyecto
- **No se cambia funcionalidad** — solo estilos y presentacion visual
- **Se mantiene** la estructura de archivos actual
- Cada paso es incremental y el dashboard sigue funcional despues de cada cambio
