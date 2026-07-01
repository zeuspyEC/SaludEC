import {
  collection, query, where, getDocs,
  updateDoc, deleteDoc, doc, serverTimestamp,
} from 'firebase/firestore'
import { db } from '@config/firebase'

// ─────────────────────────────────────────────────────────────────────────────
// Utilidades
// ─────────────────────────────────────────────────────────────────────────────
function slugify(str) {
  return str
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)
}

// ─────────────────────────────────────────────────────────────────────────────
// Imágenes por tema — Unsplash photos verificadas
// ─────────────────────────────────────────────────────────────────────────────
const BASE = 'https://images.unsplash.com/'
const W = '?w=700&auto=format&fit=crop'

// IDs de Unsplash verificados manualmente para cada tema de salud
const IMG = {
  // Nutrición
  mediterranea:   ['photo-1498837167922-ddd27525d352', 'Ensalada mediterránea con aceitunas y aceite de oliva'],
  plato_saludable:['photo-1512621776951-a57141f2eefd', 'Plato saludable con vegetales coloridos y proteínas'],
  antiinflamatorio:['photo-1490645935967-10de6ba17061', 'Alimentos antiinflamatorios: frutos rojos y verduras'],
  azucar:         ['photo-1558961363-fa8fdf82db35', 'Cucharas con diferentes tipos de azúcar'],
  fibra:          ['photo-1571748982800-fa51082c2224', 'Alimentos integrales ricos en fibra dietética'],
  macronutrientes:['photo-1490818387583-1baba5e638af', 'Alimentos con macronutrientes: proteínas y carbohidratos'],
  superalimentos: ['photo-1490818387583-1baba5e638af', 'Superalimentos: semillas, bayas y vegetales'],
  embarazo:       ['photo-1555252333-9f8e92e65df9', 'Mujer embarazada con frutas y alimentación saludable'],
  hidratacion:    ['photo-1548839140-29a749e1cf4d', 'Vaso de agua cristalina con fruta fresca'],
  alimentacion:   ['photo-1512621776951-a57141f2eefd', 'Alimentación balanceada con vegetales y proteínas'],
  // Atención primaria
  consulta_msp:   ['photo-1576091160399-112ba8d25d1d', 'Médico atendiendo a paciente en centro de salud del MSP'],
  hospital:       ['photo-1586773860418-d37222d8fce3', 'Pasillo de hospital público con equipamiento médico'],
  iess:           ['photo-1519494026892-80bbd2d6fd0d', 'Edificio institucional de salud pública'],
  // Ejercicio
  hiit:           ['photo-1571019614242-c5c5dee9f50b', 'Persona realizando entrenamiento de alta intensidad HIIT'],
  yoga:           ['photo-1544367567-0f2fcb009e0b', 'Persona practicando yoga en postura de equilibrio al atardecer'],
  caminar:        ['photo-1571008887538-b36bb32f4571', 'Persona caminando con zapatillas deportivas al aire libre'],
  correr:         ['photo-1552674605-db6ffd4facb5', 'Persona corriendo en parque urbano con buena postura'],
  fuerza_mayor:   ['photo-1574680096145-d05b474e2155', 'Adulto mayor haciendo ejercicio de fuerza con pesas'],
  fuerza:         ['photo-1581009146145-b5ef050c2e1e', 'Persona en gimnasio realizando press de banca'],
  sedentarismo:   ['photo-1498049794561-7780e7231661', 'Persona sentada frente al computador en postura sedentaria'],
  fitt:           ['photo-1581009146145-b5ef050c2e1e', 'Persona en gimnasio siguiendo el principio FITT para estructurar su entrenamiento'],
  ejercicio_diab: ['photo-1571019613454-1cb2f99b2d8b', 'Persona controlando glucosa antes de hacer ejercicio'],
  principiante:   ['photo-1534438327276-14e5300c3a48', 'Persona ejercitándose en casa con ropa deportiva'],
  // Salud mental
  terapia:        ['photo-1573497019236-17f8177b81e8', 'Sesión de psicoterapia entre profesional y paciente'],
  mindfulness:    ['photo-1506126613408-eca07ce68773', 'Persona meditando en posición de loto con paz interior'],
  sueno:          ['photo-1541781774459-bb2af2f05b55', 'Dormitorio tranquilo con luz tenue — higiene del sueño'],
  ansiedad:       ['photo-1541199249251-f713e6145474', 'Persona experimentando síntomas de ansiedad'],
  burnout:        ['photo-1488190211105-8b0e65b80b4e', 'Persona agotada con signos de síndrome de burnout laboral'],
  duelo:          ['photo-1493836512294-502baa1986e2', 'Persona en reflexión profunda tras una pérdida'],
  respiracion:    ['photo-1506905925346-21bda4d32df4', 'Persona en montaña practicando respiración consciente'],
  autoestima:     ['photo-1522075469751-3a6694fb2f61', 'Persona sonriendo con seguridad y autoestima positiva'],
  salud_mental:   ['photo-1493836512294-502baa1986e2', 'Bienestar mental — persona en estado de calma'],
  // Prevención / Emergencias
  hipertension:   ['photo-1559757148-5c350d0d3c56', 'Médico midiendo presión arterial con tensiómetro'],
  diabetes_prev:  ['photo-1579154204601-01588f351e67', 'Glucómetro y control de azúcar en sangre'],
  vacunacion:     ['photo-1584516150909-c43483ee7932', 'Enfermera aplicando vacuna a paciente en centro de salud público'],
  vacunacion_covid:['photo-1605289982774-9a6fef564df8', 'Frascos de vacunas del programa nacional de inmunización'],
  examen_prev:    ['photo-1576091160550-2173dba999ef', 'Médico con estetoscopio en consulta de chequeo preventivo'],
  tabaquismo:     ['photo-1559757175-0eb30cd8c063', 'Cigarro apagado — campaña de prevención del tabaquismo'],
  cancer_piel:    ['photo-1594882645126-14ac19a234b5', 'Aplicación de protector solar en la piel'],
  rcp:            ['photo-1559757175-5700dde675bc', 'Maniobra de reanimación cardiopulmonar básica — primeros auxilios'],
  ecu911:         ['photo-1587745416684-47953f16f02f', 'Central de operaciones del sistema ECU 911'],
}

