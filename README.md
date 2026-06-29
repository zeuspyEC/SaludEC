# VitaPrevent

Plataforma web de salud preventiva desarrollada con React 19 + Firebase. Proporciona información confiable y accesible sobre nutrición, actividad física, salud mental y prevención de enfermedades, orientada a la población ecuatoriana.

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

- **Inicio** — Hero con cubo 3D interactivo, estadísticas y últimas noticias
- **Nutrición** — Artículos con contenido dinámico desde Firestore
- **Actividad Física** — Rutinas y guías de ejercicio
- **Salud Mental** — Bienestar emocional, mindfulness y gestión del estrés
- **Prevención** — Enfermedades crónicas, vacunación y chequeos preventivos
- **Biblioteca** — Recursos digitales (infografías, guías, PDFs)
- **Noticias** — Feed paginado con artículos de actualidad en salud
- **Contacto** — Formulario accesible con validación
- **Nosotros** — Equipo, misión y valores

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

El proyecto implementa WCAG 2.2 Nivel AA:

- Navegación completa por teclado con foco visible
- SkipLink al contenido principal
- HTML5 semántico + WAI-ARIA selectivo
- Contraste de color ≥ 4.5:1 en todo el texto
- Soporte para `prefers-reduced-motion` y `prefers-color-scheme`
- Lectores de pantalla compatibles (NVDA, VoiceOver)

---

## Equipo

| Nombre | Rol | GitHub |
|---|---|---|
| Erick Costa | Coordinador / Frontend | [@zeuspyEC](https://github.com/zeuspyEC) |
| Jonathan Tipán | Diseñador de interfaz | [@michaelTipan](https://github.com/michaelTipan) |
| Javier Quilumba | Accesibilidad / Documentación | — |

Escuela Politécnica Nacional — Ingeniería en Ciencias de la Computación — 2026
