import { Link } from 'react-router-dom'
import ChristmasTree from '../components/ChristmasTree'
import { SAMPLE_ORNAMENTS } from '../ornaments'

function HomePage() {
  return (
    <>
      <section className="hero-section">
        <div className="hero-copy">
          <span className="hero-holly" aria-hidden="true">✣</span>
          <h1>크리스마스<br /><em>선물 편지 받기</em></h1>
          <p className="hero-description">크리스마스 당일에 편지를 열어봐요</p>
        </div>

        <div className="hero-visual">
          <ChristmasTree
            ownerName="션팡"
            ornaments={SAMPLE_ORNAMENTS}
            theme="CLASSIC"
            showNameplate={false}
          />
        </div>

        <div className="hero-cta">
          <Link className="button button-large" to="/create">
            내 트리 만들기
            <span aria-hidden="true">→</span>
          </Link>
          <p className="hero-hint">편지가 오면 생선이 하나씩 나타나요</p>
        </div>
      </section>

      <section className="how-section" id="how-it-works" aria-label="이용 방법">
        <ol className="steps">
          <li>
            <span className="step-number">1</span>
            <span className="step-icon step-envelope" aria-hidden="true">✉</span>
            <h3>트리를 만들어요</h3>
          </li>
          <li>
            <span className="step-number">2</span>
            <span className="step-cat" aria-hidden="true"><span /></span>
            <h3>친구들이 편지를 달아요</h3>
          </li>
          <li>
            <span className="step-number">3</span>
            <span className="step-icon step-gift" aria-hidden="true">🎁</span>
            <h3>크리스마스에 열어요</h3>
          </li>
        </ol>
      </section>
    </>
  )
}

export default HomePage