function img(key) {
  const [id, alt] = IMG[key]
  return { url: `${BASE}${id}${W}`, alt }
}

function getImgArticulo(titulo = '', modulo = '') {
  const t = titulo.toLowerCase()

  // ── Atención primaria / MSP / IESS ───────────────────────
  if (t.includes('msp') || t.includes('ministerio') || t.includes('consulta') || t.includes('cita médica'))
    return img('consulta_msp')
  if (t.includes('iess') || t.includes('seguro social') || t.includes('afiliado'))
    return img('iess')
  if (t.includes('nivel') && (t.includes('atenci') || t.includes('salud')))
    return img('hospital')

  // ── Nutrición / alimentación ──────────────────────────────
  if (t.includes('mediterr'))
    return img('mediterranea')
  if (t.includes('plato') && t.includes('harvard'))
    return img('plato_saludable')
  if (t.includes('antiinflam'))
    return img('antiinflamatorio')
  if (t.includes('azúcar') || t.includes('azucar'))
    return img('azucar')
  if (t.includes('fibra') || t.includes('integral'))
    return img('fibra')
  if (t.includes('macronut') || t.includes('proteín') || t.includes('carboh'))
    return img('macronutrientes')
  if (t.includes('superaliment'))
    return img('superalimentos')
  if (t.includes('embarazo') || t.includes('gestaci'))
    return img('embarazo')
  if (t.includes('hidrat') || t.includes('agua'))
    return img('hidratacion')

  // ── Actividad física / ejercicio ──────────────────────────
  if (t.includes('hiit') || t.includes('intervalos de alta'))
    return img('hiit')
  if (t.includes('yoga'))
    return img('yoga')
  if (t.includes('caminar') || t.includes('pasos'))
    return img('caminar')
  if (t.includes('correr') || t.includes('running') || t.includes('couch to 5'))
    return img('correr')
  if (t.includes('fuerza') && (t.includes('adulto mayor') || t.includes('mayor') || t.includes('60')))
    return img('fuerza_mayor')
  if (t.includes('fuerza') || t.includes('pesas') || t.includes('muscula'))
    return img('fuerza')
  if (t.includes('sedentarismo') || t.includes('silla') || t.includes('escritorio'))
    return img('sedentarismo')
  if (t.includes('fitt') || t.includes('frecuencia') || t.includes('intensidad') || t.includes('tipo de ejercicio'))
    return img('fitt')
  if (t.includes('diabetes') && (t.includes('ejercicio') || t.includes('actividad')))
    return img('ejercicio_diab')
  if (t.includes('principiante') || t.includes('empezar') || t.includes('nunca') || t.includes('sin equipo'))
    return img('principiante')

  // ── Salud mental ──────────────────────────────────────────
  if (t.includes('terapia') || t.includes('cognitivo') || t.includes('psicolog'))
    return img('terapia')
  if (t.includes('mindfulness') || t.includes('meditaci'))
    return img('mindfulness')
  if (t.includes('sueño') || t.includes('sueno') || t.includes('dormir') || t.includes('higiene del sue'))
    return img('sueno')
  if (t.includes('ansiedad') || t.includes('pánico') || t.includes('panico'))
    return img('ansiedad')
  if (t.includes('burnout') || t.includes('agotamient') || t.includes('sindrome'))
    return img('burnout')
  if (t.includes('duelo') || t.includes('pérdida') || t.includes('perdida'))
    return img('duelo')
  if (t.includes('respiraci'))
    return img('respiracion')
  if (t.includes('autoestima'))
    return img('autoestima')
  if (t.includes('línea 182') || t.includes('linea 182') || t.includes('crisis'))
    return img('salud_mental')
  if (t.includes('trastorno'))
    return img('salud_mental')

  // ── Prevención ────────────────────────────────────────────
  if (t.includes('hipertens') || t.includes('presión arterial') || t.includes('presion arterial'))
    return img('hipertension')
  if (t.includes('diabetes') && (t.includes('prevenci') || t.includes('tipo 2')))
    return img('diabetes_prev')
  if (t.includes('vacuna') || t.includes('inmuniz') || t.includes('pai') || t.includes('esquema')) {
    // Vacunación infantil/PAI → imagen de enfermera vacunando niño
    if (t.includes('infantil') || t.includes('niño') || t.includes('nino') || t.includes('pai') || t.includes('esquema'))
      return img('vacunacion')
    // Vacunación adultos/general → imagen más genérica de vacunas (COVID vials)
    return img('vacunacion_covid')
  }
  if (t.includes('examen') || t.includes('chequeo') || t.includes('preventivo'))
    return img('examen_prev')
  if (t.includes('fumar') || t.includes('tabaqui') || t.includes('cigarr'))
    return img('tabaquismo')
  if (t.includes('cáncer') || t.includes('cancer') || t.includes('sol ecuator'))
    return img('cancer_piel')
  if (t.includes('rcp') || t.includes('paro cardior') || t.includes('reanimaci'))
    return img('rcp')
  if (t.includes('ecu 911') || t.includes('emergencia') || t.includes('samu'))
    return img('ecu911')

  // ── Fallback por módulo ───────────────────────────────────
  const fallbacks = {
    'nutricion':       img('alimentacion'),
    'actividad-fisica':img('hiit'),
    'salud-mental':    img('salud_mental'),
    'prevencion':      img('examen_prev'),
  }
  return fallbacks[modulo] || img('consulta_msp')
}

