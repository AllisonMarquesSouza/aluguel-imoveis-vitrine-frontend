import { apiImageUrl } from '../api/http'

export const purposeLabels = {
  VENDA: 'À venda',
  ALUGUEL: 'Para alugar',
  VENDA_E_ALUGUEL: 'Venda ou aluguel',
}

export const natureLabels = {
  CASA: 'Casa',
  APARTAMENTO: 'Apartamento',
  TERRENO: 'Terreno',
  LOTE: 'Lote',
}

export const orderLabels = {
  MAIS_RECENTES: 'Mais recentes',
  MENOR_PRECO: 'Menor preço',
  MAIOR_PRECO: 'Maior preço',
  MENOR_AREA: 'Menor área',
  MAIOR_AREA: 'Maior área',
}

export function formatCurrency(value) {
  if (value === null || value === undefined || value === '') return 'Consulte o valor'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(Number(value))
}

export function priceFor(property, purpose = property?.finalidade) {
  if (purpose === 'ALUGUEL') return property?.valorAluguel
  if (purpose === 'VENDA') return property?.valorVenda
  return property?.valorVenda ?? property?.valorAluguel
}

export function formatArea(value) {
  if (value === null || value === undefined || value === '') return null
  return `${new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(Number(value))} m²`
}

export function formatLocation(address = {}) {
  const neighborhood = address.bairro
  const city = [address.cidade, address.uf].filter(Boolean).join(', ')
  return [neighborhood, city].filter(Boolean).join(' · ')
}

export function propertyCover(property) {
  const cover = property?.fotos?.find((photo) => photo.capa) || property?.fotos?.[0]
  if (cover?.url) return apiImageUrl(cover.url)
  if (cover?.imagemId && property?.id) {
    return apiImageUrl(`/imagens/imovel/${property.id}/${cover.imagemId}`)
  }
  if (property?.fotoCapaUrl) return apiImageUrl(property.fotoCapaUrl)
  if (property?.fotoCapaImagemId && property?.id) {
    return apiImageUrl(`/imagens/imovel/${property.id}/${property.fotoCapaImagemId}`)
  }
  return ''
}

export function profileImage(url) {
  return url ? apiImageUrl(url) : ''
}

export function propertyFeatures(property) {
  const block = property?.[String(property?.natureza || '').toLowerCase()]
  if (!block) return []
  const featureFields = {
    CASA: [
      ['quartos', 'quartos'], ['suites', 'suítes'], ['banheiros', 'banheiros'],
      ['vagas', 'vagas'], ['areaConstruida', 'área construída', 'area'], ['areaTerreno', 'terreno', 'area'],
    ],
    APARTAMENTO: [
      ['quartos', 'quartos'], ['suites', 'suítes'], ['banheiros', 'banheiros'],
      ['vagas', 'vagas'], ['areaPrivativa', 'área privativa', 'area'],
    ],
    TERRENO: [['areaTotal', 'área total', 'area'], ['topografia', 'topografia']],
    LOTE: [['area', 'área do lote', 'area']],
  }
  return (featureFields[property.natureza] || [])
    .filter(([key]) => block[key] !== null && block[key] !== undefined && block[key] !== '')
    .map(([key, label, kind]) => ({
      label,
      value: kind === 'area' ? formatArea(block[key]) : block[key],
    }))
}

export function getMapUrl(address = {}) {
  if (address.latitude === null || address.latitude === undefined || address.latitude === '' || address.longitude === null || address.longitude === undefined || address.longitude === '') return ''
  const latitude = Number(address.latitude)
  const longitude = Number(address.longitude)
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return ''
  const delta = 0.012
  const bounds = [longitude - delta, latitude - delta, longitude + delta, latitude + delta]
  const params = new URLSearchParams({ bbox: bounds.join(','), layer: 'mapnik', marker: `${latitude},${longitude}` })
  return `https://www.openstreetmap.org/export/embed.html?${params.toString()}`
}
