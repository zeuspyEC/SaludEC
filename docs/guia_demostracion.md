# Guía Personal de Demostración — SaludEC

> **Para quién:** Erick, Jonathan y Javier para la presentación oral (10–15 min).  
> **URL del sitio:** https://vitaprevent-b2e34.web.app  
> **Repo:** https://github.com/zeuspyEC/SaludEC

---

## ESTRUCTURA DE LA PRESENTACIÓN (10–15 min)

| # | Tema | Tiempo |
|---|------|--------|
| 1 | Objetivo del sitio y público objetivo | 1 min |
| 2 | Demo rápida del sitio (navegación visual) | 2 min |
| 3 | Decisiones de diseño accesible (POUR) | 2 min |
| 4 | Tecnologías y ATAG | 1 min |
| 5 | Demostración con teclado | 2 min |
| 6 | Demostración con NVDA (lector de pantalla) | 2 min |
| 7 | Resultados de evaluación (axe + Lighthouse) | 2 min |
| 8 | Declaración de conformidad y conclusiones | 1 min |

---

## SECCIÓN 1: Qué es SaludEC y para quién es

**Pitch de 1 minuto:**

> "SaludEC es un portal de servicios públicos de salud del Ecuador. Elegimos este tema porque los portales de salud pública suelen tener barreras de accesibilidad para personas con discapacidad, adultos mayores y personas con bajo dominio tecnológico. Nuestro objetivo fue demostrar que es posible construir un portal de salud completamente accesible sin sacrificar el diseño visual."

**Público objetivo:** Ciudadanos ecuatorianos, incluyendo:
- Personas con discapacidad visual (usan lectores de pantalla como NVDA)
- Adultos mayores con dificultades motrices (usan solo teclado)
- Personas con daltonismo (no dependen del color)
- Personas con bajo ancho de banda (móvil, zonas rurales)

---

## SECCIÓN 2: Demo visual del sitio (2 min)

### Ruta de demo visual (en navegador, sin teclado):

1. **Inicio** (`/`) — mostrar:
   - El cubo 3D: decir "es interactivo, arrastra para girarlo"
   - La sección "Ecuador en cifras de salud": datos reales de MSP, IESS, ECU 911
   - Los 4 módulos del sitio en la barra de navegación

2. **Atención Primaria** (`/atencion-primaria`) — mostrar:
   - Los filtros por categoría
   - Las tarjetas de artículos: cada una tiene imagen única y relevante al tema
   - Click en cualquier artículo → contenido HTML renderizado correctamente (párrafos, negritas, encabezados)
   - La calculadora de IMC (formulario funcional con validación)
   - El Accordion de FAQs

3. **Vacunación** (`/vacunacion`) — mostrar:
   - Tarjetas con imágenes distintas entre artículos PAI infantil / adultos / calendario
   - FAQs del esquema nacional PAI Ecuador

4. **Salud Mental** (`/salud-mental`) — mostrar:
   - Artículos con imágenes temáticamente correctas (terapia ≠ ansiedad ≠ sueño)
   - Línea de crisis 182

5. **Emergencias** (`/emergencias`) — mostrar:
   - Sistema ECU 911, SAMU, hospitales
   - FAQs sobre qué hacer en una emergencia

6. **Noticias** (`/noticias`) — mostrar:
   - Feed paginado; click en una noticia → contenido HTML renderizado sin etiquetas visibles

7. **Accesibilidad** (`/accesibilidad`) — mostrar la declaración de conformidad WCAG 2.2 AA

8. **Contacto** (`/contacto`) — mostrar el formulario accesible

### Frases clave para la demo:
- "Todas las páginas siguen la misma estructura: SkipLink → Navbar → contenido → footer"
- "Cada artículo tiene una imagen única y descriptiva — no hay duplicados visuales en la misma sección"
- "El contenido enriquecido del editor admin se renderiza como HTML semántico, no como texto plano"
- "La calculadora IMC es un ejemplo de formulario con validación accesible"
- "Los datos son de fuentes oficiales: MSP, IESS, ECU 911"

---

## SECCIÓN 3: Decisiones de diseño accesible — POUR

### Mostrar con el sitio abierto:

**P — Perceptible:**
- Hover sobre una imagen de artículo: "cada imagen tiene texto alternativo descriptivo del tema"
- Click en Inspector de Chrome: mostrar `alt` en el código — la descripción coincide con el contenido del artículo
- "No hay dos artículos en la misma sección con la misma imagen" — WCAG 1.1.1
- Click en el cuerpo de un artículo: "el contenido del editor admin se renderiza como HTML semántico, no como texto plano"
- Mostrar la paleta: "contraste mínimo 4.5:1, el nuestro es 17.9:1 en el hero"

