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

function getImgArticulo(titulo = '', modulo = '') {
  const t = titulo.toLowerCase()

  // ── Nutrición / alimentación ──────────────────────────────
  if (t.includes('mediterr'))
    return { url: `${BASE}photo-1498837167922-ddd27525d352${W}`, alt: 'Ensalada mediterránea con vegetales frescos, aceitunas y aceite de oliva' }
  if (t.includes('plato') && t.includes('harvard'))
    return { url: `${BASE}photo-1512621776951-a57141f2eefd${W}`, alt: 'Plato saludable con vegetales coloridos, proteínas y granos' }
  if (t.includes('antiinflam'))
    return { url: `${BASE}photo-1490645935967-10de6ba17061${W}`, alt: 'Alimentos antiinflamatorios: frutos rojos, verduras y especias' }
  if (t.includes('azúcar') || t.includes('azucar'))
    return { url: `${BASE}photo-1558961363-fa8fdf82db35${W}`, alt: 'Diferentes tipos de azúcar y edulcorantes en recipientes' }
  if (t.includes('fibra') || t.includes('integral'))
    return { url: `${BASE}photo-1499028344343-cd173ffc68a9${W}`, alt: 'Alimentos ricos en fibra: legumbres, cereales integrales y verduras' }
  if (t.includes('macronut') || t.includes('proteín') || t.includes('carboh'))
    return { url: `${BASE}photo-1490818387583-1baba5e638af${W}`, alt: 'Alimentos ricos en macronutrientes: proteínas, carbohidratos y grasas' }
  if (t.includes('superaliment'))
    return { url: `${BASE}photo-1505576399279-565b52d4ac71${W}`, alt: 'Superalimentos: arándanos, quinua, aguacate y semillas' }
  if (t.includes('embarazo') || t.includes('gestaci'))
    return { url: `${BASE}photo-1493894473891-10fc1e5dbd22${W}`, alt: 'Mujer embarazada sosteniendo frutas y verduras frescas' }
  if (t.includes('hidrat') || t.includes('agua'))
    return { url: `${BASE}photo-1548839140-29a749e1cf4d${W}`, alt: 'Vaso de agua cristalina con fruta fresca' }
  if (t.includes('dieta') || t.includes('alimentaci') || t.includes('nutric'))
    return { url: `${BASE}photo-1512621776951-a57141f2eefd${W}`, alt: 'Alimentación balanceada con vegetales y proteínas' }

  // ── Actividad física / ejercicio ──────────────────────────
  if (t.includes('hiit') || t.includes('intervalos de alta'))
    return { url: `${BASE}photo-1571019614242-c5c5dee9f50b${W}`, alt: 'Persona realizando entrenamiento de alta intensidad HIIT' }
  if (t.includes('yoga'))
    return { url: `${BASE}photo-1544367567-0f2fcb009e0b${W}`, alt: 'Persona practicando yoga en postura de equilibrio' }
  if (t.includes('caminar') || t.includes('pasos'))
    return { url: `${BASE}photo-1476480862126-209bfaa8edc8${W}`, alt: 'Persona caminando al aire libre en un parque' }
  if (t.includes('correr') || t.includes('running') || t.includes('couch to 5'))
    return { url: `${BASE}photo-1571008887538-b36bb32f4571${W}`, alt: 'Persona corriendo en parque con zapatillas deportivas' }
  if (t.includes('fuerza') && (t.includes('adulto mayor') || t.includes('60') || t.includes('mayor')))
    return { url: `${BASE}photo-1571731956672-f2b94d7dd0cb${W}`, alt: 'Adulto mayor realizando ejercicio de fuerza con pesas ligeras' }
  if (t.includes('fuerza') || t.includes('entrenamiento') || t.includes('muscula'))
    return { url: `${BASE}photo-1581009146145-b5ef050c2e1e${W}`, alt: 'Persona en gimnasio realizando entrenamiento de fuerza' }
  if (t.includes('sedentarismo') || t.includes('silla') || t.includes('escritorio'))
    return { url: `${BASE}photo-1497032628192-86f99bcd76bc${W}`, alt: 'Persona frente a computadora con postura sedentaria' }
  if (t.includes('fitt'))
    return { url: `${BASE}photo-1517836357463-d25dfeac3438${W}`, alt: 'Persona planificando rutina de ejercicio en cuaderno' }
  if (t.includes('diabetes') && (t.includes('ejercicio') || t.includes('actividad')))
    return { url: `${BASE}photo-1571019613454-1cb2f99b2d8b${W}`, alt: 'Persona con diabetes realizando actividad física moderada' }
  if (t.includes('principiante') || t.includes('empezar') || t.includes('nunca'))
    return { url: `${BASE}photo-1534438327276-14e5300c3a48${W}`, alt: 'Persona principiante realizando ejercicio en casa' }

  // ── Salud mental ──────────────────────────────────────────
  if (t.includes('terapia') || t.includes('cognitivo-conduct') || t.includes('tcc'))
    return { url: `${BASE}photo-1573497019236-17f8177b81e8${W}`, alt: 'Sesión de terapia psicológica entre profesional y paciente' }
  if (t.includes('mindfulness') || t.includes('meditaci'))
    return { url: `${BASE}photo-1506126613408-eca07ce68773${W}`, alt: 'Persona meditando en posición de loto con calma' }
  if (t.includes('sueño') || t.includes('sueno') || t.includes('dormir') || t.includes('higiene del sue'))
    return { url: `${BASE}photo-1541781774459-bb2af2f05b55${W}`, alt: 'Habitación con cama ordenada y ambiente calmado para dormir bien' }
  if (t.includes('ansiedad') && (t.includes('pánico') || t.includes('distingu') || t.includes('estrés')))
    return { url: `${BASE}photo-1541199249251-f713e6145474${W}`, alt: 'Persona en estado de angustia y ansiedad' }
  if (t.includes('burnout') || t.includes('agotamient') || t.includes('sindrome'))
    return { url: `${BASE}photo-1488190211105-8b0e65b80b4e${W}`, alt: 'Persona agotada frente a una computadora con síntomas de burnout' }
  if (t.includes('duelo') || t.includes('pérdida') || t.includes('perdida'))
    return { url: `${BASE}photo-1473073899705-e7b1055a7419${W}`, alt: 'Persona reflexionando en un momento de duelo y pérdida' }
  if (t.includes('respiraci'))
    return { url: `${BASE}photo-1506905925346-21bda4d32df4${W}`, alt: 'Persona practicando técnicas de respiración profunda al aire libre' }
  if (t.includes('autoestima'))
    return { url: `${BASE}photo-1522075469751-3a6694fb2f61${W}`, alt: 'Persona sonriendo con confianza y autoestima positiva' }

  // ── Prevención ────────────────────────────────────────────
  if (t.includes('hipertens') || t.includes('presión arterial') || t.includes('presion arterial'))
    return { url: `${BASE}photo-1559757148-5c350d0d3c56${W}`, alt: 'Médico midiendo presión arterial a un paciente' }
  if (t.includes('diabetes') && (t.includes('prevenci') || t.includes('tipo 2')))
    return { url: `${BASE}photo-1579154204601-01588f351e67${W}`, alt: 'Medición de glucosa en sangre para prevención de diabetes' }
  if (t.includes('vacuna') || t.includes('inmuniz') || t.includes('calendario de vacu'))
    return { url: `${BASE}photo-1605289982774-9a6fef564df8${W}`, alt: 'Profesional de salud aplicando vacuna a un paciente adulto' }
  if (t.includes('examen') || t.includes('chequeo') || t.includes('preventivo'))
    return { url: `${BASE}photo-1576091160550-2173dba999ef${W}`, alt: 'Médico realizando chequeo preventivo con estetoscopio' }
  if (t.includes('fumar') || t.includes('tabaqui') || t.includes('cigarr'))
    return { url: `${BASE}photo-1559757175-5700dde675bc${W}`, alt: 'Señal de prohibido fumar — prevención del tabaquismo' }
  if (t.includes('cáncer de piel') || t.includes('cancer de piel') || t.includes('sol ecuator'))
    return { url: `${BASE}photo-1594882645126-14ac19a234b5${W}`, alt: 'Protección solar con bloqueador en la piel' }

  // ── Fallback por módulo ───────────────────────────────────
  const fallbacks = {
    'nutricion':       { url: `${BASE}photo-1512621776951-a57141f2eefd${W}`, alt: 'Alimentación saludable con vegetales y frutas' },
    'actividad-fisica':{ url: `${BASE}photo-1571019614242-c5c5dee9f50b${W}`, alt: 'Persona realizando actividad física' },
    'salud-mental':    { url: `${BASE}photo-1506126613408-eca07ce68773${W}`, alt: 'Persona en calma — bienestar mental' },
    'prevencion':      { url: `${BASE}photo-1576091160550-2173dba999ef${W}`, alt: 'Control médico preventivo' },
  }
  return fallbacks[modulo] || fallbacks['nutricion']
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
    const tieneImg = !!(data.imagenUrl || data.imagen?.url)

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

    // Agregar imagen si falta
    if (!tieneImg) {
      const img = getImgArticulo(data.titulo, data.modulo)
      try {
        await updateDoc(doc(db, 'articulos', d.id), {
          imagenUrl: img.url,
          imagenAlt: img.alt,
          actualizadoEn: serverTimestamp(),
        })
        log(`🖼 Imagen añadida: "${(data.titulo || '').slice(0, 50)}"`)
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
