import { useEffect, useMemo, useState } from 'react'
import { ApiError } from './api/http'
import { getBroker, getCities, getCharacteristics, getProperties, getProperty } from './api/publicApi'
import SiteHeader from './components/SiteHeader'
import Icon from './components/Icon'
import HomePage from './pages/HomePage'
import ListingPage from './pages/ListingPage'
import PropertyPage from './pages/PropertyPage'
import BrokerPage from './pages/BrokerPage'
import CompanyPage from './pages/CompanyPage'
import { ErrorState } from './components/Feedback'
import './App.css'

const CITY_STORAGE_KEY = 'meu-imovel.cidade-id'
const LISTING_FILTERS = ['cidadeId', 'texto', 'finalidade', 'natureza', 'precoMinimo', 'precoMaximo', 'quartos', 'suites', 'vagas', 'bairro', 'areaMinima', 'areaMaxima', 'ordenacao', 'pagina', 'tamanho']

function readLocation() {
  return { pathname: window.location.pathname.replace(/\/$/, '') || '/', search: window.location.search }
}

function apiFailure(error) {
  return { status: 'error', error: error.message, statusCode: error instanceof ApiError ? error.status : 0 }
}

function normalizePage(response) {
  if (Array.isArray(response)) return { items: response, pageNumber: 0, totalPages: 1, totalElements: response.length }
  const items = Array.isArray(response?.content) ? response.content : []
  return {
    items,
    pageNumber: Number(response?.number ?? 0),
    totalPages: Number(response?.totalPages ?? (items.length ? 1 : 0)),
    totalElements: Number(response?.totalElements ?? items.length),
  }
}

function routeMatch(pathname) {
  const property = pathname.match(/^\/imovel\/([^/]+)$/)
  const broker = pathname.match(/^\/corretor\/([^/]+)$/)
  const company = pathname.match(/^\/empresa\/([^/]+)$/)
  if (property) return { name: 'property', id: decodeURIComponent(property[1]) }
  if (broker) return { name: 'broker', id: decodeURIComponent(broker[1]) }
  if (company) return { name: 'company', id: decodeURIComponent(company[1]) }
  if (pathname === '/imoveis') return { name: 'listing' }
  if (pathname === '/') return { name: 'home' }
  return { name: 'not-found' }
}

function getListingBackUrl(search, cityId) {
  const source = new URLSearchParams(search)
  const result = new URLSearchParams()
  LISTING_FILTERS.forEach((key) => {
    source.getAll(key).forEach((value) => result.append(key, value))
  })
  source.getAll('caracteristicas').forEach((value) => result.append('caracteristicas', value))
  if (!result.has('cidadeId') && cityId) result.set('cidadeId', cityId)
  return `/imoveis${result.size ? `?${result.toString()}` : ''}`
}

function NotFoundPage({ onNavigate }) {
  return <main className="page-container not-found-page"><ErrorState title="Esta página não está disponível" message="Confira o endereço ou volte para a vitrine pública." /><button className="button button--primary" type="button" onClick={() => onNavigate('/')}>Ir para a página inicial <Icon name="arrow" size={16} /></button></main>
}

function SiteFooter({ onNavigate }) {
  return <footer className="site-footer"><div className="site-footer__brand"><span className="brand__mark"><Icon name="home" size={27} /><i /></span><span>Meu<br />Imóvel</span></div><p>Uma vitrine pública para encontrar o seu próximo lugar.</p><button type="button" onClick={() => onNavigate('/imoveis')}>Explorar imóveis <Icon name="arrow" size={15} /></button><small>Navegação aberta para todos. Sem login ou cadastro.</small></footer>
}