**O — Operable:**
- Demostración Tab (ver sección 5 abajo)
- Menú hamburger en mobile: "cierra con Escape, devuelve foco al botón"

**U — Comprensible:**
- Código fuente `index.html`: mostrar `<html lang="es">`
- Formulario de contacto: errores descriptivos con `aria-describedby`
- Navbar activa: `aria-current="page"` en la página actual

**R — Robusto:**
- DevTools → Inspector: mostrar `<header>`, `<main>`, `<nav>`, `<footer>`
- Accordion FAQs: mostrar `aria-expanded` cambiando al hacer click

---

## SECCIÓN 4: Tecnologías y ATAG

**Stack rápido:**
- React 19 + Vite 6 (frontend)
- Firebase Firestore (base de datos), Auth (admin), Hosting (CDN global)
- CSS personalizado con variables (tokens) — sin Bootstrap

**ATAG — Herramientas de autoría:**
- VS Code con `axe Accessibility Linter`: detecta errores ARIA en tiempo real
- `eslint-plugin-jsx-a11y`: los errores de accesibilidad **bloquean el build** — si olvidamos un `alt`, el proyecto no compila
- React genera HTML cerrado automáticamente

---

## SECCIÓN 5: Demo con teclado (2 min)

### Pasos exactos para demostrar:

1. **Ir a** `vitaprevent-b2e34.web.app`
2. Hacer click UNA VEZ en la página (para activar el DOM)
3. Presionar **Tab** → aparece el SkipLink "Saltar al contenido principal"
4. Presionar **Tab** de nuevo → foco en el logo
5. Seguir **Tab** → foco en los ítems del Navbar: Inicio, Atención Primaria, Vacunación...
6. Decir: **"Corrección WCAG 2.4.3 que tuvimos que hacer"** → antes el foco iba directo al botón "Explorar Contenido", saltando el Navbar. Corrección: `isFirstRender` en PageWrapper.

7. Ir a `/atencion-primaria`
8. Tab hasta los filtros: presionar **Space** en un filtro → los artículos cambian
9. Tab hasta el Accordion: presionar **Enter** → se expande la pregunta
10. Tab hasta el formulario IMC: llenar con teclado → Enter para calcular

**Frase clave:** "Todo lo que el ratón puede hacer, el teclado también puede hacerlo."

---

## SECCIÓN 6: Demo con NVDA (lector de pantalla)

### Configuración previa:
- Tener NVDA instalado en Windows
- NVDA + Chrome = mejor combinación
- Bajar velocidad de voz de NVDA si es necesario (Ctrl+Alt+Shift+S)

### Secuencia de demo:

1. Abrir NVDA (Ctrl+Alt+N)
2. Ir a `vitaprevent-b2e34.web.app`
3. **NVDA + F6** → lista de landmarks: escucha "Navegación principal", "main: Contenido principal"
4. Presionar **Tab**: NVDA anuncia "Saltar al contenido principal, enlace"
5. Tab de nuevo: "SaludEC, enlace" (logo)
6. Tab: "Inicio, enlace, página actual" (aria-current)
7. Tab: "Atención Primaria, enlace"
8. Ir a `/atencion-primaria`
9. NVDA + H → navegar por encabezados: "Atención Primaria de Salud, nivel 1", etc.
10. Ir al Accordion: NVDA anuncia "¿Cómo saco un turno...?, botón, contraído"
11. Enter → NVDA anuncia "expandido"
12. Ir al formulario IMC: NVDA anuncia "Peso, campo de edición, requerido"
13. Ingresar valor inválido → NVDA anuncia el error inmediatamente (aria-live)

**Frase clave:** "El lector de pantalla anuncia correctamente el estado de cada elemento interactivo."

---

## SECCIÓN 7: Resultados de evaluación

### Herramientas automáticas:

**axe DevTools** (extensión Chrome):
1. Abrir DevTools → axe DevTools
2. Click "Scan ALL of my page"
3. Mostrar resultado: **0 violaciones críticas, 0 graves**

**Lighthouse:**
1. DevTools → Lighthouse → Run audit (Desktop)
2. Mostrar puntuación: **Accessibility ~97**
3. Mencionar la advertencia: cubo 3D drag (WCAG 2.5.7 parcial)

**WAVE** (si está disponible):
- Mostrar los "0 errors" en la barra de resultados

### Evaluación manual — qué mencionar:
- Probado en Chrome, Firefox, Edge, Chrome Mobile
- Con NVDA (Windows) y teclado
- Zoom 200%: sin scroll horizontal

