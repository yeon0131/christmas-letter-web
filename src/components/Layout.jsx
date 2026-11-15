import { Link } from 'react-router-dom'
import { getLatestTreeAccess } from '../storage'

const SNOWFLAKES = Array.from({ length: 22 }, (_, index) => index)

function Layout({ children }) {
  const latestTree = getLatestTreeAccess()

  return (
    <div className="site-shell">
      <div className="snowfall" aria-hidden="true">
        {SNOWFLAKES.map((flake) => (
          <span
            key={flake}
            style={{
              '--flake-left': `${(flake * 47) % 101}%`,
              '--flake-delay': `-${(flake * 0.73) % 9}s`,
              '--flake-duration': `${7 + (flake % 6)}s`,
              '--flake-size': `${4 + (flake % 5)}px`,
            }}
          />
        ))}
      </div>

      <header className="site-header">
        <Link className="brand" to="/" aria-label="야옹아멍멍해바 홈">
          <span className="brand-mark" aria-hidden="true">🐱</span>
          <strong>야옹아멍멍해바</strong>
          <span className="brand-spark" aria-hidden="true">✦</span>
        </Link>

        <nav className="header-nav" aria-label="주요 메뉴">
          <Link className="text-link nav-home" to="/">홈</Link>
          <a className="text-link nav-guide" href="/#how-it-works">이용 안내</a>
          {latestTree && (
            <Link className="my-tree-link" to={`/my-tree/${latestTree.slug}`}>
              내 트리
            </Link>
          )}
        </nav>
      </header>

      <main>{children}</main>

      <footer className="site-footer">
        <span>크리스마스 당일에 편지를 열어봐요.</span>
        <span aria-hidden="true">야옹아멍멍해바 · 2026</span>
      </footer>
    </div>
  )
}

export default Layout
