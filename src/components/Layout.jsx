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
        <Link className="brand" to="/" aria-label="누가 썼게 홈">
          <span className="brand-mark">✦</span>
          <span>
            <strong>누가 썼게?</strong>
            <small>Christmas Letter Tree</small>
          </span>
        </Link>

        <nav className="header-nav" aria-label="주요 메뉴">
          {latestTree && (
            <Link className="text-link" to={`/my-tree/${latestTree.slug}`}>
              내 트리
            </Link>
          )}
          <Link className="button button-small" to="/create">
            트리 만들기
          </Link>
        </nav>
      </header>

      <main>{children}</main>

      <footer className="site-footer">
        <span>마음은 크리스마스에 열립니다.</span>
        <span aria-hidden="true">✦ 2026 ✦</span>
      </footer>
    </div>
  )
}

export default Layout