---

## SECCIÓN 8: Declaración de conformidad y conclusiones

### Declaración (leer):

> "Después de evaluación automática con axe DevTools y Lighthouse, revisión manual de criterios WCAG 2.2 y prueba con NVDA y teclado, declaramos que SaludEC **cumple sustancialmente con WCAG 2.2 Nivel AA**. Identificamos dos criterios con cumplimiento parcial:
> 1. **2.5.7 Movimientos de arrastre:** el cubo 3D usa arrastre, pero el contenido es accesible por Navbar. Alternativa documentada.
> 2. **3.2.6 Ayuda consistente:** el contacto está en el footer; enlace contextual pendiente en módulos internos.
>
> Mejoras implementadas durante el desarrollo:
> - **WCAG 1.1.1 (Contenido no textual):** cada artículo tiene imagen única por sección y texto alternativo descriptivo del tema concreto del artículo.
> - **WCAG 1.3.1 (Información y relaciones):** el contenido enriquecido del panel de administración se renderiza como HTML semántico (`<p>`, `<strong>`, `<h2>`…), garantizando que lectores de pantalla interpreten correctamente la jerarquía de contenido.
>
> No se presentan barreras de acceso para usuarios con discapacidad."

### Conclusiones principales:
1. "Accesibilidad desde el inicio es más fácil que al final"
2. "HTML semántico resuelve el 80% de WCAG sin necesidad de ARIA"
3. "Los tokens CSS garantizan contraste en todos los componentes sin revisión individual"
4. "Las herramientas automáticas detectan ~40% de problemas; el 60% requiere revisión manual"

---

## PREGUNTAS FRECUENTES DE EVALUADORES

**¿Por qué React y no HTML estático?**
> React nos permite crear componentes accesibles reutilizables. `FormField`, `Accordion` y `Modal` son accesibles por diseño y se usan en múltiples páginas sin riesgo de regresión.

**¿Cómo verificaron el contraste?**
> Con Colour Contrast Analyser (herramienta de escritorio) y DevTools de Chrome. El ratio mínimo en el sitio es 4.6:1 (textos pequeños) y el máximo es 17.9:1 (texto blanco sobre navy).

**¿Qué pasó con WCAG 2.5.7?**
> El cubo 3D rota automáticamente sin intervención del usuario, y los 4 módulos siempre están accesibles en el Navbar. El criterio requiere una alternativa al arrastre — esa alternativa existe. Lo que falta es documentarla explícitamente con `aria-label`.

**¿Por qué usaron Firebase?**
> Firebase Hosting ofrece CDN global y HTTPS automático, que son requisitos implícitos de accesibilidad (UAAG). El plan gratuito (Spark) es suficiente para el proyecto académico.

**¿Probaron con VoiceOver?**
> Sí, en macOS Safari. El comportamiento es idéntico al de NVDA en Chrome para los landmarks y el Accordion. Las diferencias menores son de pronunciación de ARIA, no de funcionalidad.

---

## ATAJOS ÚTILES DURANTE LA DEMO

| Acción | Atajo |
|--------|-------|
| Activar NVDA | Ctrl+Alt+N |
| Lista de landmarks (NVDA) | NVDA + F6 |
| Lista de encabezados (NVDA) | NVDA + F7 |
| Navegar por encabezados | H / Shift+H |
| Silenciar NVDA | Ctrl |
| Zoom 200% Chrome | Ctrl+= (dos veces) |
| Zoom reset | Ctrl+0 |
| DevTools | F12 |
| axe DevTools | F12 → axe tab |

---

## ARCHIVOS DEL PROYECTO PARA MOSTRAR

| Archivo | Qué muestra |
|---------|-------------|
| `src/components/layout/SkipLink/SkipLink.jsx` | WCAG 2.4.1 |
| `src/components/layout/PageWrapper/PageWrapper.jsx` | WCAG 2.4.3 fix |
| `src/components/layout/Navbar/Navbar.jsx` | aria-current, aria-expanded |
| `src/components/common/FormField/FormField.jsx` | WCAG 3.3.1, 3.3.2 |
| `src/components/common/Accordion/Accordion.jsx` | WAI-ARIA Accordion |
| `src/styles/tokens.css` | Sistema de diseño, colores |
| `src/styles/global.css` | :focus-visible, prefers-reduced-motion |
| `index.html` | lang="es" |
| `docs/informe_vitaprevent.pdf` | Informe completo |
| `docs/principios_wcag_evidencias.pdf` | Análisis POUR |
| `docs/arquitectura_vitaprevent.pdf` | Arquitectura + brechas |
