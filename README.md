# SaludEC

Portal de servicios públicos de salud del Ecuador — atención primaria, vacunación, salud mental y emergencias (MSP, IESS, ECU 911). Proyecto académico de la asignatura **Usabilidad y Accesibilidad (ISWD732)**, Escuela Politécnica Nacional.

**Sitio en producción:** https://vitaprevent-b2e34.web.app

---

## Contenido publicado (julio 2026)

| Tipo | Cantidad |
|---|---|
| Artículos publicados | **51** |
| Noticias | **18** |
| Recursos (PDF, infografías, videos) | **30** |
| Páginas públicas | **10** |
| Panel administrativo (rutas protegidas) | **5** |

---

## Usabilidad y accesibilidad

SaludEC adopta el enfoque *accessibility-first*: cada componente se diseña para cumplir con los principios **POUR** (Perceptible, Operable, Comprensible, Robusto) desde el inicio.

### Conformidad WCAG 2.2 Nivel AA

El sitio cumple sustancialmente con WCAG 2.2 Nivel AA. La declaración formal de conformidad está disponible en `/accesibilidad`. De 24 criterios evaluados, **22 están implementados (91.7%)**, 1 parcial y 1 pendiente (Sprint 3).

| Herramienta de evaluación | Resultado |
|---|---|
| Lighthouse Accessibility (PageSpeed Insights) | **92 / 100** |
| Lighthouse Performance escritorio / móvil | **80 / 66** |
| Lighthouse Best Practices | **96 / 100** |
| Lighthouse SEO | **100 / 100** |
| axe DevTools 4.9 | **0 violaciones** |
| WAVE WebAIM 3.2.7 | **0 errores · 0 errores de contraste** |
| Pa11y 9.1.1 (WCAG2AA) | **0 errores reales** · 6 falsos positivos documentados |
| NVDA + Chrome (teclado) | Sin barreras detectadas |

> Pa11y evalúa con Chromium headless. Los 6 falsos positivos son alertas WAVE sobre la estructura SPA antes de hidratación — con JS activo, landmarks y encabezados están completos.

### Criterios WCAG implementados (Sprint 1–3)

**Principio 1 — Perceptible**
- `1.1.1` Texto alternativo único y descriptivo por artículo
- `1.2.2` Subtítulos VTT en español para el video del sitio
- `1.3.1` HTML5 semántico: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`
- `1.4.3` Contraste mínimo 4.5:1 — 7 correcciones aplicadas en Sprint 2
- `1.4.10` Reflow: contenido usable a 320 px sin scroll horizontal
- `1.4.11` Contraste de componentes UI ≥ 3:1

**Principio 2 — Operable**
- `2.1.1` 100 % navegable por teclado; sin trampas de foco
- `2.4.1` SkipLink «Saltar al contenido principal» visible al recibir foco
- `2.4.3` PageWrapper gestiona foco al navegar entre rutas SPA
- `2.4.7` Indicador de foco visible con `outline` 3px teal
- `2.5.7` Alternativa al arrastre del cubo 3D: `<nav class="sr-only">` con enlaces directos a cada módulo

**Principio 3 — Comprensible**
- `3.1.1` `<html lang="es">`
- `3.2.3` Navbar idéntico en todas las páginas
- `3.2.6` Enlace de contacto en footer consistente en todas las páginas
- `3.3.1` Errores identificados con `role="alert"` y resumen accesible

**Principio 4 — Robusto**
- `4.1.1` HTML válido, sin IDs duplicados
- `4.1.2` `aria-live` eliminado de roles que ya definen región en vivo (`alert`, `status`, `log`)
- `4.1.3` Mensajes de estado con `role="status"` en spinners

### Criterios pendientes (Sprint 3)

| Criterio | Problema | Estado |
|---|---|---|
| 1.2.3 Audiodescripción | El video no tiene pista de audio describiendo la acción visual | Pendiente — requiere grabación |
| CLS Cumulative Layout Shift | Animación shimmer migrada a `transform`; PageSpeed móvil en mejora | En progreso |

---

## Módulos del portal

| Ruta | Sección | Contenido |
|---|---|---|
| `/` | Inicio | Hero con cubo 3D, estadísticas nacionales de salud y últimas noticias |
| `/atencion-primaria` | Atención Primaria | Artículos MSP, calculadora de IMC, centros de salud |
| `/vacunacion` | Vacunación | Calendario PAI infantil, esquemas adultos (IESS) |
| `/salud-mental` | Salud Mental | Bienestar emocional, mindfulness, recursos IESS |
| `/emergencias` | Emergencias | Prevención crónica, chequeos preventivos, ECU 911 |
| `/noticias` | Noticias | Feed paginado de actualidad en salud pública del Ecuador |
| `/recursos` | Recursos | Infografías, guías PDF, videos y podcasts oficiales |
| `/contacto` | Contacto | Formulario accesible con validación en tiempo real |
| `/nosotros` | Nosotros | Equipo, misión, visión y valores del proyecto |
| `/accesibilidad` | Accesibilidad | Declaración de conformidad WCAG 2.2 AA con matriz completa |

> `/biblioteca` redirige (301) a `/` — la sección fue consolidada en `/recursos`.  
> Las rutas antiguas `/nutricion`, `/actividad-fisica`, `/prevencion` hacen `<Navigate replace>` a sus equivalentes actuales.

---

## Arquitectura técnica

### Stack

| Capa | Tecnología | Versión |
|---|---|---|
| Frontend | React + Vite | 19 / 6 |
| Enrutamiento | React Router | v6 (createBrowserRouter) |
| Base de datos | Firebase Firestore | SDK v11 |
| Autenticación | Firebase Auth | Email/Password |
| Hosting | Firebase Hosting | Plan Spark (gratuito) |
| CI/CD | GitHub Actions | `.github/workflows/` |
| Estilos | CSS Custom Properties (design tokens) | Sin framework CSS |

### Seguridad HTTP (firebase.json)

Cabeceras aplicadas a todas las rutas en producción:

- `Content-Security-Policy` — restringe scripts, estilos, fuentes e imágenes a orígenes conocidos
- `Strict-Transport-Security` — HTTPS forzado · `max-age=63072000; includeSubDomains; preload`
- `X-Frame-Options: DENY` — previene clickjacking
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` — bloquea cámara, micrófono y geolocalización

