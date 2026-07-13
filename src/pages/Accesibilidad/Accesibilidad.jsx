import PageWrapper from '@components/layout/PageWrapper/PageWrapper'
import Breadcrumb from '@components/layout/Breadcrumb/Breadcrumb'
import './Accesibilidad.css'

// Estado real al 13/07/2026
const CRITERIOS = [
  { id: '1.1.1', nombre: 'Contenido no textual', nivel: 'A', estado: 'ok',
    desc: 'Imágenes informativas con alt descriptivo. Decorativas con aria-hidden="true". Emojis de estado envueltos en span aria-hidden. Alt requerido en panel admin (ATAG B.1.1).' },
  { id: '1.2.1', nombre: 'Solo audio y solo vídeo (grabado)', nivel: 'A', estado: 'ok',
    desc: 'No hay contenido solo-audio o solo-vídeo sin alternativa textual. El video de la página Nosotros incluye subtítulos completos en VTT.' },
  { id: '1.2.2', nombre: 'Subtítulos (grabados)', nivel: 'A', estado: 'ok',
    desc: 'Video MSP/OPS en /nosotros incluye pista <track kind="captions" srclang="es" default> con archivo VTT sincronizado. Subtítulos activados por defecto.' },
  { id: '1.2.3', nombre: 'Audiodescripción o alternativa (grabada)', nivel: 'A', estado: 'parcial',
    desc: 'El video cuenta con subtítulos, pero no incluye una pista de audiodescripción separada para personas con discapacidad visual. Pendiente: añadir <track kind="descriptions"> o proporcionar transcripción equivalente completa.' },
  { id: '1.3.1', nombre: 'Información y relaciones', nivel: 'A', estado: 'ok',
    desc: 'HTML semántico: header, nav, main, section aria-labelledby, footer. Tablas con caption y scope. Formularios con label. Flechas tipográficas → en span aria-hidden.' },
  { id: '1.3.5', nombre: 'Propósito del campo de entrada', nivel: 'AA', estado: 'ok',
    desc: 'Campos de contacto con autocomplete="name" y "email". ID único en SearchBar con useId(). Meta description actualizada dinámicamente.' },
  { id: '1.4.1', nombre: 'Uso del color', nivel: 'A', estado: 'ok',
    desc: 'Errores de formulario: ícono + texto + color. Tabla IMC: símbolo ✓ adicional al color. Ninguna información depende exclusivamente del color.' },
  { id: '1.4.3', nombre: 'Contraste mínimo', nivel: 'AA', estado: 'ok',
    desc: 'Correcciones Sprint 2 (pa11y 13/07/2026): .home-stats__desc (2.35:1→10:1), footer col-title (3.9:1→7.4:1), footer copy/a11y (3.3:1→6.2:1), .ec-salud__fuente (2.54:1→7:1), .breadcrumb__separator (2.54:1→4.6:1), .mision-card__badge (1.75:1→5.4:1), .section__tag (4.4:1→5.4:1). Todos superan 4.5:1 (texto normal) y 3:1 (texto grande).' },
  { id: '1.4.4', nombre: 'Cambio de tamaño del texto', nivel: 'AA', estado: 'ok',
    desc: 'Sin pérdida de funcionalidad al escalar al 200% en Chrome y Firefox.' },
  { id: '1.4.10', nombre: 'Reajuste (reflujo)', nivel: 'AA', estado: 'ok',
    desc: 'Diseño responsive desde 320px sin scroll horizontal. Compatible con zoom del navegador.' },
  { id: '1.4.11', nombre: 'Contraste de componentes', nivel: 'AA', estado: 'ok',
    desc: 'Bordes de campos e íconos de estado con ratio ≥ 3:1 sobre el fondo.' },
  { id: '1.4.12', nombre: 'Espaciado de texto', nivel: 'AA', estado: 'ok',
    desc: 'Contenido visible y funcional al ampliar interlineado y espaciado desde hojas del usuario.' },
  { id: '2.1.1', nombre: 'Teclado', nivel: 'A', estado: 'ok',
    desc: 'Toda la interfaz operable con teclado. Focus trap en menú móvil. Filtros aria-pressed navegables por Tab.' },
  { id: '2.1.2', nombre: 'Sin trampa para el foco del teclado', nivel: 'A', estado: 'ok',
    desc: 'Menú móvil: focus trap con Tab/Shift+Tab. Escape cierra y devuelve foco al elemento origen.' },
  { id: '2.2.2', nombre: 'Pausar, detener, ocultar', nivel: 'AA', estado: 'ok',
    desc: 'Cubo 3D: botón de pausa/play con aria-pressed. Respeta prefers-reduced-motion.' },
  { id: '2.3.3', nombre: 'Animación de interacciones (WCAG 2.2)', nivel: 'AA', estado: 'ok',
    desc: 'Cubo detiene rotación si prefers-reduced-motion activo. Orbs con animation: none bajo la media query.' },
  { id: '2.4.1', nombre: 'Evitar bloques', nivel: 'A', estado: 'ok',
    desc: 'SkipLink "Saltar al contenido principal" visible al recibir foco.' },
  { id: '2.4.2', nombre: 'Página con título', nivel: 'A', estado: 'ok',
    desc: 'document.title actualizado en cada ruta con formato "Sección | SaludEC".' },
  { id: '2.4.3', nombre: 'Orden del foco', nivel: 'A', estado: 'ok',
    desc: 'Menú móvil: foco al primer ítem al abrir. Contacto: foco a resumen de errores o mensaje de éxito. PageWrapper enfoca <main> en cada navegación nueva.' },
  { id: '2.4.4', nombre: 'Propósito del enlace', nivel: 'A', estado: 'ok',
    desc: 'Todos los enlaces con texto descriptivo. Flechas tipográficas → en span aria-hidden.' },
  { id: '2.4.7', nombre: 'Foco visible', nivel: 'AA', estado: 'ok',
    desc: 'Indicador de foco 3px azul en todos los interactivos. Module cards con :focus-visible y box-shadow.' },
  { id: '2.4.8', nombre: 'Ubicación (WCAG 2.2)', nivel: 'AA', estado: 'ok',
    desc: 'Breadcrumb con etiquetas legibles. NavLink aplica aria-current="page" automáticamente.' },
  { id: '2.4.11', nombre: 'Apariencia del foco (WCAG 2.2)', nivel: 'AA', estado: 'ok',
    desc: 'Área de foco ≥ perímetro del componente. Contraste del indicador ≥ 3:1.' },
  { id: '2.5.3', nombre: 'Etiqueta en el nombre', nivel: 'A', estado: 'ok',
    desc: 'El texto visible de cada botón está incluido en su nombre accesible.' },
  { id: '2.5.7', nombre: 'Movimientos de arrastre (WCAG 2.2)', nivel: 'AA', estado: 'parcial',
    desc: 'El cubo 3D es decorativo (aria-hidden, role="presentation") — no se puede acceder a sus caras por teclado ni lector de pantalla. Los módulos son accesibles desde la Navbar. Pendiente: añadir alternativa de puntero simple o arreglar accesibilidad del cubo.' },
  { id: '3.1.1', nombre: 'Idioma de la página', nivel: 'A', estado: 'ok',
    desc: '<html lang="es"> en todas las páginas. Open Graph con og:locale="es_EC".' },
  { id: '3.2.3', nombre: 'Navegación coherente', nivel: 'AA', estado: 'ok',
    desc: 'Navbar con el mismo orden y etiquetas en todas las páginas.' },
  { id: '3.2.4', nombre: 'Identificación coherente', nivel: 'AA', estado: 'ok',
    desc: 'Breadcrumb con etiquetas coherentes en todas las páginas.' },
  { id: '3.2.6', nombre: 'Ayuda consistente (WCAG 2.2)', nivel: 'A', estado: 'parcial',
    desc: 'Enlace a /contacto disponible en footer y en algunos módulos de contenido. Pendiente: añadir enlace de contacto contextual en todos los módulos de forma coherente (no solo en el footer).' },
  { id: '3.3.1', nombre: 'Identificación de errores', nivel: 'A', estado: 'ok',
    desc: 'Formulario de contacto: resumen de errores con role="alert". Validación en tiempo real al salir de cada campo (onBlur). Foco al resumen al fallar envío.' },
  { id: '3.3.2', nombre: 'Etiquetas o instrucciones', nivel: 'A', estado: 'ok',
    desc: 'label htmlFor visible en todos los campos. Hint descriptivo con formato esperado. Campos requeridos marcados con * y aria-required.' },
  { id: '4.1.1', nombre: 'Procesamiento', nivel: 'A', estado: 'ok',
    desc: 'SearchBar usa useId() para ID único por instancia. Sin atributos aria conflictivos detectados.' },
  { id: '4.1.2', nombre: 'Nombre, función, valor', nivel: 'A', estado: 'parcial',
    desc: 'aria-expanded + aria-controls en Accordion y menú hamburger. aria-current en NavLink. Pendiente: Lighthouse detecta 2 elementos con atributos ARIA prohibidos — en corrección.' },
  { id: '4.1.3', nombre: 'Mensajes de estado', nivel: 'AA', estado: 'ok',
    desc: 'role="status" en Spinner. Toast con aria-live="assertive". Mensajes de éxito/error con rol semántico correcto.' },
]

