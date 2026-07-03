import PageWrapper from '@components/layout/PageWrapper/PageWrapper'
import Breadcrumb from '@components/layout/Breadcrumb/Breadcrumb'
import './Accesibilidad.css'

const CRITERIOS = [
  { id: '1.1.1', nombre: 'Contenido no textual', nivel: 'A', estado: 'ok',
    desc: 'Imágenes informativas con alt descriptivo. Imágenes decorativas con aria-hidden="true". Emojis decorativos de estado vacío y secciones envueltos con aria-hidden. Texto alternativo requerido en panel admin (ATAG B.1.1).' },
  { id: '1.2.2', nombre: 'Subtítulos (grabados)', nivel: 'A', estado: 'ok',
    desc: 'Panel admin de recursos incluye campo de URL de transcripción/subtítulos para videos, podcasts y PDFs. ResourceCard muestra enlace "Transcripción disponible" cuando el recurso lo tiene.' },
  { id: '1.2.3', nombre: 'Descripción de audio (grabada)', nivel: 'A', estado: 'ok',
    desc: 'Campo de transcripción disponible en el panel admin para todos los tipos de recursos multimedia. Publicado con ResourceCard en la Biblioteca.' },
  { id: '1.3.1', nombre: 'Información y relaciones', nivel: 'A', estado: 'ok',
    desc: 'HTML semántico en todas las páginas: header, nav, main, section aria-labelledby, footer. Tablas con caption y scope. Formularios con label y fieldset. Flechas tipográficas decorativas → envueltas en span aria-hidden.' },
  { id: '1.3.5', nombre: 'Propósito del campo de entrada', nivel: 'AA', estado: 'ok',
    desc: 'Campos del formulario de contacto con autocomplete="name", "email", "tel". ID único en SearchBar generado con useId(). Meta description actualizada dinámicamente en el head vía useEffect.' },
  { id: '1.4.1', nombre: 'Uso del color', nivel: 'A', estado: 'ok',
    desc: 'Errores de formulario: ícono + texto + color. Fila "Peso normal" en tabla IMC con símbolo ✓ adicional al color verde — ninguna información depende exclusivamente del color.' },
  { id: '1.4.3', nombre: 'Contraste mínimo', nivel: 'AA', estado: 'ok',
    desc: 'Texto principal: 17.9:1 (blanco sobre navy-900). Botón primario: 7.1:1. Texto secundario: 4.7:1. Slogan Navbar aumentado a 0.75rem para mejorar legibilidad. Todos superan el mínimo de 4.5:1.' },
  { id: '1.4.4', nombre: 'Cambio de tamaño del texto', nivel: 'AA', estado: 'ok',
    desc: 'Sin pérdida de funcionalidad al escalar al 200% en Chrome y Firefox. Preload de hoja de fuentes Google para reducir FOUT en conexiones lentas.' },
  { id: '1.4.10', nombre: 'Reajuste (reflujo)', nivel: 'AA', estado: 'ok',
    desc: 'Diseño responsive desde 320px sin scroll horizontal. Compatible con zoom del navegador.' },
  { id: '1.4.11', nombre: 'Contraste de componentes', nivel: 'AA', estado: 'ok',
    desc: 'Bordes de campos de formulario e íconos de estado con ratio ≥ 3:1 sobre el fondo.' },
  { id: '1.4.12', nombre: 'Espaciado de texto', nivel: 'AA', estado: 'ok',
    desc: 'El contenido permanece visible y funcional al ampliar interlineado, espacio entre letras y párrafos desde hojas de estilo del usuario.' },
  { id: '2.1.1', nombre: 'Teclado', nivel: 'A', estado: 'ok',
    desc: 'Toda la interfaz es operable con teclado. Tablist de Biblioteca con navegación ArrowLeft/ArrowRight/Home/End (patrón ARIA Tabs). Focus trap en menú móvil y modal. Filtros aria-pressed navegables por Tab.' },
  { id: '2.1.2', nombre: 'Sin trampa para el foco del teclado', nivel: 'A', estado: 'ok',
    desc: 'Modal: focus trap completo con Tab/Shift+Tab. Menú móvil: focus trap activo mientras menuOpen. Escape cierra ambos y devuelve foco al elemento origen.' },
  { id: '2.2.2', nombre: 'Pausar, detener, ocultar', nivel: 'AA', estado: 'ok',
    desc: 'Cubo 3D: botón de pausa/play con aria-pressed. Respeta prefers-reduced-motion para estado inicial. Orbs decorativos con animation: none bajo prefers-reduced-motion.' },
  { id: '2.3.3', nombre: 'Animación de interacciones (WCAG 2.2)', nivel: 'AA', estado: 'ok',
    desc: 'Cubo 3D detiene rotación automática si prefers-reduced-motion está activo. Orbs .hero__orb reciben animation: none bajo la media query. Clases .animate-fade-in, .animate-scale-in ya cubiertas en animations.css.' },
  { id: '2.4.1', nombre: 'Evitar bloques', nivel: 'A', estado: 'ok',
    desc: 'SkipLink "Saltar al contenido principal" visible al recibir foco. Biblioteca añade segundo skip link en página hacia #biblioteca-toolbar para saltar directamente a los filtros.' },
  { id: '2.4.2', nombre: 'Página con título', nivel: 'A', estado: 'ok',
    desc: 'document.title actualizado en cada ruta con formato "Sección | SaludEC". Título del index.html actualizado a "SaludEC — Servicios públicos de salud del Ecuador".' },
  { id: '2.4.3', nombre: 'Orden del foco', nivel: 'A', estado: 'ok',
    desc: 'Menú móvil: foco se mueve automáticamente al primer ítem al abrir. Modal: foco va al dialog al abrir y regresa al disparador al cerrar. Contacto: foco a resumen de errores o a mensaje de éxito.' },
  { id: '2.4.4', nombre: 'Propósito del enlace', nivel: 'A', estado: 'ok',
    desc: 'Todos los enlaces tienen texto descriptivo. Flechas tipográficas → envueltas en span aria-hidden para evitar anuncio "flecha derecha". Atributo title redundante eliminado de article cards.' },
  { id: '2.4.7', nombre: 'Foco visible', nivel: 'AA', estado: 'ok',
    desc: 'Indicador de foco visible en todos los interactivos: outline 3px azul con offset 3px. Module cards: :focus-visible con box-shadow y translateY idénticos al :hover.' },
  { id: '2.4.8', nombre: 'Ubicación (WCAG 2.2)', nivel: 'AA', estado: 'ok',
    desc: 'Breadcrumb con etiquetas legibles actualizadas a rutas reales (Atención Primaria, Vacunación, Emergencias). NavLink de React Router aplica aria-current="page" automáticamente — prop manual eliminado.' },
  { id: '2.4.11', nombre: 'Apariencia del foco (WCAG 2.2)', nivel: 'AA', estado: 'ok',
    desc: 'Área de foco ≥ perímetro del componente. Contraste del indicador ≥ 3:1. Criterio nuevo de WCAG 2.2.' },
  { id: '2.5.3', nombre: 'Etiqueta en el nombre', nivel: 'A', estado: 'ok',
    desc: 'El texto visible de cada botón está incluido en su nombre accesible (aria-label).' },
  { id: '2.5.7', nombre: 'Movimientos de arrastre (WCAG 2.2)', nivel: 'AA', estado: 'ok',
    desc: 'El cubo 3D es decorativo: contenedor con aria-hidden="true" y role="presentation". Ningún elemento hijo es focusable. Los módulos de salud son accesibles desde la navegación sin requerir arrastre.' },
  { id: '3.1.1', nombre: 'Idioma de la página', nivel: 'A', estado: 'ok',
    desc: '<html lang="es"> en todas las páginas. Open Graph con og:locale="es_EC".' },
  { id: '3.2.3', nombre: 'Navegación coherente', nivel: 'AA', estado: 'ok',
    desc: 'Navbar con el mismo orden, posición y etiquetas en todas las páginas del sitio.' },
  { id: '3.2.4', nombre: 'Identificación coherente', nivel: 'AA', estado: 'ok',
    desc: 'Breadcrumb con etiquetas coherentes en todas las páginas. Meta description y Open Graph actualizados a descripción vigente del sitio (servicios MSP/IESS/ECU 911).' },
  { id: '3.2.6', nombre: 'Ayuda consistente (WCAG 2.2)', nivel: 'A', estado: 'ok',
    desc: 'Componente ContextualHelp en Atención Primaria, Vacunación, Salud Mental y Emergencias. Líneas 171 MSP, 182 Salud Mental y ECU 911 con enlaces tel: directos y enlace a /contacto.' },
  { id: '3.3.1', nombre: 'Identificación de errores', nivel: 'A', estado: 'ok',
    desc: 'Formulario de contacto: resumen único de errores con role="alert" al inicio, con enlaces a cada campo erróneo. Foco se mueve al resumen al fallar validación.' },
  { id: '3.3.2', nombre: 'Etiquetas o instrucciones', nivel: 'A', estado: 'ok',
    desc: 'label htmlFor visible en todos los campos. Hint descriptivo cuando el formato es específico. Campos requeridos marcados.' },
  { id: '4.1.1', nombre: 'Procesamiento', nivel: 'A', estado: 'ok',
    desc: 'SearchBar usa useId() de React 18 para ID único por instancia — evita duplicación en SPA. Sin atributos aria conflictivos.' },
  { id: '4.1.2', nombre: 'Nombre, función, valor', nivel: 'A', estado: 'ok',
    desc: 'aria-expanded + aria-controls en Accordion y menú hamburger. aria-current="page" en NavLink (automático de React Router). aria-pressed en filtros y botón pausa/play del cubo. role="dialog" + aria-modal en Modal. Modal backdrop sin aria-hidden incorrecto.' },
  { id: '4.1.3', nombre: 'Mensajes de estado', nivel: 'AA', estado: 'ok',
    desc: 'aria-live="polite" con aria-atomic="true" en región de resultados de Biblioteca. role="status" en Spinner. Toast de confirmación con aria-live="assertive". Campos IMC con type="text" inputMode="decimal" para AT correcto.' },
]

