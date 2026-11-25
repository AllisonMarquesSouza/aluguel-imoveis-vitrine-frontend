import { useMemo, useState } from 'react'
import Icon from '../components/Icon'
import PublicImage from '../components/PublicImage'
import { ErrorState, LoadingState } from '../components/Feedback'
import { formatArea, formatCurrency, formatLocation, getMapUrl, natureLabels, profileImage, propertyFeatures, priceFor, purposeLabels } from '../utils/property'
import { registerWhatsAppContact } from '../api/publicApi'
import { apiImageUrl } from '../api/http'
import './PropertyPage.css'

function propertyRows(property) {
  const nature = property?.natureza
  const values = property?.[String(nature || '').toLowerCase()] || {}
  const definitions = {
    CASA: [
      ['Área do terreno', values.areaTerreno, 'area'], ['Área construída', values.areaConstruida, 'area'],
      ['Área livre', values.areaLivre, 'area'], ['Quartos', values.quartos], ['Suítes', values.suites],
      ['Banheiros', values.banheiros], ['Salas', values.salas], ['Vagas', values.vagas],
      ['Pavimentos', values.pavimentos], ['Ano de construção', values.anoConstrucao],
      ['Piscina', values.piscina, 'boolean'], ['Quintal', values.quintal, 'boolean'],
      ['Churrasqueira', values.churrasqueira, 'boolean'], ['Mobiliada', values.mobiliada, 'boolean'],
    ],
    APARTAMENTO: [
      ['Unidade', values.numero], ['Andar', values.andar], ['Área privativa', values.areaPrivativa, 'area'],
      ['Área total', values.areaTotal, 'area'], ['Quartos', values.quartos], ['Suítes', values.suites],
      ['Banheiros', values.banheiros], ['Vagas', values.vagas], ['Varanda', values.varanda, 'boolean'],
      ['Posição solar', values.posicaoSolar], ['Elevadores', values.predio?.elevadores],
      ['Portaria 24 horas', values.predio?.portaria24h, 'boolean'], ['Piscina no prédio', values.predio?.piscina, 'boolean'],
      ['Academia no prédio', values.predio?.academia, 'boolean'],
    ],
    TERRENO: [
      ['Área total', values.areaTotal, 'area'], ['Frente', values.frente, 'meters'], ['Fundo', values.fundo, 'meters'],
      ['Lateral esquerda', values.lateralEsquerda, 'meters'], ['Lateral direita', values.lateralDireita, 'meters'],
      ['Topografia', values.topografia], ['Murado', values.muro, 'boolean'], ['Esquina', values.esquina, 'boolean'],
      ['Uso permitido', values.usoPermitido],
    ],
    LOTE: [
      ['Número do lote', values.numero], ['Área', values.area, 'area'], ['Frente', values.frente, 'meters'],
      ['Fundo', values.fundo, 'meters'], ['Condições de parcelamento', values.condicoesParcelamento],
      ['Quadra', values.quadra?.identificacao], ['Loteamento', values.quadra?.loteamento?.nome],
    ],
  }

  return (definitions[nature] || []).filter(([, value]) => value !== null && value !== undefined && value !== '').map(([label, value, type]) => ({
    label,
    value: type === 'area' ? formatArea(value) : type === 'meters' ? `${new Intl.NumberFormat('pt-BR').format(Number(value))} m` : type === 'boolean' ? (value ? 'Sim' : 'Não') : value,
  }))
}

function addressLabel(address = {}) {
  const street = [address.logradouro, address.numero, address.complemento].filter(Boolean).join(', ')
  return [street, formatLocation(address)].filter(Boolean).join(' · ')
}