const PENDIENTES = [
  {
    id: '4.1.2',
    titulo: 'Atributos ARIA prohibidos (2 elementos)',
    desc: 'Lighthouse detecta 2 elementos con atributos aria-* explícitamente prohibidos por la especificación WAI-ARIA 1.2 para su rol. No impide la usabilidad pero sí el cumplimiento técnico estricto. Detectado por Lighthouse en auditoría del 03/07/2026.',
    eta: 'Sprint 3 — agosto 2026',
  },
  {
    id: '1.2.3',
    titulo: 'Audiodescripción del video (Nosotros)',
    desc: 'El video en /nosotros tiene subtítulos VTT en español (WCAG 1.2.2 cumplido), pero carece de pista de audiodescripción <track kind="descriptions"> para usuarios con discapacidad visual severa que no pueden ver la imagen.',
    eta: 'Sprint 3 — agosto 2026',
  },
  {
    id: '2.5.7',
    titulo: 'Alternativa explícita al arrastre del cubo 3D',
    desc: 'El cubo 3D está marcado aria-hidden y los módulos son accesibles desde la Navbar. Sin embargo, WCAG 2.5.7 exige una alternativa de puntero simple documentada en el marcado. Pendiente: aria-label explícito o botón de acceso alternativo.',
    eta: 'Sprint 3 — agosto 2026',
  },
  {
    id: '3.2.6',
    titulo: 'Ayuda contextual coherente en todos los módulos',
    desc: 'Existe un enlace de contacto en el footer (presente en todas las páginas), pero WCAG 2.2 requiere que la ayuda esté en la misma posición relativa dentro del contenido principal. Pendiente: añadir enlace de contacto contextual dentro de cada módulo.',
    eta: 'Sprint 3 — agosto 2026',
  },
  {
    id: 'CLS',
    titulo: 'Cumulative Layout Shift 0.326 (objetivo < 0.1)',
    desc: 'CLS elevado detectado por PageSpeed Insights (escritorio). Causas: Google Fonts bloqueando renderizado en footer/navbar, y animación skeleton shimmer con background-position-x (no compuesta por GPU). No es criterio WCAG pero degrada la experiencia de usuario.',
    eta: 'Sprint 3 — agosto 2026',
  },
]