function getImgNoticia(titulo = '') {
  const t = titulo.toLowerCase()
  if (t.includes('sueño') || t.includes('dormir') || t.includes('luz azul'))
    return { url: `${BASE}photo-1541781774459-bb2af2f05b55${W}`, alt: 'Persona durmiendo en habitación oscura y tranquila' }
  if (t.includes('sedentarismo') || t.includes('muévete') || t.includes('movete') || t.includes('actividad física'))
    return { url: `${BASE}photo-1476480862126-209bfaa8edc8${W}`, alt: 'Personas realizando actividad física al aire libre' }
  if (t.includes('mindfulness') || t.includes('meditaci') || t.includes('mental'))
    return { url: `${BASE}photo-1506126613408-eca07ce68773${W}`, alt: 'Persona meditando con calma' }
  if (t.includes('oms') || t.includes('ops') || t.includes('global') || t.includes('plan'))
    return { url: `${BASE}photo-1576091160399-112ba8d25d1d${W}`, alt: 'Centro de salud con profesionales médicos' }
  if (t.includes('aplicaci') || t.includes('tecnolog') || t.includes('digital'))
    return { url: `${BASE}photo-1512941937669-90a1b58e7e9c${W}`, alt: 'Aplicación de salud en teléfono inteligente' }
  if (t.includes('ecuador') && (t.includes('aliment') || t.includes('etiquet')))
    return { url: `${BASE}photo-1512621776951-a57141f2eefd${W}`, alt: 'Etiquetado nutricional en productos alimenticios de Ecuador' }
  if (t.includes('beneficio') || t.includes('investig') || t.includes('estudio'))
    return { url: `${BASE}photo-1532187863486-abf9dbad1b69${W}`, alt: 'Investigadores en laboratorio analizando datos de salud' }
  if (t.includes('doble') || t.includes('americ') || t.includes('latino'))
    return { url: `${BASE}photo-1576091160399-112ba8d25d1d${W}`, alt: 'Sistema de salud pública en América Latina' }
  // generic news fallback
  return { url: `${BASE}photo-1576091160399-112ba8d25d1d${W}`, alt: 'Noticias de salud pública en Ecuador' }
}

