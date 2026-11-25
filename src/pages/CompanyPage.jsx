import { ErrorState, LoadingState } from '../components/Feedback'
import Icon from '../components/Icon'
import PublicImage from '../components/PublicImage'
import { profileImage } from '../utils/property'
import './ProfilePage.css'

export default function CompanyPage({ companyState, company, brokerId, onRetry, onNavigate, cityId }) {
  if (!brokerId) {
    return <main className="page-container profile-page"><div className="breadcrumbs"><button type="button" onClick={() => onNavigate(`/imoveis${cityId ? `?cidadeId=${encodeURIComponent(cityId)}` : ''}`)}>‹ <span>Voltar à vitrine</span></button><span aria-hidden="true">/</span><span>Perfil da empresa</span></div><div className="profile-dependency profile-dependency--standalone"><Icon name="building" size={24} /><div><h1>Perfil público da empresa</h1><p>A API atual não possui uma consulta pública direta de empresa. Este perfil pode ser apresentado quando alcançado por um corretor ativo cujo detalhe público inclua os dados da empresa.</p></div></div></main>
  }
  if (companyState.status === 'loading') return <main className="page-container profile-page"><LoadingState label="Carregando informações públicas da empresa…" /></main>
  if (companyState.status === 'error') return <main className="page-container profile-page"><ErrorState title={companyState.statusCode === 404 ? 'Dados da empresa indisponíveis' : 'Perfil da empresa indisponível'} message={companyState.error} onRetry={onRetry} /></main>
  if (!company) return null

  const cityQuery = cityId ? `?cidadeId=${encodeURIComponent(cityId)}` : ''
  const logo = profileImage(company.logoMarcaUrl)
  const location = [company.bairro, [company.cidadeBase?.nome, company.cidadeBase?.uf].filter(Boolean).join(', ')].filter(Boolean).join(' · ')

  return (
    <main className="profile-page">
      <div className="page-container">
        <div className="breadcrumbs"><button type="button" onClick={() => onNavigate(`/imoveis${cityQuery}`)}>‹ <span>Voltar à vitrine</span></button><span aria-hidden="true">/</span><span>Perfil da empresa</span></div>
        <section className="company-profile-hero">
          <div className="company-profile-hero__cover"><span>Uma presença local, um novo lugar para chamar de seu</span></div>
          <div className="company-profile-hero__body">
            <PublicImage key={logo || 'company-logo'} src={logo} className="company-profile-logo" alt={`Logomarca de ${company.nome}`} fallbackClassName="company-profile-logo company-profile-logo--fallback" fallback={<Icon name="building" size={39} />} loading="eager" />
            <div><span className="eyebrow">Perfil público da empresa</span><h1>{company.nome}</h1>{company.creci && <p>CRECI {company.creci}</p>}{location && <p className="profile-location"><Icon name="pin" size={16} />{location}</p>}</div>
          </div>
        </section>

        <div className="profile-content-grid">
          <section className="profile-panel"><span className="eyebrow">Sobre a empresa</span><h2>Um pouco sobre nós</h2><p>{company.descricao || 'A empresa não adicionou uma descrição pública.'}</p></section>
          <section className="profile-panel"><span className="eyebrow">Informações públicas</span><h2>Como falar com a empresa</h2><div className="profile-contact-list">
            {company.telefone && <a href={`tel:${String(company.telefone).replace(/\D/g, '')}`}><Icon name="phone" size={18} /><span><small>Telefone</small>{company.telefone}</span></a>}
            {company.email && <a href={`mailto:${company.email}`}><Icon name="mail" size={18} /><span><small>E-mail</small>{company.email}</span></a>}
            {location && <div><Icon name="pin" size={18} /><span><small>Região</small>{location}</span></div>}
          </div></section>
        </div>

        <section className="profile-listings" aria-labelledby="company-listings-title">
          <div className="section-heading"><div><span className="eyebrow">Vitrine da empresa</span><h2 id="company-listings-title">Imóveis desta empresa</h2><span className="section-mark" aria-hidden="true" /></div></div>
          <div className="profile-dependency"><Icon name="building" size={22} /><div><h3>A API ainda não disponibiliza essa vitrine</h3><p>Os dados públicos da empresa vêm do perfil do corretor ativo associado. O contrato não oferece uma consulta pública direta nem uma listagem de imóveis por empresa.</p></div></div>
          <button className="link-button" type="button" onClick={() => onNavigate(`/imoveis${cityQuery}`)}>Voltar aos imóveis da cidade <Icon name="arrow" size={17} /></button>
        </section>
        <p className="profile-source-note">Informações da empresa carregadas do DTO público do corretor associado (ID {brokerId}).</p>
      </div>
    </main>
  )
}