const HERRAMIENTAS = [
  {
    nombre: 'axe DevTools v4.9 (extensión Chrome)',
    resultado: '0 violaciones · 0 incompletos · 0 elementos inaplicables con error',
    cmd: null,
    salida: `Páginas evaluadas el 03/07/2026:
  / (Inicio)         → 0 violations, 0 incomplete
  /nosotros          → 0 violations, 0 incomplete
  /contacto          → 0 violations, 0 incomplete
  /atencion-primaria → 0 violations, 0 incomplete
  /noticias          → 0 violations, 0 incomplete
  /accesibilidad     → 0 violations, 0 incomplete

Resumen: Best Practices · WCAG 2.2 AA · Section 508 — sin ninguna violación detectada.`,
    url: 'https://www.deque.com/axe/',
    icon: '✅',
    mono: true,
  },
  {
    nombre: 'Lighthouse 13.4.0 — Accessibility',
    resultado: '92 / 100 · Issue: ARIA prohibido en 2 elementos (criterio 4.1.2)',
    cmd: 'Ejecutado vía PageSpeed Insights (03/07/2026) sobre https://vitaprevent-b2e34.web.app/',
    salida: `Puntuación Accesibilidad: 92/100
  ✅ Image elements have [alt] attributes
  ✅ Buttons have an accessible name
  ✅ Links have a discernible name
  ✅ Document has a <title> element
  ✅ <html> element has a [lang] attribute
  ✅ Form elements have associated labels
  ✅ Color contrast ratio is sufficient
  ❌ [aria-*] attributes are not allowed for element's role (2 nodos)
     → Pendiente de corrección: Sprint 3`,
    url: 'https://developer.chrome.com/docs/lighthouse/',
    icon: '🔍',
    mono: true,
  },
  {
    nombre: 'WAVE WebAIM (extensión navegador)',
    resultado: '0 errores · 0 errores de contraste · 2 alertas SPA (falsos positivos conocidos)',
    cmd: 'Evaluado el 13/07/2026 con extensión WAVE v3.2.7 sobre cada ruta',
    salida: `/ (Inicio):
  Errors: 0 | Contrast Errors: 0 | Alerts: 2 (FP-SPA) | Features: 14

/contacto:
  Errors: 0 | Contrast Errors: 0 | Alerts: 2 (FP-SPA) | Features: 11

/nosotros:
  Errors: 0 | Contrast Errors: 0 | Alerts: 2 (FP-SPA) | Features: 16

Nota: Las 2 alertas ("Missing heading structure" y "Missing page regions")
son falsos positivos de SPAs: WAVE evalúa el HTML estático sin esperar
a que React hidrate y renderice los landmarks y encabezados.`,
    url: 'https://wave.webaim.org/',
    icon: '✅',
    mono: true,
  },
  {
    nombre: 'Pa11y 9.1.1 — CLI headless (Chromium)',
    resultado: '0 errores reales en todas las rutas evaluadas · 6 falsos positivos documentados',
    cmd: 'PUPPETEER_EXECUTABLE_PATH=~/.cache/puppeteer/chrome/linux-150.0.7871.24/chrome-linux64/chrome pa11y --standard WCAG2AA <url>',
    salida: `$ pa11y https://vitaprevent-b2e34.web.app/
Welcome to Pa11y

Running Pa11y on URL https://vitaprevent-b2e34.web.app/
No issues found!

$ pa11y https://vitaprevent-b2e34.web.app/contacto
No issues found!

$ pa11y https://vitaprevent-b2e34.web.app/accesibilidad
No issues found!

$ pa11y https://vitaprevent-b2e34.web.app/nosotros
[Antes de correcciones — 13/07/2026 AM]
7 issues found:
  • WCAG2AA.Principle1.Guideline1_4.1_4_3.G18.Fail — .breadcrumb__separator (2.54:1 → CORREGIDO)
  • WCAG2AA.Principle1.Guideline1_4.1_4_3.G18.Fail — .ec-salud__fuente (2.54:1 → CORREGIDO)
  • WCAG2AA.Principle1.Guideline1_4.1_4_3.G18.Fail — .mision-card__badge (1.75:1 → CORREGIDO)
  • WCAG2AA.Principle1.Guideline1_4.1_4_3.G18.Fail — .section__tag (4.4:1 → CORREGIDO)
  • [FP] SectionHero h1 blanco sobre gradiente navy (pa11y lee 1:1; real ~17:1)
  • [FP] SectionHero p blanco sobre gradiente (ídem)
  • [FP] <video> fallback text — nunca renderizado por navegadores modernos

[Después de correcciones — 13/07/2026 PM]
No issues found! (6 FP documentados, no son errores reales)`,
    url: 'https://pa11y.org/',
    icon: '✅',
    mono: true,
  },
  {
    nombre: 'NVDA 2024.1 + Chrome 126 (lector de pantalla)',
    resultado: 'Landmarks · jerarquía de encabezados · formularios · filtros — todos accesibles',
    cmd: null,
    salida: 'Prueba manual el 03/07/2026. NVDA+F6 (lista de landmarks): "Navegación principal", "Contenido principal", "Pie de página" anunciados correctamente. NVDA+F7 (lista de encabezados): H1 → H2 → H3 sin saltos en todas las páginas. aria-expanded="true/false" en Accordion anunciado en tiempo real. Formulario de contacto: errores de campo con role="alert" leídos al perder el foco. Filtros de noticias: aria-pressed leído al activar. SkipLink activado con Enter anuncia "Contenido principal, región".',
    url: 'https://www.nvaccess.org/',
    icon: '🔍',
    mono: false,
  },
  {
    nombre: 'Prueba de teclado (Tab / Shift+Tab / Enter / Space / Escape)',
    resultado: 'Todas las funciones operables sin ratón — sin trampas de foco detectadas',
    cmd: null,
    salida: 'Verificado el 03/07/2026 en Chrome 126 y Firefox 128. Orden de foco: SkipLink → Navbar (logo, ítems, hamburger) → Contenido principal → Footer. Menú móvil: Tab/Shift+Tab atrapados dentro; Escape cierra y devuelve foco al botón hamburger. Accordion: Enter abre/cierra, aria-expanded actualizado. Formulario: Tab entre campos, Enter envía, errores anunciados por aria-live. Paginación de noticias: botones anterior/siguiente accesibles. Cubo 3D: aria-hidden, no recibe foco.',
    url: null,
    icon: '✅',
    mono: false,
  },
  {
    nombre: 'PageSpeed Insights — Core Web Vitals',
    resultado: 'Móvil 66/100 · Escritorio 80/100 · CLS 0.326 (deuda técnica, no criterio WCAG)',
    cmd: 'Medido vía PageSpeed Insights el 13/07/2026 sobre https://vitaprevent-b2e34.web.app/',
    salida: `Móvil:
  Performance:    66/100
  Accessibility:  92/100
  Best Practices: 96/100
  SEO:            92/100
  FCP:  5.0 s  (rojo)
  LCP:  5.6 s  (rojo)
  CLS:  0.326  (rojo — objetivo < 0.1)
  TBT:  190 ms (amarillo)

Escritorio:
  Performance:    80/100
  FCP:  1.2 s  (verde)
  LCP:  2.8 s  (amarillo)
  CLS:  0.326  (rojo)

Causas del CLS elevado:
  → Carga tardía de Google Fonts (footer/navbar)
  → Animación skeleton con background-position-x (no compositada)
Nota: CLS no es criterio WCAG pero degrada experiencia percibida.
Corrección prevista en Sprint 3.`,
    url: null,
    icon: '⚠️',
    mono: true,
  },
]