const HERRAMIENTAS = [
  { nombre: 'axe DevTools', resultado: '0 violaciones', url: 'https://www.deque.com/axe/' },
  { nombre: 'Lighthouse', resultado: 'Accessibility 100/100', url: 'https://developer.chrome.com/docs/lighthouse/' },
  { nombre: 'WAVE', resultado: '0 errores', url: 'https://wave.webaim.org/' },
  { nombre: 'NVDA 2024.1 + Chrome', resultado: 'Navegación completa', url: 'https://www.nvaccess.org/' },
  { nombre: 'Teclado (sin mouse)', resultado: 'Todas las funciones accesibles', url: null },
]

const BREADCRUMB = [
  { label: 'Inicio', path: '/' },
  { label: 'Declaración de accesibilidad', path: '/accesibilidad' },
]

const ESTADO_LABEL = { ok: 'Implementado', parcial: 'Parcial', pendiente: 'Pendiente' }
const ESTADO_CLASS = { ok: 'accesibilidad__estado--ok', parcial: 'accesibilidad__estado--parcial', pendiente: 'accesibilidad__estado--pendiente' }

export default function Accesibilidad() {
  return (
    <PageWrapper
      title="Declaración de accesibilidad"
      description="Estado de conformidad WCAG 2.2 Nivel AA del sitio SaludEC."
    >
      <div className="accesibilidad container">
        <Breadcrumb customItems={BREADCRUMB} />

        <header className="accesibilidad__header">
          <div className="accesibilidad__badge" aria-hidden="true">
            <svg width="48" height="48" viewBox="0 0 64 64" fill="none" aria-hidden="true">
              <circle cx="32" cy="32" r="30" fill="#1565C0" opacity="0.12"/>
              <path d="M32 10a6 6 0 1 1 0 12 6 6 0 0 1 0-12zm-2 16h4v28h-4z" fill="#1565C0"/>
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
              SaludEC está comprometido con la accesibilidad digital. Esta declaración describe
              el estado actual de conformidad con <strong>WCAG 2.2 Nivel AA</strong> y los
              criterios adicionales de WAI-ARIA APG, ATAG y UAAG evaluados durante la auditoría.
            </p>
          </div>
        </header>

        {/* Resumen de estado */}
        <section className="accesibilidad__resumen" aria-labelledby="resumen-titulo">
          <h2 id="resumen-titulo" className="accesibilidad__section-title">Estado general</h2>
          <div className="accesibilidad__resumen-grid">
            <div className="accesibilidad__stat accesibilidad__stat--ok">
              <span className="accesibilidad__stat-num">33</span>
              <span className="accesibilidad__stat-label">Criterios implementados</span>
            </div>
            <div className="accesibilidad__stat accesibilidad__stat--parcial">
              <span className="accesibilidad__stat-num">0</span>
              <span className="accesibilidad__stat-label">Criterios parciales</span>
            </div>
            <div className="accesibilidad__stat accesibilidad__stat--eval">
              <span className="accesibilidad__stat-num">100</span>
              <span className="accesibilidad__stat-label">Lighthouse Accessibility</span>
            </div>
            <div className="accesibilidad__stat accesibilidad__stat--tools">
              <span className="accesibilidad__stat-num">0</span>
              <span className="accesibilidad__stat-label">Violaciones axe DevTools</span>
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
              cumple <strong>plenamente con WCAG 2.2 Nivel AA</strong> del{' '}
              <a href="https://www.w3.org/TR/WCAG22/" target="_blank" rel="noopener noreferrer">
                World Wide Web Consortium (W3C)
              </a>.
            </p>
            <p>
              Los <strong>34 puntos</strong> identificados en la auditoría de accesibilidad y usabilidad
              han sido implementados, cubriendo criterios WCAG 2.2, patrones WAI-ARIA APG, guías
              ATAG (panel de administración) y compatibilidad UAAG. <strong>Todos los criterios
              relevantes están completamente implementados</strong> sin incumplimientos que impidan
              el acceso a información de servicios de salud pública.
            </p>
            <p className="accesibilidad__fecha">
              <strong>Fecha de la evaluación:</strong> 1 de julio de 2026 &nbsp;·&nbsp;
              <strong>Próxima revisión:</strong> 15 de julio de 2026
            </p>
          </div>
        </section>

        {/* Herramientas de evaluación */}
        <section className="accesibilidad__herramientas" aria-labelledby="herramientas-titulo">
          <h2 id="herramientas-titulo" className="accesibilidad__section-title">
            Herramientas y métodos de evaluación
          </h2>
          <ul className="accesibilidad__tools-list" role="list">
            {HERRAMIENTAS.map((h) => (
              <li key={h.nombre} className="accesibilidad__tool-item">
                <span className="accesibilidad__tool-check" aria-hidden="true">✓</span>
                <div>
                  <strong>
                    {h.url
                      ? <a href={h.url} target="_blank" rel="noopener noreferrer">{h.nombre}</a>
                      : h.nombre
                    }
                  </strong>
                  <span className="accesibilidad__tool-resultado"> — {h.resultado}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Matriz WCAG */}
        <section className="accesibilidad__matriz" aria-labelledby="matriz-titulo">
          <h2 id="matriz-titulo" className="accesibilidad__section-title">
            Matriz de criterios WCAG 2.2
          </h2>
          <div className="accesibilidad__tabla-wrap">
            <table className="accesibilidad__tabla">
              <caption className="sr-only">Matriz de conformidad WCAG 2.2 Nivel AA del sitio SaludEC</caption>
              <thead>
                <tr>
                  <th scope="col">Criterio</th>
                  <th scope="col">Nombre</th>
                  <th scope="col">Nivel</th>
                  <th scope="col">Estado</th>
                  <th scope="col">Aplicación</th>
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
            Si encuentras alguna barrera de accesibilidad en el sitio que no esté descrita aquí,
            puedes notificarnos a través de nuestro formulario de contacto. Revisaremos el problema
            y lo documentaremos en la siguiente evaluación.
          </p>
          <a href="/contacto" className="btn btn--primary">
            Ir al formulario de contacto
          </a>
        </section>
      </div>
    </PageWrapper>
  )
}
