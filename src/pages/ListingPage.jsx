import { useMemo, useState } from 'react'
import Icon from '../components/Icon'
import PropertyCard from '../components/PropertyCard'
import FilterPanel from '../components/FilterPanel'
import { EmptyState, ErrorState, LoadingState } from '../components/Feedback'
import { natureLabels, orderLabels, purposeLabels } from '../utils/property'
import './ListingPage.css'

function summaryTitle(params) {
  if (params.get('finalidade') === 'ALUGUEL') return 'Imóveis para alugar'
  if (params.get('finalidade') === 'VENDA') return 'Imóveis à venda'
  if (params.get('natureza')) return `${natureLabels[params.get('natureza')] || 'Imóveis'}${params.get('bairro') ? ` em ${params.get('bairro')}` : ''}`
  return 'Imóveis para você'
}

function activeFilters(params) {
  const chips = []
  const simple = [
    ['finalidade', (value) => purposeLabels[value] || value],
    ['natureza', (value) => natureLabels[value] || value],
    ['bairro', (value) => value],
    ['texto', (value) => `“${value}”`],
    ['quartos', (value) => `${value}+ quartos`],
    ['suites', (value) => `${value}+ suítes`],
    ['vagas', (value) => `${value}+ vagas`],
    ['precoMinimo', (value) => `A partir de R$ ${value}`],
    ['precoMaximo', (value) => `Até R$ ${value}`],
    ['areaMinima', (value) => `A partir de ${value} m²`],
    ['areaMaxima', (value) => `Até ${value} m²`],
    ['ordenacao', (value) => value !== 'MAIS_RECENTES' ? orderLabels[value] || value : null],
  ]
  simple.forEach(([key, label]) => {
    const value = params.get(key)
    const text = value ? label(value) : null
    if (text) chips.push([key, text])
  })
  if (params.getAll('caracteristicas').length) chips.push(['caracteristicas', `${params.getAll('caracteristicas').length} características`])
  return chips
}

export default function ListingPage({
  city,
  citySelected,
  cityInvalid,
  cityValidationPending,
  listing,
  params,
  characteristics,
  characteristicsError,
  onNavigate,
  onOpenProperty,
  onApplyFilters,
  onClearFilters,
  onChangePage,
  onRetry,
}) {
  const [filtersOpen, setFiltersOpen] = useState(false)
  const paramsKey = params.toString()
  const chips = useMemo(() => activeFilters(new URLSearchParams(paramsKey)), [paramsKey])
  const pageNumber = listing.pageNumber ?? Number(params.get('pagina') || 0)
  const totalPages = listing.totalPages ?? 0
  const totalElements = listing.totalElements ?? listing.items.length

  return (
    <main className="listing-page">
      <div className="page-container">
        <div className="breadcrumbs"><a href="/" onClick={(event) => { event.preventDefault(); onNavigate('/') }}>Início</a><span aria-hidden="true">/</span><span>Imóveis</span>{city?.nome && city.nome !== 'Cidade selecionada' && <><span aria-hidden="true">/</span><span>{city.nome}{city.uf ? `, ${city.uf}` : ''}</span></>}</div>
        <div className="listing-heading">
          <div><span className="eyebrow">Sua próxima conquista começa aqui</span><h1>{summaryTitle(params)}</h1><p>{city ? `Veja os imóveis publicados em ${city.nome}, ${city.uf}.` : 'Escolha uma cidade para ver os imóveis disponíveis.'}</p></div>
          <button className="button button--outline filter-toggle" type="button" onClick={() => setFiltersOpen(true)}><Icon name="search" size={17} />Filtros{chips.length > 0 && <span className="filter-toggle__count">{chips.length}</span>}</button>
        </div>
        {chips.length > 0 && <div className="active-filters" aria-label="Filtros aplicados">{chips.map(([key, label]) => <span key={key}>{label}<span className="active-filters__dot" aria-hidden="true" /></span>)}<button type="button" onClick={onClearFilters}>Limpar</button></div>}

        <div className="listing-layout">
          <aside className={`listing-sidebar${filtersOpen ? ' listing-sidebar--open' : ''}`} aria-label="Filtros da busca">
            <FilterPanel key={paramsKey} params={params} characteristics={characteristics} onApply={(next) => { setFiltersOpen(false); onApplyFilters(next) }} onClear={() => { setFiltersOpen(false); onClearFilters() }} onClose={() => setFiltersOpen(false)} />
          </aside>
          {filtersOpen && <button className="filter-backdrop" type="button" aria-label="Fechar filtros" onClick={() => setFiltersOpen(false)} />}

          <section className="listing-results" aria-live="polite" aria-busy={listing.status === 'loading'}>
            <div className="results-toolbar"><span>{listing.status === 'success' ? <><strong>{totalElements}</strong> {totalElements === 1 ? 'imóvel encontrado' : 'imóveis encontrados'}</> : 'Resultados da vitrine'}</span><span>{params.get('ordenacao') ? (orderLabels[params.get('ordenacao')] || params.get('ordenacao')) : 'Mais recentes'}</span></div>
            {!citySelected && cityValidationPending && <LoadingState label="Validando a cidade escolhida…" />}
            {!citySelected && cityInvalid && <EmptyState title="A cidade selecionada não está disponível">Escolha outra cidade no seletor do topo para ver uma vitrine válida.</EmptyState>}
            {!citySelected && !cityValidationPending && !cityInvalid && <EmptyState title="Escolha uma cidade">A vitrine mostra somente imóveis da cidade selecionada. Use o seletor no topo para continuar.</EmptyState>}
            {citySelected && listing.status === 'loading' && <LoadingState label="Buscando imóveis…" />}
            {citySelected && listing.status === 'error' && <ErrorState title={listing.statusCode === 404 ? 'Vitrine indisponível' : 'Não foi possível buscar os imóveis'} message={listing.error} onRetry={onRetry} />}
            {citySelected && listing.status === 'success' && listing.items.length === 0 && <EmptyState title="Nenhum imóvel encontrado">Experimente retirar alguns filtros ou escolher outra cidade.</EmptyState>}
            {citySelected && listing.status === 'success' && listing.items.length > 0 && <>
              <div className="property-grid listing-grid">{listing.items.map((property) => <PropertyCard key={property.id} property={property} cityId={city?.id} onOpen={onOpenProperty} />)}</div>
              {characteristicsError && <p className="catalog-note">O catálogo de características não pôde ser carregado. Os demais filtros continuam disponíveis.</p>}
              {totalPages > 1 && <nav className="pagination" aria-label="Paginação de imóveis"><button type="button" disabled={pageNumber <= 0} onClick={() => onChangePage(pageNumber - 1)}>Anterior</button><span>Página <strong>{pageNumber + 1}</strong> de {totalPages}</span><button type="button" disabled={pageNumber + 1 >= totalPages} onClick={() => onChangePage(pageNumber + 1)}>Próxima</button></nav>}
            </>}
          </section>
        </div>
      </div>
    </main>
  )
}