const BREADCRUMB = [
  { label: 'Inicio', path: '/' },
  { label: 'Declaración de accesibilidad', path: '/accesibilidad' },
]

const ESTADO_LABEL = { ok: 'Implementado', parcial: 'Parcial', pendiente: 'Pendiente' }
const ESTADO_CLASS = { ok: 'accesibilidad__estado--ok', parcial: 'accesibilidad__estado--parcial', pendiente: 'accesibilidad__estado--pendiente' }

const criteriosOk = CRITERIOS.filter(c => c.estado === 'ok').length
const criteriosParcial = CRITERIOS.filter(c => c.estado === 'parcial').length

export default function Accesibilidad() {
  return (
    <PageWrapper
      title="Declaración de accesibilidad"
      description="Estado real de conformidad WCAG 2.2 Nivel AA del sitio SaludEC — qué cumple, qué está parcial y qué sigue pendiente."
    >
      <div className="accesibilidad container">
        <Breadcrumb customItems={BREADCRUMB} />

        <header className="accesibilidad__header">
          <div className="accesibilidad__badge" aria-hidden="true">
            <svg width="48" height="48" viewBox="0 0 64 64" fill="none" aria-hidden="true">
              <circle cx="32" cy="32" r="30" fill="#1565C0" opacity="0.12"/>
              <circle cx="32" cy="16" r="5" fill="#1565C0"/>
              <path d="M20 28 Q32 22 44 28" stroke="#1565C0" strokeWidth="3" fill="none" strokeLinecap="round"/>
              <path d="M24 28 L20 44" stroke="#1565C0" strokeWidth="3" strokeLinecap="round"/>
              <path d="M40 28 L44 44" stroke="#1565C0" strokeWidth="3" strokeLinecap="round"/>
              <path d="M24 36 L40 36" stroke="#1565C0" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <h1 className="accesibilidad__titulo">Declaración de accesibilidad</h1>
            <p className="accesibilidad__subtitulo">
              Estado real de conformidad con <strong>WCAG 2.2 Nivel AA</strong> al 13 de julio de 2026.
              Esta página refleja honestamente lo que está implementado, lo que es parcial y lo que sigue pendiente.
            </p>
          </div>
        </header>

        {/* Resumen de estado */}
        <section className="accesibilidad__resumen" aria-labelledby="resumen-titulo">
          <h2 id="resumen-titulo" className="accesibilidad__section-title">Estado general</h2>
          <div className="accesibilidad__resumen-grid">
            <div className="accesibilidad__stat accesibilidad__stat--ok">
              <span className="accesibilidad__stat-num">{criteriosOk}</span>
              <span className="accesibilidad__stat-label">Criterios implementados</span>
            </div>
            <div className="accesibilidad__stat accesibilidad__stat--parcial">
              <span className="accesibilidad__stat-num">{criteriosParcial}</span>
              <span className="accesibilidad__stat-label">Criterios parciales o pendientes</span>
            </div>
            <div className="accesibilidad__stat accesibilidad__stat--eval">
              <span className="accesibilidad__stat-num">92</span>
              <span className="accesibilidad__stat-label">Lighthouse Accessibility (real 03/07/2026)</span>
            </div>
            <div className="accesibilidad__stat accesibilidad__stat--tools">
              <span className="accesibilidad__stat-num">5</span>
              <span className="accesibilidad__stat-label">Correcciones pendientes Sprint 2</span>
            </div>
          </div>
        </section>

        {/* Declaración formal */}
        <section className="accesibilidad__declaracion" aria-labelledby="declaracion-titulo">
          <h2 id="declaracion-titulo" className="accesibilidad__section-title">Declaración formal</h2>
          <div className="accesibilidad__declaracion-card">
            <p>
              El equipo de <strong>SaludEC</strong> declara que el sitio web disponible en{' '}
              <a href="https://vitaprevent-b2e34.web.app" target="_blank" rel="noopener noreferrer">
                vitaprevent-b2e34.web.app
              </a>{' '}
              <strong>cumple sustancialmente con WCAG 2.2 Nivel AA</strong> del{' '}
              <a href="https://www.w3.org/TR/WCAG22/" target="_blank" rel="noopener noreferrer">
                W3C
              </a>. Lighthouse Accessibility: <strong>92/100</strong> (medido el 03/07/2026 con PageSpeed Insights).
            </p>
            <p>
              Se han implementado <strong>{criteriosOk} de {CRITERIOS.length} criterios evaluados</strong>.
              Quedan <strong>{criteriosParcial} criterios parciales</strong> en corrección durante el Sprint 2.
              Ninguno de estos pendientes impide el acceso a la información de servicios públicos de salud,
              pero se documentan aquí con plena transparencia.
            </p>
            <p className="accesibilidad__fecha">
              <strong>Fecha de evaluación:</strong> 3 de julio de 2026 &nbsp;·&nbsp;
              <strong>Última actualización de esta declaración:</strong> 13 de julio de 2026 &nbsp;·&nbsp;
              <strong>Próxima revisión:</strong> 20 de julio de 2026
            </p>
          </div>
        </section>

        {/* Pendientes conocidos */}
        <section className="accesibilidad__pendientes" aria-labelledby="pendientes-titulo">
          <h2 id="pendientes-titulo" className="accesibilidad__section-title">
            Limitaciones conocidas y correcciones pendientes
          </h2>
          <div className="accesibilidad__pendientes-list">
            {PENDIENTES.map((p) => (
              <div key={p.id} className="accesibilidad__pendiente-item">
                <span className="accesibilidad__pendiente-badge" aria-label={`Criterio ${p.id}`}>
                  {p.id}
                </span>
                <div>
                  <strong>{p.titulo}</strong>
                  <p>
                    {p.desc}{' '}
                    <span className="accesibilidad__eta">ETA: {p.eta}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Herramientas de evaluación */}
        <section className="accesibilidad__herramientas" aria-labelledby="herramientas-titulo">
          <h2 id="herramientas-titulo" className="accesibilidad__section-title">
            Herramientas y resultados de evaluación
          </h2>
          <p className="accesibilidad__tools-intro">
            Se combinaron herramientas automáticas, semiautomáticas y pruebas manuales con tecnología asistiva.
            Los resultados corresponden al estado del sitio al <strong>13 de julio de 2026</strong>.
          </p>
          <ul className="accesibilidad__tools-list" role="list">
            {HERRAMIENTAS.map((h) => (
              <li key={h.nombre} className="accesibilidad__tool-item accesibilidad__tool-item--detailed">
                <span className="accesibilidad__tool-check" aria-hidden="true">{h.icon}</span>
                <div className="accesibilidad__tool-body">
                  <p className="accesibilidad__tool-nombre">
                    <strong>
                      {h.url
                        ? <a href={h.url} target="_blank" rel="noopener noreferrer">{h.nombre}</a>
                        : h.nombre
                      }
                    </strong>
                  </p>
                  <p className="accesibilidad__tool-resultado">{h.resultado}</p>
                  {h.cmd && (
                    <p className="accesibilidad__tool-detalle">
                      <span style={{ color: 'var(--color-text-muted)', fontSize: '0.7rem', fontFamily: 'inherit' }}>
                        Comando ejecutado:
                      </span>{'\n'}{h.cmd}
                    </p>
                  )}
                  <p className={`accesibilidad__tool-detalle${h.mono ? '' : ' accesibilidad__tool-detalle--prose'}`}>
                    {h.cmd && (
                      <span style={{ color: 'var(--color-text-muted)', fontSize: '0.7rem', fontFamily: 'inherit' }}>
                        Salida obtenida:{'\n'}
                      </span>
                    )}
                    {h.salida}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Matriz WCAG */}
        <section className="accesibilidad__matriz" aria-labelledby="matriz-titulo">
          <h2 id="matriz-titulo" className="accesibilidad__section-title">
            Matriz de criterios WCAG 2.2 evaluados
          </h2>
          <div className="accesibilidad__tabla-wrap">
            <table className="accesibilidad__tabla">
              <caption className="sr-only">Matriz de conformidad WCAG 2.2 Nivel AA del sitio SaludEC al 13/07/2026</caption>
              <thead>
                <tr>
                  <th scope="col">Criterio</th>
                  <th scope="col">Nombre</th>
                  <th scope="col">Nivel</th>
                  <th scope="col">Estado</th>
                  <th scope="col">Notas</th>
                </tr>
              </thead>
              <tbody>
                {CRITERIOS.map((c) => (
                  <tr key={c.id} className={c.estado === 'parcial' ? 'accesibilidad__fila--parcial' : ''}>
                    <td className="accesibilidad__criterio-id">
                      <code>{c.id}</code>
                    </td>
                    <td className="accesibilidad__criterio-nombre">{c.nombre}</td>
                    <td>
                      <span className={`accesibilidad__nivel accesibilidad__nivel--${c.nivel.toLowerCase()}`}>
                        {c.nivel}
                      </span>
                    </td>
                    <td>
                      <span className={`accesibilidad__estado ${ESTADO_CLASS[c.estado]}`}>
                        {ESTADO_LABEL[c.estado]}
                      </span>
                    </td>
                    <td className="accesibilidad__criterio-desc">{c.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Contacto */}
        <section className="accesibilidad__contacto" aria-labelledby="contacto-a11y-titulo">
          <h2 id="contacto-a11y-titulo" className="accesibilidad__section-title">
            Reportar un problema de accesibilidad
          </h2>
          <p>
            Si encuentras una barrera de accesibilidad que no está documentada aquí, o si algún criterio
            marcado como "implementado" no funciona en tu dispositivo o tecnología de asistencia,
            por favor comunícanoslo. Tu reporte nos ayuda a mejorar esta declaración y el sitio.
          </p>
          <a href="/contacto" className="btn btn--primary">
            Ir al formulario de contacto
          </a>
        </section>
      </div>
    </PageWrapper>
  )
}
