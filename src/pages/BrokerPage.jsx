import { ErrorState, LoadingState } from '../components/Feedback'
import Icon from '../components/Icon'
import PublicImage from '../components/PublicImage'
import { profileImage } from '../utils/property'
import './ProfilePage.css'

export default function BrokerPage({ brokerState, broker, onRetry, onNavigate, cityId }) {
  if (brokerState.status === 'loading') return <main className="page-container profile-page"><LoadingState label="Carregando perfil público…" /></main>
  if (brokerState.status === 'error') return <main className="page-container profile-page"><ErrorState title={brokerState.statusCode === 404 ? 'Perfil não encontrado' : 'Perfil indisponível'} message={brokerState.error} onRetry={onRetry} /></main>
  if (!broker) return null

  const photo = profileImage(broker.fotoUrl)
  const company = broker.empresa
  const cityQuery = cityId ? `?cidadeId=${encodeURIComponent(cityId)}` : ''

  return (
    <main className="profile-page">
      <div className="page-container">
        <div className="breadcrumbs"><button type="button" onClick={() => onNavigate(`/imoveis${cityQuery}`)}>‹ <span>Voltar à vitrine</span></button><span aria-hidden="true">/</span><span>Perfil do corretor</span></div>
        <section className="profile-banner" aria-label="Perfil do corretor">
          <div className="profile-banner__cover"><span>Meu Imóvel · atendimento público</span></div>
          <div className="profile-banner__body">
            <PublicImage key={photo || 'broker-avatar'} src={photo} className="profile-avatar" alt={`Foto de ${broker.nome}`} fallbackClassName="profile-avatar profile-avatar--fallback" fallback={<Icon name="home" size={38} />} loading="eager" />
            <div className="profile-banner__identity"><span className="eyebrow">Corretor de imóveis</span><h1>{broker.nome}</h1>{broker.creci && <span className="profile-creci">CRECI {broker.creci}</span>}</div>
            {company?.nome && <div className="profile-company-chip"><Icon name="building" size={17} /><span>{company.nome}</span></div>}
          </div>
        </section>

        <div className="profile-content-grid">
          <section className="profile-panel"><span className="eyebrow">Apresentação</span><h2>Sobre o corretor</h2><p>{broker.apresentacao || 'O corretor não adicionou uma apresentação pública.'}</p></section>
          <section className="profile-panel"><span className="eyebrow">Contato público</span><h2>Fale com o corretor</h2><div className="profile-contact-list">
            {broker.telefone && <a href={`tel:${String(broker.telefone).replace(/\D/g, '')}`}><Icon name="phone" size={18} /><span><small>Telefone</small>{broker.telefone}</span></a>}
            {broker.email && <a href={`mailto:${broker.email}`}><Icon name="mail" size={18} /><span><small>E-mail</small>{broker.email}</span></a>}
          </div></section>
        </div>

        {company?.id && <section className="profile-panel profile-company-link"><span className="eyebrow">Empresa associada</span><h2>{company.nome}</h2><p>Conheça as informações públicas disponíveis para esta empresa.</p><button className="button button--outline" type="button" onClick={() => onNavigate(`/empresa/${company.id}?corretorId=${broker.id}${cityId ? `&cidadeId=${encodeURIComponent(cityId)}` : ''}`)}>Ver perfil da empresa <Icon name="arrow" size={17} /></button></section>}

        <section className="profile-listings" aria-labelledby="broker-listings-title">
          <div className="section-heading"><div><span className="eyebrow">Vitrine individual</span><h2 id="broker-listings-title">Imóveis deste corretor</h2><span className="section-mark" aria-hidden="true" /></div></div>
          <div className="profile-dependency"><Icon name="building" size={22} /><div><h3>A API ainda não disponibiliza essa vitrine</h3><p>O contrato público atual permite consultar este perfil, mas não oferece um filtro ou endpoint para listar os imóveis vinculados ao corretor. Nenhuma lista genérica foi apresentada como se fosse deste perfil.</p></div></div>
          <button className="link-button" type="button" onClick={() => onNavigate(`/imoveis${cityQuery}`)}>Voltar aos imóveis da cidade <Icon name="arrow" size={17} /></button>
        </section>
      </div>
    </main>
  )
}
