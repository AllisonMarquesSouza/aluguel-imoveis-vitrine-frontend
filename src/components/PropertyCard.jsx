import { useState } from 'react'
import Icon from './Icon'
import { formatArea, formatCurrency, formatLocation, natureLabels, priceFor, propertyCover, purposeLabels } from '../utils/property'
import './PropertyCard.css'

export default function PropertyCard({ property, onOpen, cityId, context = '' }) {
  const [imageUnavailable, setImageUnavailable] = useState(false)
  const imageUrl = propertyCover(property)
  const price = priceFor(property)
  const secondaryRent = property?.finalidade === 'VENDA_E_ALUGUEL' && property?.valorAluguel != null
  const features = property?.[String(property?.natureza || '').toLowerCase()] || {}
  const area = features.areaConstruida ?? features.areaPrivativa ?? features.areaTotal ?? features.area
  const purpose = purposeLabels[property?.finalidade] || property?.finalidade
  const nature = natureLabels[property?.natureza] || property?.natureza

  return (
    <article className="property-card">
      <button className="property-card__open" type="button" onClick={() => onOpen(property, cityId, context)} aria-label={`Ver imóvel: ${property.titulo}`}>
        <span className="property-card__image-wrap">
          {imageUrl && !imageUnavailable
            ? <img src={imageUrl} alt={property.titulo ? `Foto do imóvel: ${property.titulo}` : 'Foto do imóvel'} loading="lazy" onError={() => setImageUnavailable(true)} />
            : <span className="property-card__image-fallback"><Icon name="home" size={37} /><span>Imagem indisponível</span></span>}
          <span className="property-card__purpose">{purpose || 'Imóvel'}</span>
        </span>
        <span className="property-card__body">
          <span className="property-card__title">{property.titulo || nature || 'Imóvel disponível'}</span>
          <span className="property-card__location"><Icon name="pin" size={15} />{formatLocation(property.endereco) || 'Localização disponível na página do imóvel'}</span>
          <span className="property-card__price">{formatCurrency(price)}{property?.finalidade === 'ALUGUEL' && price != null ? <small>/mês</small> : null}</span>
          {secondaryRent && <span className="property-card__secondary-price">Aluguel {formatCurrency(property.valorAluguel)}<small>/mês</small></span>}
          <span className="property-card__meta">
            {nature && <span>{nature}</span>}
            {features.quartos != null && <span><Icon name="bed" size={15} />{features.quartos} quartos</span>}
            {features.vagas != null && <span><Icon name="car" size={15} />{features.vagas} vagas</span>}
            {area != null && <span><Icon name="area" size={15} />{formatArea(area)}</span>}
          </span>
        </span>
      </button>
    </article>
  )
}
