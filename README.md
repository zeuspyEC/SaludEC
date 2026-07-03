# SaludEC

Portal de servicios públicos de salud del Ecuador desarrollado con React 19 + Firebase. Proporciona información oficial accesible sobre atención primaria, vacunación, salud mental y emergencias (MSP, IESS, ECU 911), orientada a la ciudadanía ecuatoriana.

**Sitio en producción:** https://vitaprevent-b2e34.web.app

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | React 19, Vite 6 |
| Backend / DB | Firebase Firestore |
| Autenticación | Firebase Auth |
| Hosting | Firebase Hosting + GitHub Actions CI/CD |
| Estilos | CSS personalizado con tokens de diseño (sin framework) |
| Accesibilidad | WCAG 2.2 Nivel AA |

---

## Módulos públicos

| Ruta | Sección | Contenido |
|---|---|---|
| `/` | Inicio | Hero con cubo 3D interactivo, estadísticas nacionales y últimas noticias |
| `/atencion-primaria` | Atención Primaria | Artículos de nutrición, alimentación y salud pública desde Firestore |
| `/vacunacion` | Vacunación | Calendario PAI, esquemas adultos, artículos de actividad física |
| `/salud-mental` | Salud Mental | Bienestar emocional, mindfulness, gestión del estrés |
| `/emergencias` | Emergencias | Prevención de enfermedades crónicas, chequeos preventivos, ECU 911 |
| `/biblioteca` | Biblioteca | Recursos digitales: infografías, guías, PDFs y videos |
| `/noticias` | Noticias | Feed paginado de actualidad en salud pública |
| `/contacto` | Contacto | Formulario accesible con validación en tiempo real |
| `/nosotros` | Nosotros | Equipo, misión y valores |
| `/accesibilidad` | Accesibilidad | Declaración de conformidad WCAG 2.2 AA |

> Las rutas anteriores (`/nutricion`, `/actividad-fisica`, `/prevencion`) redirigen automáticamente a las nuevas mediante `<Navigate replace>`.

---

## Desarrollo local

```bash
# 1. Clonar e instalar
git clone https://github.com/zeuspyEC/VitaPrevent.git
cd VitaPrevent
npm install

# 2. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con las credenciales de Firebase

# 3. Iniciar servidor de desarrollo
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

---

## Despliegue

El proyecto se despliega automáticamente a Firebase Hosting en cada push a `main` mediante GitHub Actions. También se puede desplegar manualmente:

```bash
npm run build
firebase deploy --only hosting --project vitaprevent-b2e34
```

---

## Accesibilidad

El proyecto cumple sustancialmente con WCAG 2.2 Nivel AA:

- Navegación completa por teclado con foco visible (`:focus-visible`)
- SkipLink al contenido principal (WCAG 2.4.1)
- HTML5 semántico + WAI-ARIA selectivo — `aria-expanded`, `aria-current`, `aria-live`
- Contraste de color ≥ 4.5:1 en todo el texto normal (ratio real: hasta 17.9:1)
- Soporte para `prefers-reduced-motion` y `prefers-color-scheme`
- Lectores de pantalla compatibles: NVDA + Chrome, VoiceOver + Safari
- Contenido WYSIWYG renderizado como HTML semántico (no como texto plano)
- Imágenes únicas por sección con texto alternativo descriptivo del tema del artículo (WCAG 1.1.1)
- Declaración de conformidad disponible en `/accesibilidad`

**Criterios con cumplimiento parcial documentado:**
- 2.5.7 Movimientos de arrastre: cubo 3D usa arrastre; alternativa de navegación existe vía Navbar
- 3.2.6 Ayuda consistente: contacto en footer; enlace contextual pendiente en módulos

---

## Equipo

| Nombre | Rol | GitHub |
|---|---|---|
| Erick Costa | Coordinador / Frontend | [@zeuspyEC](https://github.com/zeuspyEC) |
| Jonathan Tipán | Diseñador de interfaz | [@michaelTipan](https://github.com/michaelTipan) |
| Javier Quilumba | Accesibilidad / Documentación | — |

Escuela Politécnica Nacional — Ingeniería en Ciencias de la Computación — 2026
