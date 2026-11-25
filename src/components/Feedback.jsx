import Icon from './Icon'
import './Feedback.css'

export function LoadingState({ label = 'Carregando informações...' }) {
  return <div className="feedback feedback--loading" role="status"><span className="spinner" aria-hidden="true" />{label}</div>
}

export function EmptyState({ title, children, action }) {
  return (
    <div className="feedback-card">
      <span className="feedback-card__icon"><Icon name="search" size={23} /></span>
      <h2>{title}</h2>
      <p>{children}</p>
      {action}
    </div>
  )
}

export function ErrorState({ title = 'Não foi possível carregar', message, onRetry }) {
  return (
    <div className="feedback-card feedback-card--error" role="alert">
      <span className="feedback-card__icon"><Icon name="close" size={22} /></span>
      <h2>{title}</h2>
      <p>{message || 'Tente novamente em instantes.'}</p>
      {onRetry && <button className="button button--outline" type="button" onClick={onRetry}>Tentar novamente</button>}
    </div>
  )
}