function getThumbRecurso(titulo = '', tipo = '') {
  const t = titulo.toLowerCase()
  if (t.includes('chequeo') || t.includes('preventivo') || t.includes('por edad'))
    return { url: `${BASE}photo-1576091160550-2173dba999ef?w=400&auto=format&fit=crop`, alt: 'Chequeos preventivos de salud por edad' }
  if (t.includes('ansiedad') || t.includes('bai') || t.includes('test'))
    return { url: `${BASE}photo-1541199249251-f713e6145474?w=400&auto=format&fit=crop`, alt: 'Test de evaluación de ansiedad' }
  if (t.includes('mbsr') || t.includes('mindfulness') || t.includes('meditaci') || t.includes('estrés'))
    return { url: `${BASE}photo-1506126613408-eca07ce68773?w=400&auto=format&fit=crop`, alt: 'Programa de mindfulness y reducción del estrés' }
  if (t.includes('vacuna') || t.includes('calendario') || t.includes('pai') || t.includes('inmuniz'))
    return { url: `${BASE}photo-1605289982774-9a6fef564df8?w=400&auto=format&fit=crop`, alt: 'Calendario de vacunación y programa de inmunización' }
  if (t.includes('diario') || t.includes('emociones') || t.includes('plantilla'))
    return { url: `${BASE}photo-1495020689067-958852a7765e?w=400&auto=format&fit=crop`, alt: 'Diario de emociones con pluma y cuaderno' }
  if (t.includes('cerebro') || t.includes('ejercicio') && t.includes('cerebro'))
    return { url: `${BASE}photo-1571019614242-c5c5dee9f50b?w=400&auto=format&fit=crop`, alt: 'El ejercicio y sus beneficios para el cerebro' }
  if (t.includes('composici') || t.includes('alimento') || t.includes('tabla de') && t.includes('aliment'))
    return { url: `${BASE}photo-1512621776951-a57141f2eefd?w=400&auto=format&fit=crop`, alt: 'Tabla de composición nutricional de alimentos ecuatorianos' }
  if (t.includes('alimentaci') || t.includes('saludable') || t.includes('ops'))
    return { url: `${BASE}photo-1490645935967-10de6ba17061?w=400&auto=format&fit=crop`, alt: 'Guía de alimentación saludable de la OPS/OMS' }
  if (t.includes('correr') || t.includes('couch') || t.includes('semanas'))
    return { url: `${BASE}photo-1571008887538-b36bb32f4571?w=400&auto=format&fit=crop`, alt: 'Persona corriendo en programa de entrenamiento progresivo' }
  if (t.includes('rutina') || t.includes('sin equipo') || t.includes('20 minut'))
    return { url: `${BASE}photo-1534438327276-14e5300c3a48?w=400&auto=format&fit=crop`, alt: 'Rutina de ejercicio en casa sin equipamiento' }
  if (t.includes('primeros auxilios psicol'))
    return { url: `${BASE}photo-1573497019236-17f8177b81e8?w=400&auto=format&fit=crop`, alt: 'Primeros auxilios psicológicos — apoyo emocional' }
  if (t.includes('fumar') || t.includes('tabaco'))
    return { url: `${BASE}photo-1559757175-5700dde675bc?w=400&auto=format&fit=crop`, alt: 'Guía para dejar de fumar — OPS' }
  if (t.includes('cáncer') || t.includes('cancer'))
    return { url: `${BASE}photo-1576091160550-2173dba999ef?w=400&auto=format&fit=crop`, alt: 'Prevención del cáncer — diagnóstico y mitos' }
  if (t.includes('recetario') || t.includes('receta'))
    return { url: `${BASE}photo-1466637574441-749b8f19452f?w=400&auto=format&fit=crop`, alt: 'Recetario saludable con ingredientes naturales' }
  if (t.includes('señales') || t.includes('alerta') || t.includes('salud mental'))
    return { url: `${BASE}photo-1493836512294-502baa1986e2?w=400&auto=format&fit=crop`, alt: 'Señales de alerta en salud mental' }
  if (t.includes('etiqueta') || t.includes('nutricional') && t.includes('leer'))
    return { url: `${BASE}photo-1558618666-fcd25c85cd64?w=400&auto=format&fit=crop`, alt: 'Cómo leer etiquetas nutricionales de los alimentos' }
  if (t.includes('cardiovascul') || t.includes('cardíac') || t.includes('riesgo cardio'))
    return { url: `${BASE}photo-1559757148-5c350d0d3c56?w=400&auto=format&fit=crop`, alt: 'Factores de riesgo cardiovascular — evaluación médica' }
  if (t.includes('frecuencia cardíaca') || t.includes('frecuencia cardiaca'))
    return { url: `${BASE}photo-1517836357463-d25dfeac3438?w=400&auto=format&fit=crop`, alt: 'Tabla de frecuencia cardíaca para el ejercicio' }
  if (t.includes('líneas') || t.includes('lineas') || t.includes('crisis') || t.includes('apoyo'))
    return { url: `${BASE}photo-1544027993-37dbfe43562a?w=400&auto=format&fit=crop`, alt: 'Líneas de apoyo y crisis en salud mental' }
  if (t.includes('caloría') || t.includes('caloria') || t.includes('macro') || t.includes('calculadora'))
    return { url: `${BASE}photo-1490818387583-1baba5e638af?w=400&auto=format&fit=crop`, alt: 'Calculadora de calorías y macronutrientes' }
  if (t.includes('directriz') || t.includes('oms') || t.includes('actividad física'))
    return { url: `${BASE}photo-1571019614242-c5c5dee9f50b?w=400&auto=format&fit=crop`, alt: 'Directrices OMS de actividad física 2024' }
  if (t.includes('meditaci') || t.includes('guiada') || t.includes('15 minut'))
    return { url: `${BASE}photo-1506905925346-21bda4d32df4?w=400&auto=format&fit=crop`, alt: 'Meditación guiada para reducir la ansiedad' }
  // tipo fallback
  if (tipo === 'video') return { url: `${BASE}photo-1485846234645-a62644f84728?w=400&auto=format&fit=crop`, alt: 'Video educativo sobre salud' }
  if (tipo === 'podcast') return { url: `${BASE}photo-1478737270239-2f02b77fc618?w=400&auto=format&fit=crop`, alt: 'Podcast de salud y bienestar' }
  if (tipo === 'pdf') return { url: `${BASE}photo-1553729459-efe14ef6055d?w=400&auto=format&fit=crop`, alt: 'Documento PDF sobre salud' }
  if (tipo === 'infografia') return { url: `${BASE}photo-1576091160399-112ba8d25d1d?w=400&auto=format&fit=crop`, alt: 'Infografía de salud pública' }
  return { url: `${BASE}photo-1576091160550-2173dba999ef?w=400&auto=format&fit=crop`, alt: 'Recurso de salud pública' }
}

