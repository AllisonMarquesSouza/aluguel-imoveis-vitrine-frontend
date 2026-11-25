import { request } from './http'

export function getCities() {
  return request('/vitrine/cidades')
}

export function getCharacteristics() {
  return request('/caracteristica')
}

export function getProperties(filters) {
  const params = new URLSearchParams()

  Object.entries(filters).forEach(([key, value]) => {
    if (Array.isArray(value)) value.forEach((item) => params.append(key, item))
    else if (value !== undefined && value !== null && value !== '') params.set(key, value)
  })

  return request(`/vitrine/imoveis?${params.toString()}`)
}

export function getProperty(id) {
  return request(`/vitrine/imoveis/${encodeURIComponent(id)}`)
}

export function getBroker(id) {
  return request(`/corretor/${encodeURIComponent(id)}`)
}

export function registerWhatsAppContact(id) {
  return request(`/vitrine/imoveis/${encodeURIComponent(id)}/contatos`, {
    method: 'POST',
    body: JSON.stringify({ canal: 'WHATSAPP' }),
  })
}
