import { Link } from 'react-router-dom'

export function LoadingView({ message = '트리를 불러오는 중이에요...' }) {
  return (
    <div className="status-view">
      <span className="loading-star" aria-hidden="true">✦</span>
      <p>{message}</p>
    </div>
  )
}

export function ErrorView({ message, onRetry }) {
  return (
    <div className="status-view error-view">
      <span aria-hidden="true">✉</span>
      <h2>잠시 길을 잃었어요</h2>
      <p>{message}</p>
      <div className="button-row">
        {onRetry && <button className="button" type="button" onClick={onRetry}>다시 시도</button>}
        <Link className="button button-secondary" to="/">홈으로</Link>
      </div>
    </div>
  )
}
