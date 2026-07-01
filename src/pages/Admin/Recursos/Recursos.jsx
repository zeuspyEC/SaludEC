import { useState, useEffect } from 'react'
import { collection, query, orderBy, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore'
import { db } from '@config/firebase'
import Button from '@components/ui/Button/Button'
import Badge from '@components/ui/Badge/Badge'
import Spinner from '@components/ui/Spinner/Spinner'
import Modal from '@components/common/Modal/Modal'
import FormField from '@components/common/FormField/FormField'
import { useToast } from '@contexts/ToastContext'
import { MODULOS_LIST, TIPOS_RECURSO } from '@config/constants'
import './Recursos.css'

const TIPOS = Object.values(TIPOS_RECURSO)
const MODULOS = MODULOS_LIST

const FORM_INICIAL = {
  titulo: '',
  tipo: 'pdf',
  modulo: 'nutricion',
  descripcion: '',
  url: '',
  duracion: '',
  transcripcion: '',
}

const TIPO_LABEL = {
  pdf: 'PDF',
  video: 'Video',
  podcast: 'Podcast',
  infografia: 'Infografía',
  guia: 'Guía',
}

const TIPO_VARIANT = {
  pdf: 'danger',
  video: 'primary',
  podcast: 'purple',
  infografia: 'teal',
  guia: 'success',
}

export default function AdminRecursos() {
  const toast = useToast()
  const [recursos, setRecursos] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editando, setEditando] = useState(null)
  const [form, setForm] = useState(FORM_INICIAL)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})

  const cargar = async () => {
    setLoading(true)
    const snap = await getDocs(query(collection(db, 'recursos'), orderBy('creadoEn', 'desc')))
    setRecursos(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    setLoading(false)
  }

  useEffect(() => { cargar() }, [])

  const abrirNuevo = () => {
    setEditando(null)
    setForm(FORM_INICIAL)
    setErrors({})
    setModal(true)
  }

  const abrirEditar = (r) => {
    setEditando(r)
    setForm({ titulo: r.titulo || '', tipo: r.tipo || 'pdf', modulo: r.modulo || 'nutricion', descripcion: r.descripcion || '', url: r.url || '', duracion: r.duracion || '', transcripcion: r.transcripcion || '' })
    setErrors({})
    setModal(true)
  }

  const validate = () => {
    const e = {}
    if (!form.titulo.trim()) e.titulo = 'El título es obligatorio.'
    if (!form.url.trim()) e.url = 'La URL es obligatoria.'
    else if (!/^https?:\/\/.+/.test(form.url)) e.url = 'Ingresa una URL válida (https://…).'
    return e
  }

  const guardar = async () => {
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSaving(true)
    try {
      if (editando) {
        await updateDoc(doc(db, 'recursos', editando.id), { ...form, actualizadoEn: serverTimestamp() })
        toast.success('Recurso actualizado.')
      } else {
        await addDoc(collection(db, 'recursos'), { ...form, creadoEn: serverTimestamp() })
        toast.success('Recurso agregado a la biblioteca.')
      }
      setModal(false)
      await cargar()
    } catch {
      toast.error('Error al guardar el recurso.')
    } finally {
      setSaving(false)
    }
  }

  const eliminar = async (id) => {
    if (!window.confirm('¿Eliminar este recurso?')) return
    try {
      await deleteDoc(doc(db, 'recursos', id))
      setRecursos((p) => p.filter((r) => r.id !== id))
      toast.success('Recurso eliminado.')
    } catch {
      toast.error('Error al eliminar el recurso.')
    }
  }

  return (
    <div className="admin-section-page">
      <header className="admin-section-page__header">
        <div>
          <h1 className="admin-header__title">Recursos</h1>
          <p className="admin-header__subtitle">Gestiona los recursos de la biblioteca digital</p>
        </div>
        <Button variant="primary" onClick={abrirNuevo}>+ Nuevo recurso</Button>
      </header>

      {loading ? (
        <div style={{ padding: 'var(--space-16)', display: 'flex', justifyContent: 'center' }}><Spinner size="lg" /></div>
      ) : (
        <div className="articulos-table-wrap">
          <table className="admin-table">
            <caption className="sr-only">Recursos de la biblioteca</caption>
            <thead>
              <tr>
                <th scope="col">Título</th>
                <th scope="col">Tipo</th>
                <th scope="col">Módulo</th>
                <th scope="col">URL</th>
                <th scope="col"><span className="sr-only">Acciones</span></th>
              </tr>
            </thead>
            <tbody>
              {recursos.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: 'var(--space-10)' }}>No hay recursos en la biblioteca.</td></tr>
              ) : recursos.map((r) => (
                <tr key={r.id}>
                  <td className="articulos-td-titulo">{r.titulo}</td>
                  <td><Badge variant={TIPO_VARIANT[r.tipo] || 'default'}>{TIPO_LABEL[r.tipo] || r.tipo}</Badge></td>
                  <td style={{ textTransform: 'capitalize' }}>{r.modulo?.replace('-', ' ') || '—'}</td>
                  <td>
                    <a href={r.url} target="_blank" rel="noopener noreferrer" className="recurso-url-link">
                      Ver recurso<span className="sr-only"> (abre en nueva pestaña)</span>
                    </a>
                  </td>
                  <td className="articulos-td-actions">
                    <Button variant="ghost" size="sm" onClick={() => abrirEditar(r)}>Editar</Button>
                    <Button variant="danger" size="sm" onClick={() => eliminar(r.id)}>Eliminar</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={modal} onClose={() => setModal(false)} title={editando ? 'Editar recurso' : 'Nuevo recurso'}>
        <div className="articulo-form">
          <FormField id="rec-titulo" label="Título" required value={form.titulo} error={errors.titulo}
            onChange={(e) => setForm((p) => ({ ...p, titulo: e.target.value }))}
          />

          <div className="rec-form-row">
            <div className="form-field">
              <label htmlFor="rec-tipo" className="form-field__label">Tipo de recurso</label>
              <select id="rec-tipo" value={form.tipo} onChange={(e) => setForm((p) => ({ ...p, tipo: e.target.value }))} className="form-field__control">
                {TIPOS.map((t) => <option key={t} value={t}>{TIPO_LABEL[t] || t}</option>)}
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="rec-modulo" className="form-field__label">Módulo</label>
              <select id="rec-modulo" value={form.modulo} onChange={(e) => setForm((p) => ({ ...p, modulo: e.target.value }))} className="form-field__control">
                {MODULOS.map((m) => <option key={m.id} value={m.id}>{m.nombre}</option>)}
              </select>
            </div>
          </div>

          <FormField id="rec-url" label="URL del recurso" type="url" required value={form.url} error={errors.url}
            hint="Enlace directo al archivo PDF, video, podcast o página web."
            onChange={(e) => setForm((p) => ({ ...p, url: e.target.value }))}
          />

          <FormField id="rec-duracion" label="Duración / Páginas" value={form.duracion}
            hint="Opcional. Ej: '15 min', '8 páginas', '45:00'"
            onChange={(e) => setForm((p) => ({ ...p, duracion: e.target.value }))}
          />

          <FormField id="rec-descripcion" label="Descripción" as="textarea" rows={3} value={form.descripcion}
            onChange={(e) => setForm((p) => ({ ...p, descripcion: e.target.value }))}
          />

          {(form.tipo === 'video' || form.tipo === 'podcast' || form.tipo === 'pdf') && (
            <FormField id="rec-transcripcion" label="URL de transcripción o subtítulos" type="url"
              hint="Enlace a la transcripción textual o archivo de subtítulos — WCAG 1.2.2 / 1.2.3. Recomendado para todos los medios multimedia."
              value={form.transcripcion}
              onChange={(e) => setForm((p) => ({ ...p, transcripcion: e.target.value }))}
            />
          )}

          <div className="articulo-form__actions">
            <Button variant="outline" onClick={() => setModal(false)}>Cancelar</Button>
            <Button variant="primary" loading={saving} onClick={guardar}>
              {editando ? 'Guardar cambios' : 'Agregar recurso'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
