import Icon from './Icon'
import './SiteHeader.css'

export default function SiteHeader({
  cities = [],
  cityId = '',
  citiesStatus,
  onCityChange,
  onNavigate,
  onOpenMenu,
  menuOpen,
}) {
  return (
    <header className="site-header">
      <a className="brand" href="/" onClick={(event) => { event.preventDefault(); onNavigate('/') }} aria-label="Meu Imóvel — início">
        <span className="brand__mark"><Icon name="home" size={30} /><i /></span>
        <span className="brand__name">Meu<br />Imóvel</span>
      </a>

      <nav className={`main-nav${menuOpen ? ' main-nav--open' : ''}`} aria-label="Navegação principal">
        <a href="/imoveis?finalidade=VENDA" onClick={(event) => { event.preventDefault(); onNavigate('/imoveis', { finalidade: 'VENDA' }) }}>Comprar</a>
        <a href="/imoveis?finalidade=ALUGUEL" onClick={(event) => { event.preventDefault(); onNavigate('/imoveis', { finalidade: 'ALUGUEL' }) }}>Alugar</a>
        <a href="/imoveis" onClick={(event) => { event.preventDefault(); onNavigate('/imoveis') }}>Ver todos os imóveis</a>
      </nav>

      <div className="header-tools">
        <label className="city-picker">
          <Icon name="pin" size={19} />
          <span className="sr-only">Cidade da vitrine</span>
          <select value={cityId} onChange={(event) => onCityChange(event.target.value)} aria-label="Escolha a cidade da vitrine">
            <option value="">{citiesStatus === 'loading' ? 'Carregando cidades…' : 'Escolha sua cidade'}</option>
            {cityId && !cities.some((item) => String(item.id) === String(cityId)) && citiesStatus !== 'loading' && <option value={cityId}>{citiesStatus === 'success' ? 'Cidade indisponível' : 'Cidade selecionada'}</option>}
            {cities.map((city) => <option key={city.id} value={String(city.id)}>{city.nome} · {city.uf}</option>)}
          </select>
          <Icon name="chevron" size={15} />
        </label>
        <button type="button" className="menu-toggle" aria-label={menuOpen ? 'Fechar navegação' : 'Abrir navegação'} aria-expanded={Boolean(menuOpen)} onClick={onOpenMenu}><Icon name={menuOpen ? 'close' : 'menu'} /></button>
      </div>
    </header>
  )
}