### Estructura del proyecto

```
src/
├── components/       # Componentes reutilizables
│   ├── layout/       # Navbar, Footer, PageWrapper, AdminShell, SkipLink
│   └── common/       # Skeleton, ErrorBoundary, Modal, Toast, Breadcrumb
├── pages/            # Una carpeta por ruta (JSX + CSS colocalizados)
├── services/         # Capa Firestore (articulos, noticias, recursos, cleanup)
├── config/           # ROUTES, constantes globales, Firebase init
├── context/          # AuthContext (sesión admin)
└── hooks/            # useArticulos, useNoticias, useRecursos, useAdmin
```

### Panel de administración

Rutas en `/admin/*` (autenticación Firebase requerida):

- `/admin` — Dashboard con contadores en tiempo real (51 art · 18 noticias · 30 recursos)
- `/admin/articulos` — CRUD completo con editor, categorías y slug automático
- `/admin/noticias` — Gestión del feed de noticias
- `/admin/recursos` — Biblioteca de recursos digitales
- `/admin/mensajes` — Bandeja de mensajes del formulario de contacto

### Optimizaciones de rendimiento

- Code splitting por ruta con `React.lazy` + `Suspense` (16 chunks)
- Google Fonts: `rel="preload"` + `onload` + `display=optional` (no bloqueante)
- Skeleton shimmer: `transform: translateX` en `::after` (compositor, sin repaint)
- `Cache-Control: immutable` en assets JS/CSS/fuentes
- Redirect 301 `/biblioteca → /` en firebase.json
- `public/sitemap.xml` con 11 rutas públicas

---

## Desarrollo local

```bash
# 1. Clonar e instalar
git clone https://github.com/zeuspyEC/SaludEC.git
cd SaludEC
npm install

# 2. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con las credenciales de Firebase

# 3. Servidor de desarrollo
npm run dev

# 4. Build de producción
npm run build
```

### Variables de entorno requeridas (`.env.local`)

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

### Despliegue manual

```bash
npm run build
firebase deploy --only hosting --project vitaprevent-b2e34
```

El despliegue automático ocurre en cada push a `main` mediante GitHub Actions.

---

## Documentación académica

Los documentos del proyecto se encuentran en `docs/`:

| Archivo | Contenido |
|---|---|
| `informe_vitaprevent.pdf` | Informe técnico completo con evidencias WCAG |
| `principios_wcag_evidencias.pdf` | Matriz POUR con salidas reales de herramientas |
| `SaludEC-Presentacion.pptx` | Presentación del proyecto (20 diapositivas) |

---

## Equipo

| Nombre | Rol principal | GitHub |
|---|---|---|
| Erick Costa | Coordinador / Frontend Lead / Accesibilidad | [@zeuspyEC](https://github.com/zeuspyEC) |
| Jonathan Tipán | Diseño de interfaz / UX / Frontend | [@michaelTipan](https://github.com/michaelTipan) |
| Javier Quilumba | Desarrollador / Redactor del informe | — |

**Escuela Politécnica Nacional · Ingeniería en Ciencias de la Computación · 2026**  
Asignatura: Usabilidad y Accesibilidad — ISWD732 GR3SW
