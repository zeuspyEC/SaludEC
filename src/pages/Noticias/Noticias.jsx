import { useState, useEffect, useRef } from 'react'
import PageWrapper from '@components/layout/PageWrapper/PageWrapper'
import Breadcrumb from '@components/layout/Breadcrumb/Breadcrumb'
import SectionHero from '@components/common/SectionHero/SectionHero'
import NewsCard from '@components/common/NewsCard/NewsCard'
import Spinner from '@components/ui/Spinner/Spinner'
import Button from '@components/ui/Button/Button'
import { getNoticias } from '@services/noticias.service'
import './Noticias.css'

const PAGE_SIZE = 9

export default function Noticias() {
  const [noticias, setNoticias] = useState([])
  const [cursor, setCursor] = useState(null)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState(null)
  const isFirstLoad = useRef(true)

  // Carga inicial
  useEffect(() => {
    setLoading(true)
    setError(null)
    getNoticias(null, PAGE_SIZE)
      .then(({ docs, lastDoc, hasMore: more }) => {
        setNoticias(docs)
        setCursor(lastDoc)
        setHasMore(more)
      })
      .catch(() => setError(true))
      .finally(() => { setLoading(false); isFirstLoad.current = false })
  }, [])

  const cargarMas = () => {
    if (loadingMore || !hasMore) return
    setLoadingMore(true)
    getNoticias(cursor, PAGE_SIZE)
      .then(({ docs, lastDoc, hasMore: more }) => {
        setNoticias((prev) => [...prev, ...docs])
        setCursor(lastDoc)
        setHasMore(more)
      })
      .catch(() => setError(true))
      .finally(() => setLoadingMore(false))
  }

  const [primero, ...resto] = noticias

  return (
    <PageWrapper title="Noticias de Salud" description="Últimas noticias, investigaciones y actualizaciones sobre salud preventiva y bienestar.">
      <SectionHero
        tag="Actualidad en salud"
        title="Noticias de salud"
        description="Mantente informado con las últimas investigaciones, recomendaciones oficiales y novedades en salud preventiva y bienestar."
        icon="📰"
        gradient="blue"
      />

      <div className="noticias-page container">
        <Breadcrumb />

        {error && (
          <div role="alert" className="noticias-error">
            No pudimos cargar las noticias. Por favor, recarga la página.
          </div>
        )}

        {loading ? (
          <div className="noticias-loading"><Spinner size="lg" label="Cargando noticias…" /></div>
        ) : noticias.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon" aria-hidden="true">📰</div>
            <h2>No hay noticias publicadas</h2>
            <p>Estamos actualizando el contenido. Vuelve en breve.</p>
          </div>
        ) : (
          <section aria-labelledby="noticias-title">
            <h2 id="noticias-title" className="sr-only">Listado de noticias</h2>

            <div className="noticias-grid">
              {primero && <NewsCard noticia={primero} featured />}
              {resto.map((n) => <NewsCard key={n.id} noticia={n} />)}
            </div>

            {hasMore && (
              <div className="noticias-load-more">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={cargarMas}
                  loading={loadingMore}
                  aria-label="Cargar más noticias"
                >
                  {loadingMore ? 'Cargando…' : 'Cargar más noticias'}
                </Button>
              </div>
            )}

            {!hasMore && noticias.length > 0 && (
              <p className="noticias-end" role="status">Has visto todas las noticias disponibles.</p>
            )}
          </section>
        )}
      </div>
    </PageWrapper>
  )
}
