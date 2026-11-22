import { Link } from 'react-router-dom'
import brandLogo from '../assets/brand-cat-logo.png'

function Layout({ children }) {
  return (
    <div className="site-shell">
      <header className="nyan-header">
        <Link className="nyan-brand-lockup" to="/" aria-label="야옹아멍멍해바 홈">
          <img className="nyan-logo" src={brandLogo} alt="" />
          <span className="nyan-brand">야옹아멍멍해바</span>
        </Link>
        <span className="nyan-mobile" aria-label="12월 25일">
          <i className="mobile-string left" />
          <i className="mobile-string center" />
          <i className="mobile-string right" />
          <i className="mobile-star">★</i>
          <span className="mobile-ball"><small>12월</small><b>25</b></span>
          <i className="mobile-dot" />
        </span>
      </header>

      <main>{children}</main>

      <footer className="site-footer">
        <span>야옹아멍멍해바 · 2026</span>
      </footer>
    </div>
  )
}

export default Layout
