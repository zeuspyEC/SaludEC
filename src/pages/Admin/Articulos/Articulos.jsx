import { useState, useEffect, useContext } from 'react'
import Button from '@components/ui/Button/Button'
import Badge from '@components/ui/Badge/Badge'
import Spinner from '@components/ui/Spinner/Spinner'
import Modal from '@components/common/Modal/Modal'
import FormField from '@components/common/FormField/FormField'
import { useToast } from '@contexts/ToastContext'
import { getArticulosByModulo, crearArticulo, actualizarArticulo, eliminarArticulo } from '@services/articulos.service'
import { MODULOS_LIST as MODULOS } from '@config/constants'
import './Articulos.css'

const FORM_INICIAL = { titulo: '', modulo: 'nutricion', categoria: '', resumen: '', contenido: '', slug: '', imagenUrl: '', imagenAlt: '' }

export default function AdminArticulos() {
  const toast = useToast()
  const [articulos, setArticulos] = useState([])
  const [moduloActivo, setModuloActivo] = useState('nutricion')
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editando, setEditando] = useState(null)
  const [form, setForm] = useState(FORM_INICIAL)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})

  const cargar = () => {
    setLoading(true)
    getArticulosByModulo(moduloActivo).then(setArticulos).finally(() => setLoading(false))
  }

  useEffect(() => { cargar() }, [moduloActivo])

  const abrirNuevo = () => {
    setEditando(null)
    setForm({ ...FORM_INICIAL, modulo: moduloActivo })
    setErrors({})
    setModal(true)
  }

  const abrirEditar = (a) => {
    setEditando(a)
    setForm({ titulo: a.titulo || '', modulo: a.modulo || moduloActivo, categoria: a.categoria || '', resumen: a.resumen || '', contenido: a.contenido || '', slug: a.slug || '', imagenUrl: a.imagenUrl || '', imagenAlt: a.imagenAlt || '' })
    setErrors({})
    setModal(true)
  }

  const validate = () => {
    const e = {}
    if (!form.titulo.trim()) e.titulo = 'El título es obligatorio.'
    if (!form.slug.trim()) e.slug = 'El slug es obligatorio.'
    if (!form.contenido.trim()) e.contenido = 'El contenido es obligatorio.'
    return e
  }

  const guardar = async () => {
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSaving(true)
    try {
      if (editando) {
        await actualizarArticulo(editando.id, form)
        toast.success('Artículo actualizado correctamente.')
      } else {
        await crearArticulo({ ...form, publicado: true })
        toast.success('Artículo publicado correctamente.')
      }
      setModal(false)
      cargar()
    } catch {
      toast.error('Ocurrió un error al guardar el artículo.')
    } finally {
      setSaving(false)
    }
  }

  const eliminar = async (id) => {
    if (!window.confirm('¿Eliminar este artículo? Esta acción no se puede deshacer.')) return
    try {
      await eliminarArticulo(id)
      setArticulos((p) => p.filter((a) => a.id !== id))
      toast.success('Artículo eliminado.')
    } catch {
      toast.error('Error al eliminar el artículo.')
    }
  }

  const slugificar = (txt) => txt.toLowerCase().trim().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

  return (
    <div className="admin-section-page">
      <header className="admin-section-page__header">
        <div>
          <h1 className="admin-header__title">Artículos</h1>
          <p className="admin-header__subtitle">Gestiona el contenido editorial de cada módulo</p>
        </div>
        <Button variant="primary" onClick={abrirNuevo}>+ Nuevo artículo</Button>
      </header>

      {/* Filtro módulo */}
      <div className="articulos-modulo-tabs" role="tablist" aria-label="Seleccionar módulo">
        {MODULOS.map((m) => (
          <button
            key={m.id}
            role="tab"
            aria-selected={moduloActivo === m.id}
            onClick={() => setModuloActivo(m.id)}
            className={`tipo-tab ${moduloActivo === m.id ? 'tipo-tab--active' : ''}`}
          >
            {m.nombre}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ padding: 'var(--space-16)', display: 'flex', justifyContent: 'center' }}><Spinner size="lg" /></div>
      ) : (
        <div className="articulos-table-wrap">
          <table className="admin-table">
            <caption className="sr-only">Artículos del módulo {moduloActivo}</caption>
            <thead>
              <tr>
                <th scope="col">Título</th>
                <th scope="col">Categoría</th>
                <th scope="col">Slug</th>
                <th scope="col">Estado</th>
                <th scope="col"><span className="sr-only">Acciones</span></th>
              </tr>
            </thead>
            <tbody>
              {articulos.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: 'var(--space-10)' }}>
                    No hay artículos en este módulo.
                  </td>
                </tr>
              ) : articulos.map((a) => (
                <tr key={a.id}>
                  <td className="articulos-td-titulo">{a.titulo}</td>
                  <td>{a.categoria || '—'}</td>
                  <td><code className="admin-slug">{a.slug}</code></td>
                  <td>
                    <button
                      className="estado-toggle"
                      onClick={async () => {
                        await actualizarArticulo(a.id, { publicado: !a.publicado })
                        setArticulos((p) => p.map((x) => x.id === a.id ? { ...x, publicado: !x.publicado } : x))
                        toast.success(a.publicado ? 'Artículo ocultado.' : 'Artículo publicado.')
                      }}
                      aria-label={`${a.publicado ? 'Ocultar' : 'Publicar'} "${a.titulo}"`}
                    >
                      <Badge variant={a.publicado ? 'success' : 'warning'}>{a.publicado ? 'Publicado' : 'Borrador'}</Badge>
                    </button>
                  </td>
                  <td className="articulos-td-actions">
                    <Button variant="ghost" size="sm" onClick={() => abrirEditar(a)}>Editar</Button>
                    <Button variant="danger" size="sm" onClick={() => eliminar(a.id)}>Eliminar</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal crear/editar */}
      <Modal
        isOpen={modal}
        onClose={() => setModal(false)}
        title={editando ? 'Editar artículo' : 'Nuevo artículo'}
        triggerId="nuevo-articulo-btn"
      >
        <div className="articulo-form">
          <FormField id="art-titulo" label="Título" required value={form.titulo} error={errors.titulo}
            onChange={(e) => {
              const v = e.target.value
              setForm((p) => ({ ...p, titulo: v, slug: editando ? p.slug : slugificar(v) }))
            }}
          />
          <FormField id="art-slug" label="Slug (URL)" required value={form.slug} error={errors.slug}
            hint="Se genera automáticamente. Solo minúsculas, números y guiones."
            onChange={(e) => setForm((p) => ({ ...p, slug: slugificar(e.target.value) }))}
          />
          <FormField id="art-categoria" label="Categoría" value={form.categoria}
            onChange={(e) => setForm((p) => ({ ...p, categoria: e.target.value }))}
          />
          <FormField id="art-resumen" label="Resumen" as="textarea" rows={2} value={form.resumen}
            onChange={(e) => setForm((p) => ({ ...p, resumen: e.target.value }))}
          />
          <FormField id="art-contenido" label="Contenido (HTML)" as="textarea" required rows={8} value={form.contenido} error={errors.contenido}
            onChange={(e) => setForm((p) => ({ ...p, contenido: e.target.value }))}
          />
          <FormField id="art-imagen-url" label="URL de imagen destacada" type="url"
            hint="Enlace a la imagen de portada del artículo (https://…)."
            value={form.imagenUrl}
            onChange={(e) => setForm((p) => ({ ...p, imagenUrl: e.target.value }))}
          />
          <FormField id="art-imagen-alt" label="Texto alternativo de la imagen" value={form.imagenAlt}
            hint="Descripción breve para lectores de pantalla — requerido si hay imagen. ATAG B.1.1 / WCAG 1.1.1"
            onChange={(e) => setForm((p) => ({ ...p, imagenAlt: e.target.value }))}
          />
          <div className="articulo-form__actions">
            <Button variant="outline" onClick={() => setModal(false)}>Cancelar</Button>
            <Button variant="primary" loading={saving} onClick={guardar}>
              {editando ? 'Guardar cambios' : 'Publicar artículo'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
