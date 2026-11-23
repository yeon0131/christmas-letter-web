import { useEffect } from 'react'
import { Link } from 'react-router-dom'

function PolicyPage({ title, description, children }) {
  useEffect(() => {
    const previousTitle = document.title
    document.title = `${title} | 야옹아멍멍해바`
    return () => {
      document.title = previousTitle
    }
  }, [title])

  return (
    <article className="policy-page">
      <div className="policy-heading">
        <p>POLICY · 2026</p>
        <h1>{title}</h1>
        <p>{description}</p>
        <small>시행일: 2026년 11월 23일</small>
      </div>

      <div className="policy-paper">{children}</div>

      <Link className="policy-home-link" to="/">홈으로 돌아가기</Link>
    </article>
  )
}

export default PolicyPage
