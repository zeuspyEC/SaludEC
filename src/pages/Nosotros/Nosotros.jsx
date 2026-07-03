import PageWrapper from '@components/layout/PageWrapper/PageWrapper'
import Breadcrumb from '@components/layout/Breadcrumb/Breadcrumb'
import SectionHero from '@components/common/SectionHero/SectionHero'
import './Nosotros.css'

const EQUIPO = [
  {
    nombre: 'Erick Costa',
    rol: 'Coordinador del proyecto · Evaluador de accesibilidad',
    descripcion: 'Coordina el avance del proyecto, gestiona la arquitectura Firebase y lidera la evaluación de conformidad WCAG 2.2 AA con herramientas automáticas y pruebas manuales.',
    iniciales: 'EC',
    color: 'blue',
    especialidades: ['Coordinación', 'WCAG 2.2 AA', 'React 19', 'Firebase'],
  },
  {
    nombre: 'Jonathan Tipán',
    rol: 'Diseñador de interfaz · Desarrollador frontend',
    descripcion: 'Define la estructura visual, jerarquía de navegación y experiencia de usuario. Implementa el sistema de diseño Ocean Breeze, los componentes interactivos y el CSS accesible.',
    iniciales: 'JT',
    color: 'teal',
    especialidades: ['Diseño UX/UI', 'CSS Accesible', 'Design Tokens', 'WAI-ARIA'],
  },
  {
    nombre: 'Javier Quilumba',
    rol: 'Desarrollador frontend · Redactor del informe',
    descripcion: 'Implementa los servicios de Firestore, el panel de administración y los módulos de contenido. Documenta la metodología, resultados y evidencias en el informe técnico.',
    iniciales: 'JQ',
    color: 'purple',
    especialidades: ['Firestore', 'Panel admin', 'Informe técnico', 'ATAG'],
  },
]

const VALORES = [
  { icon: '🏛️', title: 'Información oficial del Estado', desc: 'Todo el contenido proviene de organismos públicos: MSP, IESS, ECU 911, OPS Ecuador y MINEDUC. Nada inventado, todo verificable y con fuente citada.' },
  { icon: '♿', title: 'Accesibilidad universal', desc: 'Conformidad demostrada con WCAG 2.2 Nivel AA: navegación por teclado, lectores de pantalla, contraste, diseño responsive y control de animaciones. Ningún ciudadano queda fuera.' },
  { icon: '🔒', title: 'Privacidad y servicio público', desc: 'Sin publicidad, sin rastreo, sin venta de datos. El sitio no usa cookies de seguimiento. La salud es un derecho, no un producto comercial.' },
  { icon: '📱', title: 'Acceso sin barreras', desc: 'Funciona en cualquier dispositivo desde 320px. Carga rápida incluso con conexiones lentas, priorizando la conectividad de zonas rurales del Ecuador.' },
]

export default function Nosotros() {
  return (
    <PageWrapper title="Nosotros" description="Equipo SaludEC — portal de servicios públicos de salud del Ecuador desarrollado en la EPN. Misión, roles y valores del proyecto.">
      <SectionHero
        tag="El equipo"
        title="Quiénes somos"
        description="Somos estudiantes de la Escuela Politécnica Nacional que desarrollamos este portal para acercar a la ciudadanía ecuatoriana a los servicios públicos de salud del MSP, IESS y ECU 911."
        icon="👥"
        gradient="blue"
      />

      <div className="nosotros-page container">
        <Breadcrumb />

        {/* Misión y visión */}
        <section className="mision-section" aria-labelledby="mision-title">
          <div className="mision-card mision-card--primary">
            <span className="mision-card__badge">Misión</span>
            <h2 id="mision-title" className="mision-card__title">Nuestra misión</h2>
            <p>Centralizar y comunicar de forma accesible la información oficial sobre los servicios públicos de salud del Ecuador — MSP, IESS y ECU 911 — para que cualquier ciudadano, independientemente de su capacidad o dispositivo, pueda conocer y ejercer su derecho a la salud.</p>
          </div>
          <div className="mision-card">
            <span className="mision-card__badge">Visión</span>
            <h2 className="mision-card__title">Nuestra visión</h2>
            <p>Ser el portal de referencia en servicios públicos de salud del Ecuador, reconocido por la fiabilidad de sus fuentes oficiales, su plena conformidad con WCAG 2.2 Nivel AA y su compromiso con la equidad digital.</p>
          </div>
        </section>

        {/* Equipo */}
        <section aria-labelledby="equipo-title" className="equipo-section">
          <h2 id="equipo-title" className="nosotros-section-title">El equipo de desarrollo</h2>
          <p className="equipo-intro">SaludEC es un proyecto académico desarrollado en la <strong>Escuela Politécnica Nacional (EPN)</strong> de Quito, Ecuador, para la asignatura <em>Usabilidad y Accesibilidad</em>. Cada integrante desempeña roles definidos según la metodología del proyecto.</p>

          <ul className="equipo-grid" role="list">
            {EQUIPO.map((m) => (
              <li key={m.nombre} className="team-card">
                <div className={`team-card__avatar team-card__avatar--${m.color}`} aria-hidden="true">
                  {m.iniciales}
                </div>
                <div className="team-card__body">
                  <h3 className="team-card__name">{m.nombre}</h3>
                  <span className="team-card__rol">{m.rol}</span>
                  <p className="team-card__desc">{m.descripcion}</p>
                  <ul className="team-card__tags" role="list" aria-label={`Especialidades de ${m.nombre}`}>
                    {m.especialidades.map((e) => (
                      <li key={e} className="team-tag">{e}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Valores */}
        <section aria-labelledby="valores-title" className="valores-section">
          <h2 id="valores-title" className="nosotros-section-title">Nuestros valores</h2>
          <ul className="valores-grid" role="list">
            {VALORES.map((v) => (
              <li key={v.title} className="valor-card">
                <span className="valor-card__icon" aria-hidden="true">{v.icon}</span>
                <h3 className="valor-card__title">{v.title}</h3>
                <p className="valor-card__desc">{v.desc}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Tecnología */}
        <section aria-labelledby="tech-title" className="tech-section">
          <h2 id="tech-title" className="nosotros-section-title">Tecnología utilizada</h2>
          <div className="tech-grid">
            {[
              { name: 'React 19', desc: 'Interfaz de usuario moderna' },
              { name: 'Vite 6', desc: 'Bundler de alto rendimiento' },
              { name: 'Firebase', desc: 'Base de datos y autenticación' },
              { name: 'WCAG 2.2 AA', desc: 'Accesibilidad garantizada' },
              { name: 'GitHub Actions', desc: 'Integración y despliegue continuo' },
              { name: 'CSS Custom Properties', desc: 'Sistema de diseño escalable' },
            ].map((t) => (
              <div key={t.name} className="tech-chip">
                <strong>{t.name}</strong>
                <span>{t.desc}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </PageWrapper>
  )
}