export default function PropertyPage({ property, propertyState, onRetry, onBack, onNavigate, cityId }) {
  const [galleryState, setGalleryState] = useState({ propertyId: null, selectedPhoto: 0, photoUnavailable: false })
  const [contactState, setContactState] = useState({ propertyId: null, state: 'idle', message: '', url: '' })
  const selectedPhoto = galleryState.propertyId === property?.id ? galleryState.selectedPhoto : 0
  const photoUnavailable = galleryState.propertyId === property?.id && galleryState.photoUnavailable
  const contactStatus = contactState.propertyId === property?.id ? contactState : { state: 'idle', message: '', url: '' }
  const photos = useMemo(() => [...(property?.fotos || [])].sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0)), [property?.fotos])

  if (propertyState.status === 'loading') return <main className="page-container property-shell"><LoadingState label="Carregando detalhes do imóvel…" /></main>
  if (propertyState.status === 'error') return <main className="page-container property-shell"><ErrorState title={propertyState.statusCode === 404 ? 'Imóvel não encontrado' : 'Detalhes indisponíveis'} message={propertyState.error} onRetry={onRetry} /><button className="text-button property-back-fallback" type="button" onClick={onBack}>Voltar à vitrine</button></main>
  if (!property) return null

  const selected = photos[selectedPhoto]
  const photoUrl = selected?.url ? apiImageUrl(selected.url) : selected?.imagemId ? apiImageUrl(`/imagens/imovel/${property.id}/${selected.imagemId}`) : ''
  const address = property.endereco || property.apartamento?.predio?.endereco || {}
  const mapUrl = getMapUrl(address)
  const broker = property.corretor
  const company = broker?.empresa
  const rows = propertyRows(property)
  const features = propertyFeatures(property)
  const price = priceFor(property)
  const brokerPhoto = profileImage(broker?.fotoUrl)

  async function contactOnWhatsApp() {
    if (contactStatus.state === 'loading') return
    if (contactStatus.state === 'success') {
      if (contactStatus.url) window.open(contactStatus.url, '_blank', 'noopener,noreferrer')
      return
    }
    const openedTab = window.open('about:blank', '_blank')
    setContactState({ propertyId: property.id, state: 'loading', message: 'Solicitando link seguro à API…', url: '' })
    try {
      const response = await registerWhatsAppContact(property.id)
      const url = response?.whatsappUrl
      if (!url) {
        if (openedTab) openedTab.close()
        setContactState({ propertyId: property.id, state: 'success', message: 'A API confirmou o contato, mas não disponibilizou um link de WhatsApp.', url: '' })
        return
      }
      if (openedTab) {
        openedTab.opener = null
        openedTab.location.href = url
      }
      setContactState({ propertyId: property.id, state: 'success', message: 'A API confirmou o contato. O WhatsApp está pronto para abrir.', url })
    } catch (error) {
      if (openedTab) openedTab.close()
      setContactState({ propertyId: property.id, state: 'error', message: error.message, url: '' })
    }
  }

  const profileQuery = new URLSearchParams()
  if (cityId) profileQuery.set('cidadeId', cityId)
  const brokerHref = broker?.id ? `/corretor/${broker.id}${profileQuery.size ? `?${profileQuery}` : ''}` : ''
  const companyParams = new URLSearchParams(profileQuery)
  if (broker?.id) companyParams.set('corretorId', broker.id)
  const companyHref = company?.id ? `/empresa/${company.id}?${companyParams}` : ''

  return (
    <main className="property-page">
      <div className="page-container">
        <div className="breadcrumbs"><button type="button" onClick={onBack}>‹ <span>Voltar aos resultados</span></button><span aria-hidden="true">/</span><span>{natureLabels[property.natureza] || 'Imóvel'}</span></div>

        <div className="property-topline"><div><span className="eyebrow">{purposeLabels[property.finalidade] || property.finalidade || 'Imóvel disponível'}</span><h1>{property.titulo || 'Imóvel disponível'}</h1><p className="property-location"><Icon name="pin" size={17} />{addressLabel(address) || 'Localização informada na API'}</p></div><span className="property-status">Disponível</span></div>

        <section className="property-hero-grid" aria-label="Fotos e contato do imóvel">
          <div className="gallery">
            <div className="gallery__main">
              {photoUrl && !photoUnavailable
                ? <img src={photoUrl} alt={`${property.titulo || 'Imóvel'} — foto ${selectedPhoto + 1}`} onError={() => setGalleryState({ propertyId: property.id, selectedPhoto, photoUnavailable: true })} />
                : <div className="gallery__fallback"><Icon name="home" size={50} /><span>{photos.length ? 'Esta imagem não está disponível' : 'Nenhuma foto foi disponibilizada'}</span></div>}
              {photos.length > 1 && <span className="gallery__counter">{selectedPhoto + 1} / {photos.length} fotos</span>}
            </div>
            {photos.length > 1 && <div className="gallery__thumbs" aria-label="Fotos do imóvel">{photos.map((photo, index) => {
              const thumbUrl = photo.url ? apiImageUrl(photo.url) : photo.imagemId ? apiImageUrl(`/imagens/imovel/${property.id}/${photo.imagemId}`) : ''
              return <button key={photo.imagemId || photo.id || index} className={index === selectedPhoto ? 'is-active' : ''} type="button" onClick={() => setGalleryState({ propertyId: property.id, selectedPhoto: index, photoUnavailable: false })} aria-label={`Ver foto ${index + 1}`} aria-pressed={index === selectedPhoto}>{thumbUrl ? <img src={thumbUrl} alt="" loading="lazy" /> : <Icon name="home" size={22} />}</button>
            })}</div>}
          </div>

          <aside className="contact-card">
            <span className="eyebrow">Fale com o corretor</span>
            {broker ? <div className="contact-agent">
              <PublicImage key={`${property.id}-${brokerPhoto}`} src={brokerPhoto} alt={`Foto de ${broker.nome}`} className="contact-agent__avatar" fallbackClassName="contact-agent__avatar" fallback={<Icon name="home" size={24} />} />
              <div><strong>{broker.nome || 'Corretor responsável'}</strong><span>{company?.nome || 'Atendimento imobiliário'}</span>{broker.creci && <small>CRECI {broker.creci}</small>}</div>
            </div> : <p className="contact-card__unavailable">Os dados do corretor não vieram no detalhe público.</p>}
            <button className="button button--whatsapp" type="button" onClick={contactOnWhatsApp} disabled={contactStatus.state === 'loading'}><Icon name="whatsapp" size={19} />{contactStatus.state === 'loading' ? 'Preparando contato…' : contactStatus.state === 'success' && contactStatus.url ? 'Abrir WhatsApp' : 'Conversar no WhatsApp'}</button>
            {contactStatus.message && <div className={`contact-feedback contact-feedback--${contactStatus.state}`} role={contactStatus.state === 'error' ? 'alert' : 'status'}>{contactStatus.message}{contactStatus.url && <a href={contactStatus.url} target="_blank" rel="noreferrer">Abrir WhatsApp agora</a>}</div>}
            {brokerHref && <button className="text-button contact-profile-link" type="button" onClick={() => onNavigate(brokerHref)}>Ver perfil público do corretor <Icon name="arrow" size={15} /></button>}
          </aside>
        </section>

        <div className="property-content-grid">
          <div className="property-main-content">
            <section className="property-price-card" aria-label="Valores do imóvel">
              <div><span className="eyebrow">{property.finalidade === 'ALUGUEL' ? 'Valor do aluguel' : property.finalidade === 'VENDA_E_ALUGUEL' ? 'Valor de venda' : 'Valor do imóvel'}</span><strong>{formatCurrency(price)}{(property.finalidade === 'ALUGUEL' || property.finalidade === 'VENDA_E_ALUGUEL') && price != null && <small>{property.finalidade === 'ALUGUEL' ? '/mês' : ''}</small>}</strong></div>
              <div className="property-price-card__extras">{property.finalidade === 'VENDA_E_ALUGUEL' && property.valorAluguel != null && <span><small>Aluguel</small><strong>{formatCurrency(property.valorAluguel)}<small>/mês</small></strong></span>}{property.valorCondominio != null && <span><small>Condomínio</small><strong>{formatCurrency(property.valorCondominio)}<small>/mês</small></strong></span>}{property.valorIptu != null && <span><small>IPTU</small><strong>{formatCurrency(property.valorIptu)}<small>/ano</small></strong></span>}</div>
            </section>

            <section className="property-section">
              <div className="section-title-row"><div><span className="eyebrow">Informações da propriedade</span><h2>Detalhes do imóvel</h2></div><span className="nature-badge">{natureLabels[property.natureza] || property.natureza}</span></div>
              {features.length > 0 && <div className="quick-features">{features.map((feature) => <span key={feature.label}>{feature.label === 'quartos' ? <Icon name="bed" size={18} /> : feature.label === 'vagas' ? <Icon name="car" size={18} /> : <Icon name="area" size={18} />}<strong>{feature.value}</strong><small>{feature.label}</small></span>)}</div>}
              <dl className="detail-list">{rows.map((row) => <div key={row.label}><dt>{row.label}</dt><dd>{row.value}</dd></div>)}</dl>
              {property.caracteristicas?.length > 0 && <div className="amenities"><h3>Características</h3><ul>{property.caracteristicas.map((item) => <li key={item.id}><span aria-hidden="true">✓</span>{item.nome}</li>)}</ul></div>}
            </section>

            {property.descricao && <section className="property-section description-section"><span className="eyebrow">Conheça melhor</span><h2>Sobre este imóvel</h2><p>{property.descricao}</p></section>}

            <section className="property-section location-section"><span className="eyebrow">Localização aproximada</span><h2>Onde fica</h2><p>{addressLabel(address) || 'As informações de endereço não estão disponíveis.'}</p>{mapUrl ? <div className="map-frame"><iframe src={mapUrl} title={`Mapa da localização de ${property.titulo || 'imóvel'}`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" /><a href={`https://www.openstreetmap.org/?mlat=${address.latitude}&mlon=${address.longitude}#map=16/${address.latitude}/${address.longitude}`} target="_blank" rel="noreferrer">Abrir mapa em nova aba</a></div> : <div className="map-unavailable"><Icon name="pin" size={22} /><span>A API não disponibilizou coordenadas para este imóvel.</span></div>}</section>
          </div>

          <aside className="property-side-content">
            {broker && <div className="side-profile-card"><span className="eyebrow">Atendimento</span><h2>Seu contato no imóvel</h2><p>Conheça quem pode ajudar com este imóvel.</p>{brokerHref && <button type="button" className="profile-link-card" onClick={() => onNavigate(brokerHref)}><PublicImage key={`side-${property.id}-${brokerPhoto}`} src={brokerPhoto} alt="" className="profile-link-card__avatar" fallbackClassName="profile-link-card__avatar" fallback={<Icon name="home" />} /><span><strong>{broker.nome}</strong><small>Ver perfil do corretor</small></span><Icon name="arrow" size={18} /></button>}</div>}
            {company && <div className="side-profile-card side-profile-card--company"><span className="eyebrow">Empresa responsável</span><PublicImage key={`${property.id}-${company.logoMarcaUrl || 'company-logo'}`} src={profileImage(company.logoMarcaUrl)} alt={`Logomarca de ${company.nome}`} className="company-logo" fallbackClassName="company-mark" fallback={<Icon name="building" size={24} />} /><h2>{company.nome}</h2>{company.creci && <p>CRECI {company.creci}</p>}{companyHref && <button className="button button--outline" type="button" onClick={() => onNavigate(companyHref)}>Conheça a empresa <Icon name="arrow" size={16} /></button>}</div>}
          </aside>
        </div>
        <div className="detail-footer-link"><button className="link-button" type="button" onClick={() => onNavigate(`/imoveis${cityId ? `?cidadeId=${encodeURIComponent(cityId)}` : ''}`)}>Ver mais imóveis <Icon name="arrow" size={17} /></button></div>
      </div>
    </main>
  )
}