// IDs de Unsplash que muestran contenido incorrecto — se reemplazan siempre
const BAD_PHOTO_IDS = [
  'photo-1476480862126-209bfaa8edc8',  // pescador con salmón (caminar)
  'photo-1497032628192-86f99bcd76bc',  // pescador con salmón (sedentarismo antiguo)
  'photo-1517836357463-d25dfeac3438',  // pescador con salmón (FITT antiguo)
]
function esFotoMala(url = '') {
  return BAD_PHOTO_IDS.some((id) => url.includes(id))
}

// ─────────────────────────────────────────────────────────────────────────────
// FUNCIÓN PRINCIPAL DE LIMPIEZA
// ─────────────────────────────────────────────────────────────────────────────
export async function ejecutarCleanup(onProgress) {
  const log = (msg) => { console.log(msg); onProgress?.(msg) }
  let eliminados = 0
  let actualizados = 0
  let errores = 0

  // ── 1. ARTÍCULOS: deduplicar + agregar imágenes ──────────────────────────
  log('→ Cargando artículos...')
  const artSnap = await getDocs(
    query(collection(db, 'articulos'), where('publicado', '==', true))
  )
  // Ordenar en memoria por creadoEn para conservar siempre el primer documento
  const artDocs = artSnap.docs.slice().sort((a, b) => {
    const ta = a.data().creadoEn?.seconds ?? 0
    const tb = b.data().creadoEn?.seconds ?? 0
    return ta - tb
  })

  const seenSlugs = {}
  for (const d of artDocs) {
    const data = d.data()
    const slug = data.slug || ''
    // Siempre calcular la imagen correcta por título — garantiza idempotencia y evita IDs incorrectos
    const imgCorrecta = getImgArticulo(data.titulo, data.modulo)
    const imgActual = data.imagen?.url || ''
    // Actualizar si: no tiene imagen, tiene foto mala conocida, O la URL difiere de la correcta
    const necesitaActualizar = !imgActual || esFotoMala(imgActual) || imgActual !== imgCorrecta.url

    // Detectar duplicado por slug
    if (slug && seenSlugs[slug]) {
      try {
        await deleteDoc(doc(db, 'articulos', d.id))
        log(`🗑 Duplicado eliminado: "${(data.titulo || '').slice(0, 50)}" (${d.id.slice(0, 8)})`)
        eliminados++
      } catch (e) {
        log(`⚠ No se pudo eliminar ${d.id}: ${e.message}`)
        errores++
      }
      continue
    }
    if (slug) seenSlugs[slug] = d.id

    if (necesitaActualizar) {
      try {
        await updateDoc(doc(db, 'articulos', d.id), {
          imagen: { url: imgCorrecta.url, alt: imgCorrecta.alt },
          actualizadoEn: serverTimestamp(),
        })
        log(`🖼 Imagen sincronizada: "${(data.titulo || '').slice(0, 50)}"`)
        actualizados++
      } catch (e) {
        log(`⚠ Error actualizando ${d.id}: ${e.message}`)
        errores++
      }
    }
  }

  // ── 2. NOTICIAS: agregar imagen + slug ───────────────────────────────────
  log('\n→ Cargando noticias...')
  const notSnap = await getDocs(
    query(collection(db, 'noticias'), where('publicado', '==', true))
  )
  for (const d of notSnap.docs) {
    const data = d.data()
    const tieneImg = !!(data.imagen?.url)
    const tieneSlug = !!data.slug

    if (!tieneImg || !tieneSlug) {
      const img = getImgNoticia(data.titulo)
      const updates = { actualizadoEn: serverTimestamp() }
      if (!tieneImg) {
        updates.imagen = img
        log(`🖼 Imagen noticia: "${(data.titulo || '').slice(0, 50)}"`)
      }
      if (!tieneSlug) {
        updates.slug = slugify(data.titulo || d.id)
        log(`🔗 Slug noticia: "${updates.slug.slice(0, 50)}"`)
      }
      try {
        await updateDoc(doc(db, 'noticias', d.id), updates)
        actualizados++
      } catch (e) {
        log(`⚠ Error noticia ${d.id}: ${e.message}`)
        errores++
      }
    }
  }

  // ── 3. RECURSOS: agregar thumbnail ───────────────────────────────────────
  log('\n→ Cargando recursos...')
  const resSnap = await getDocs(collection(db, 'recursos'))
  for (const d of resSnap.docs) {
    const data = d.data()
    if (!data.thumbnail?.url) {
      const thumb = getThumbRecurso(data.titulo, data.tipo)
      try {
        await updateDoc(doc(db, 'recursos', d.id), {
          thumbnail: thumb,
          actualizadoEn: serverTimestamp(),
        })
        log(`🖼 Thumbnail recurso: "${(data.titulo || '').slice(0, 50)}"`)
        actualizados++
      } catch (e) {
        log(`⚠ Error recurso ${d.id}: ${e.message}`)
        errores++
      }
    }
  }

  log(`\n✔ Limpieza completada: ${eliminados} duplicados eliminados, ${actualizados} documentos actualizados, ${errores} errores.`)
  return { eliminados, actualizados, errores }
}
