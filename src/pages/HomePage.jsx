import { useState } from 'react'
import Icon from '../components/Icon'
import PropertyCard from '../components/PropertyCard'
import { EmptyState, ErrorState, LoadingState } from '../components/Feedback'
import './HomePage.css'

export default function HomePage({
  cities,
  cityId,
  city,
  cityInvalid,
  cityAvailable,
  citiesStatus,
  citiesError,
  listing,
  onChooseCity,
  onSearch,
  onOpenProperty,
  onBrowse,
  onRetryCities,
  onRetryListings,
}) {
  const [purpose, setPurpose] = useState('')
  const [nature, setNature] = useState('')
  const [neighborhood, setNeighborhood] = useState('')

  function submitSearch(event) {
    event.preventDefault()
    const params = new URLSearchParams()
    if (purpose) params.set('finalidade', purpose)
    if (nature) params.set('natureza', nature)
    if (neighborhood.trim()) params.set('bairro', neighborhood.trim())
    params.set('ordenacao', 'MAIS_RECENTES')
    params.set('pagina', '0')
    onSearch(params)
  }

  return (
    <main>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__content">
          <span className="eyebrow eyebrow--light">Um novo jeito de encontrar seu lugar</span>
          <h1 id="hero-title">Encontre o imóvel<br />ideal na sua cidade</h1>
          <span className="section-mark" aria-hidden="true" />
          <p>Casas, apartamentos, terrenos e muito mais, com contato direto com o corretor.</p>
          <div className="hero__city">
            <Icon name="pin" size={18} />
            <label htmlFor="home-city">Sua cidade</label>
            <select id="home-city" value={cityId || ''} onChange={(event) => onChooseCity(event.target.value)}>
              <option value="">{cityInvalid ? 'Escolha outra cidade' : 'Escolha uma cidade'}</option>
              {cityInvalid && <option value={cityId}>Cidade indisponível</option>}
              {cities.map((item) => <option value={String(item.id)} key={item.id}>{item.nome} · {item.uf}</option>)}
            </select>
            <Icon name="chevron" size={16} />
          </div>
        </div>
        <div className="hero__search-wrap">
          <div className="search-tabs" aria-label="Finalidade">
            <button className={purpose === 'VENDA' ? 'is-active' : ''} type="button" onClick={() => setPurpose('VENDA')}><Icon name="home" size={18} />Comprar</button>
            <button className={purpose === 'ALUGUEL' ? 'is-active' : ''} type="button" onClick={() => setPurpose('ALUGUEL')}><span className="search-tabs__key">⌕</span>Alugar</button>
            <button className={!purpose ? 'is-active' : ''} type="button" onClick={() => setPurpose('')}><span className="search-tabs__stack">▱</span>Todos</button>
          </div>
          <form className="quick-search" onSubmit={submitSearch}>
            <label className="quick-search__field"><span>Natureza</span><select value={nature} onChange={(event) => setNature(event.target.value)}><option value="">Todos os tipos</option><option value="CASA">Casa</option><option value="APARTAMENTO">Apartamento</option><option value="TERRENO">Terreno</option><option value="LOTE">Lote</option></select></label>
            <label className="quick-search__field"><span>Bairro</span><input value={neighborhood} onChange={(event) => setNeighborhood(event.target.value)} placeholder="Qualquer bairro" /></label>
            <button className="button button--primary quick-search__submit" type="submit"><Icon name="search" size={18} />Buscar imóveis</button>
          </form>
        </div>
      </section>

      {citiesStatus === 'error' && <div className="home-content home-content--compact"><ErrorState title="Não foi possível carregar as cidades" message={citiesError} onRetry={onRetryCities} /></div>}

      <section className="trust-row" aria-label="Vantagens da vitrine pública">
        <div><span className="trust-row__icon">✦</span><span>Sem cadastro<br />para navegar</span></div>
        <div><Icon name="whatsapp" size={23} /><span>Contato direto<br />com o corretor</span></div>
        <div><Icon name="pin" size={23} /><span>Imóveis da<br />sua cidade</span></div>
        <div><Icon name="home" size={23} /><span>Diferentes tipos<br />de imóveis</span></div>
      </section>

      <section className="home-content featured-section" aria-labelledby="featured-title">
        <div className="section-heading">
          <div><span className="eyebrow">Uma boa escolha começa aqui</span><h2 id="featured-title">Imóveis em destaque</h2><span className="section-mark" aria-hidden="true" /></div>
          {cityId && <button className="link-button" type="button" onClick={() => onBrowse()}><span>Ver todos os imóveis</span><Icon name="arrow" size={18} /></button>}
        </div>
        {!cityAvailable && cityInvalid && <EmptyState title="A cidade selecionada não está disponível">Escolha outra cidade no seletor acima para abrir uma vitrine válida.</EmptyState>}
        {!cityAvailable && !cityInvalid && citiesStatus === 'success' && <EmptyState title="Escolha uma cidade para começar">A vitrine é organizada por cidade. Selecione uma opção acima para ver os imóveis disponíveis na região.</EmptyState>}
        {!cityAvailable && citiesStatus === 'loading' && <LoadingState label="Buscando cidades disponíveis…" />}
        {cityAvailable && listing.status === 'loading' && <LoadingState label={`Buscando imóveis em ${city?.nome || 'sua cidade'}…`} />}
        {cityAvailable && listing.status === 'error' && <ErrorState message={listing.error} onRetry={onRetryListings} />}
        {cityAvailable && listing.status === 'success' && listing.items.length === 0 && <EmptyState title="Ainda não há imóveis nesta cidade">Tente outra cidade ou volte mais tarde para ver novas oportunidades.</EmptyState>}
        {cityAvailable && listing.status === 'success' && listing.items.length > 0 && <>
          <div className="property-grid property-grid--featured">{listing.items.slice(0, 3).map((property) => <PropertyCard key={property.id} property={property} cityId={cityId} onOpen={onOpenProperty} />)}</div>
          <button className="button button--outline featured-more" type="button" onClick={() => onBrowse()}>Explorar a vitrine completa <Icon name="arrow" size={17} /></button>
        </>}
      </section>

      <section className="nature-section" aria-labelledby="nature-title">
        <div className="home-content">
          <div className="section-heading section-heading--simple"><div><span className="eyebrow">Encontre o que combina com você</span><h2 id="nature-title">Explore por natureza</h2><span className="section-mark" aria-hidden="true" /></div></div>
          <div className="nature-grid">
            {[
              ['CASA', 'Casas', 'home'], ['APARTAMENTO', 'Apartamentos', 'building'],
              ['TERRENO', 'Terrenos', 'area'], ['LOTE', 'Lotes', 'pin'],
            ].map(([value, label, icon]) => <button className="nature-tile" type="button" key={value} onClick={() => onBrowse({ natureza: value })}><span><Icon name={icon} size={25} /></span><strong>{label}</strong><Icon className="nature-tile__arrow" name="arrow" size={18} /></button>)}
          </div>
        </div>
      </section>
    </main>
  )
}