function App() {
  const [location, setLocation] = useState(readLocation)
  const [cityId, setCityId] = useState(() => {
    const fromUrl = new URLSearchParams(window.location.search).get('cidadeId')
    if (fromUrl) localStorage.setItem(CITY_STORAGE_KEY, fromUrl)
    return fromUrl || localStorage.getItem(CITY_STORAGE_KEY) || ''
  })
  const [cities, setCities] = useState({ status: 'loading', items: [], error: '' })
  const [characteristics, setCharacteristics] = useState({ status: 'idle', items: [], error: '' })
  const [listing, setListing] = useState({ status: 'idle', items: [], totalElements: 0, totalPages: 0, pageNumber: 0, error: '', statusCode: 0 })
  const [propertyState, setPropertyState] = useState({ status: 'idle', item: null, error: '', statusCode: 0 })
  const [brokerState, setBrokerState] = useState({ status: 'idle', item: null, error: '', statusCode: 0 })
  const [companyState, setCompanyState] = useState({ status: 'idle', item: null, error: '', statusCode: 0 })
  const [cityRetry, setCityRetry] = useState(0)
  const [listingRetry, setListingRetry] = useState(0)
  const [propertyRetry, setPropertyRetry] = useState(0)
  const [brokerRetry, setBrokerRetry] = useState(0)
  const [companyRetry, setCompanyRetry] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)

  const route = useMemo(() => routeMatch(location.pathname), [location.pathname])
  const routeParams = useMemo(() => new URLSearchParams(location.search), [location.search])
  const activeCityId = routeParams.get('cidadeId') || cityId
  const city = cities.items.find((item) => String(item.id) === String(activeCityId)) || null
  const cityInvalid = cities.status === 'success' && Boolean(activeCityId) && !city
  const cityValidationPending = Boolean(activeCityId) && cities.status === 'loading'
  const cityCanBrowse = Boolean(city) || (cities.status === 'error' && Boolean(activeCityId))
  const isListingRoute = route.name === 'listing' || route.name === 'home'

  function commitLocation(path, replace = false) {
    const url = new URL(path, window.location.origin)
    const previousPath = window.location.pathname
    if (replace) window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`)
    else window.history.pushState({}, '', `${url.pathname}${url.search}${url.hash}`)
    setLocation(readLocation())
    setMenuOpen(false)
    window.scrollTo({ top: 0, behavior: url.pathname !== previousPath ? 'instant' : 'smooth' })
  }

  function navigate(path, additions = {}, options = {}) {
    const url = new URL(path, window.location.origin)
    if (options.preserveCity !== false && activeCityId && !url.searchParams.has('cidadeId')) {
      url.searchParams.set('cidadeId', activeCityId)
    }
    Object.entries(additions).forEach(([key, value]) => {
      url.searchParams.delete(key)
      if (Array.isArray(value)) value.forEach((item) => url.searchParams.append(key, item))
      else if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, value)
    })
    commitLocation(`${url.pathname}${url.search}${url.hash}`, options.replace)
  }

  function chooseCity(nextCityId) {
    if (nextCityId) {
      localStorage.setItem(CITY_STORAGE_KEY, nextCityId)
      setCityId(nextCityId)
    } else {
      localStorage.removeItem(CITY_STORAGE_KEY)
      setCityId('')
    }
    const params = new URLSearchParams(location.search)
    if (nextCityId) params.set('cidadeId', nextCityId)
    else params.delete('cidadeId')
    commitLocation(`${location.pathname}${params.size ? `?${params.toString()}` : ''}`, true)
  }

  useEffect(() => {
    const handlePopState = () => {
      const nextLocation = readLocation()
      const nextCityId = new URLSearchParams(nextLocation.search).get('cidadeId')
      if (nextCityId) {
        localStorage.setItem(CITY_STORAGE_KEY, nextCityId)
        setCityId(nextCityId)
      } else {
        setCityId(localStorage.getItem(CITY_STORAGE_KEY) || '')
      }
      setLocation(nextLocation)
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    let cancelled = false
    Promise.resolve().then(() => {
      if (cancelled) return null
      setCities({ status: 'loading', items: [], error: '' })
      return getCities()
    }).then((items) => {
      if (items === null) return
      if (!Array.isArray(items)) throw new Error('A API retornou uma resposta de cidades inesperada.')
      if (!cancelled) setCities({ status: 'success', items, error: '' })
    }).catch((error) => {
      if (!cancelled) setCities({ status: 'error', items: [], error: error.message })
    })
    return () => { cancelled = true }
  }, [cityRetry])

  useEffect(() => {
    if (!isListingRoute) return undefined
    let cancelled = false
    const params = new URLSearchParams(location.search)
    const requestedCityId = params.get('cidadeId') || cityId
    if (!requestedCityId || cities.status === 'loading' || (cities.status === 'success' && !cities.items.some((item) => String(item.id) === String(requestedCityId)))) {
      return undefined
    }

    const filters = { cidadeId: requestedCityId }
    ;['texto', 'finalidade', 'natureza', 'precoMinimo', 'precoMaximo', 'quartos', 'suites', 'vagas', 'bairro', 'areaMinima', 'areaMaxima', 'ordenacao'].forEach((key) => {
      const value = params.get(key)
      if (value) filters[key] = value
    })
    const selectedCharacteristics = params.getAll('caracteristicas')
    if (selectedCharacteristics.length) filters.caracteristicas = selectedCharacteristics
    filters.pagina = params.get('pagina') || '0'
    filters.tamanho = params.get('tamanho') || (route.name === 'home' ? '3' : '12')

    Promise.resolve().then(() => {
      if (cancelled) return null
      setListing({ status: 'loading', items: [], totalElements: 0, totalPages: 0, pageNumber: 0, error: '', statusCode: 0 })
      return getProperties(filters)
    }).then((response) => {
      if (response === null) return
      if (!cancelled) setListing({ status: 'success', ...normalizePage(response), error: '', statusCode: 0 })
    }).catch((error) => {
      if (!cancelled) setListing({ status: 'error', items: [], totalElements: 0, totalPages: 0, pageNumber: 0, ...apiFailure(error) })
    })
    return () => { cancelled = true }
  }, [isListingRoute, location.pathname, location.search, cityId, cities.status, cities.items, route.name, listingRetry])

  useEffect(() => {
    let cancelled = false
    Promise.resolve().then(() => {
      if (cancelled) return null
      setCharacteristics({ status: 'loading', items: [], error: '' })
      return getCharacteristics()
    }).then((items) => {
      if (items === null) return
      if (!Array.isArray(items)) throw new Error('A API retornou um catálogo de características inesperado.')
      if (!cancelled) setCharacteristics({ status: 'success', items, error: '' })
    }).catch((error) => {
      if (!cancelled) setCharacteristics({ status: 'error', items: [], error: error.message })
    })
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (route.name !== 'property') return undefined
    let cancelled = false
    Promise.resolve().then(() => {
      if (cancelled) return null
      setPropertyState({ status: 'loading', item: null, error: '', statusCode: 0 })
      return getProperty(route.id)
    }).then((item) => {
      if (item === null) return
      if (!cancelled) setPropertyState({ status: 'success', item, error: '', statusCode: 0 })
    }).catch((error) => {
      if (!cancelled) setPropertyState({ status: 'error', item: null, ...apiFailure(error) })
    })
    return () => { cancelled = true }
  }, [route.name, route.id, propertyRetry])

  useEffect(() => {
    if (route.name !== 'broker') return undefined
    let cancelled = false
    Promise.resolve().then(() => {
      if (cancelled) return null
      setBrokerState({ status: 'loading', item: null, error: '', statusCode: 0 })
      return getBroker(route.id)
    }).then((item) => {
      if (item === null) return
      if (!cancelled) setBrokerState({ status: 'success', item, error: '', statusCode: 0 })
    }).catch((error) => {
      if (!cancelled) setBrokerState({ status: 'error', item: null, ...apiFailure(error) })
    })
    return () => { cancelled = true }
  }, [route.name, route.id, brokerRetry])

  const requestedBrokerId = routeParams.get('corretorId')
  useEffect(() => {
    if (route.name !== 'company' || !requestedBrokerId) return undefined
    let cancelled = false
    Promise.resolve().then(() => {
      if (cancelled) return null
      setCompanyState({ status: 'loading', item: null, error: '', statusCode: 0 })
      return getBroker(requestedBrokerId)
    }).then((broker) => {
      if (broker === null) return
      if (cancelled) return
      if (!broker?.empresa || String(broker.empresa.id) !== String(route.id)) {
        setCompanyState({ status: 'error', item: null, error: 'A API não retornou dados públicos para esta empresa por meio do corretor informado.', statusCode: 404 })
        return
      }
      setCompanyState({ status: 'success', item: broker.empresa, error: '', statusCode: 0 })
    }).catch((error) => {
      if (!cancelled) setCompanyState({ status: 'error', item: null, ...apiFailure(error) })
    })
    return () => { cancelled = true }
  }, [route.name, route.id, requestedBrokerId, companyRetry])

  const currentListingParams = useMemo(() => new URLSearchParams(location.search), [location.search])

  function browse(filters = {}) {
    const params = new URLSearchParams()
    if (activeCityId) params.set('cidadeId', activeCityId)
    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value)) value.forEach((item) => params.append(key, item))
      else if (value) params.set(key, value)
    })
    if (!params.has('ordenacao')) params.set('ordenacao', 'MAIS_RECENTES')
    params.set('pagina', '0')
    navigate(`/imoveis?${params.toString()}`)
  }

  function openProperty(property, propertyCityId = activeCityId) {
    const params = new URLSearchParams(currentListingParams)
    if (propertyCityId) params.set('cidadeId', String(propertyCityId))
    else params.delete('cidadeId')
    navigate(`/imovel/${encodeURIComponent(property.id)}${params.size ? `?${params.toString()}` : ''}`)
  }

  function backToResults() {
    const backUrl = getListingBackUrl(location.search, activeCityId)
    navigate(backUrl)
  }

  function applyFilters(nextParams) {
    if (activeCityId) nextParams.set('cidadeId', activeCityId)
    navigate(`/imoveis?${nextParams.toString()}`)
  }

  function changePage(page) {
    const params = new URLSearchParams(location.search)
    params.set('pagina', String(page))
    navigate(`/imoveis?${params.toString()}`)
  }

  const renderedHeader = <SiteHeader
    cities={cities.items}
    cityId={activeCityId}
    citiesStatus={cities.status}
    onCityChange={chooseCity}
    onNavigate={navigate}
    onOpenMenu={() => setMenuOpen((open) => !open)}
    menuOpen={menuOpen}
  />

  return (
    <div className="app-shell">
      {renderedHeader}
      {route.name === 'home' && <HomePage
        cities={cities.items}
        cityId={activeCityId}
        city={city}
        cityInvalid={cityInvalid}
        cityAvailable={cityCanBrowse && !cityInvalid}
        citiesStatus={cities.status}
        citiesError={cities.error}
        listing={listing}
        onChooseCity={chooseCity}
        onSearch={(params) => browse(Object.fromEntries(params.entries()))}
        onOpenProperty={openProperty}
        onBrowse={browse}
        onRetryCities={() => setCityRetry((value) => value + 1)}
        onRetryListings={() => setListingRetry((value) => value + 1)}
      />}

      {route.name === 'listing' && <ListingPage
        city={city || (cityCanBrowse ? { id: activeCityId, nome: 'Cidade selecionada', uf: '' } : null)}
        citySelected={cityCanBrowse && !cityInvalid}
        cityInvalid={cityInvalid}
        cityValidationPending={cityValidationPending}
        listing={listing}
        params={currentListingParams}
        characteristics={characteristics.items}
        characteristicsError={characteristics.status === 'error' ? characteristics.error : ''}
        onNavigate={navigate}
        onOpenProperty={openProperty}
        onApplyFilters={applyFilters}
        onClearFilters={() => browse()}
        onChangePage={changePage}
        onRetry={() => setListingRetry((value) => value + 1)}
      />}

      {route.name === 'property' && <PropertyPage
        property={propertyState.item}
        propertyState={propertyState}
        onRetry={() => setPropertyRetry((value) => value + 1)}
        onBack={backToResults}
        onNavigate={navigate}
        cityId={activeCityId}
      />}

      {route.name === 'broker' && <BrokerPage
        broker={brokerState.item}
        brokerState={brokerState}
        onRetry={() => setBrokerRetry((value) => value + 1)}
        onNavigate={navigate}
        cityId={activeCityId}
      />}

      {route.name === 'company' && <CompanyPage
        company={companyState.item}
        companyState={companyState}
        brokerId={requestedBrokerId}
        onRetry={() => setCompanyRetry((value) => value + 1)}
        onNavigate={navigate}
        cityId={activeCityId}
      />}

      {route.name === 'not-found' && <NotFoundPage onNavigate={navigate} />}
      <SiteFooter onNavigate={navigate} />
    </div>
  )
}

export default App
