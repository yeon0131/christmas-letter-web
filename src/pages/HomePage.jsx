import { Link } from 'react-router-dom'
import ChristmasTree from '../components/ChristmasTree'
import { SAMPLE_ORNAMENTS } from '../ornaments'

function HomePage() {
  return (
    <>
      <section className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">A LITTLE CHRISTMAS MYSTERY</p>
          <h1>
            마음은 먼저 달고,
            <br />
            이름은 나중에 맞혀봐요.
          </h1>
          <p className="hero-description">
            친구들이 남긴 익명 편지가 오너먼트가 되어 트리에 달려요.
            크리스마스가 되면 편지를 읽고 누가 썼는지 맞혀보세요.
          </p>

          <div className="button-row hero-actions">
            <Link className="button button-large" to="/create">
              내 트리 만들기
              <span aria-hidden="true">→</span>
            </Link>
            <a className="text-link text-link-large" href="#how-it-works">
              어떻게 쓰나요?
            </a>
          </div>

          <div className="postcard-note">
            <span className="postmark" aria-hidden="true">DEC<br />25</span>
            <p>
              편지 내용은 크리스마스 전까지
              <br />
              트리 주인에게도 보이지 않아요.
            </p>
          </div>
        </div>

        <div className="hero-visual">
          <div className="ribbon-label">Merry &amp; Mysterious</div>
          <ChristmasTree ownerName="션팡" ornaments={SAMPLE_ORNAMENTS} theme="CLASSIC" />
          <div className="floating-stamp stamp-left" aria-hidden="true">SECRET</div>
          <div className="floating-stamp stamp-right" aria-hidden="true">5 LETTERS</div>
        </div>
      </section>

      <section className="how-section" id="how-it-works">
        <div className="section-heading">
          <p className="eyebrow">HOW IT WORKS</p>
          <h2>세 번이면 준비 끝</h2>
        </div>
        <ol className="steps">
          <li>
            <span>01</span>
            <h3>트리를 만들어요</h3>
            <p>이름과 좋아하는 색을 골라 나만의 트리를 만들어요.</p>
          </li>
          <li>
            <span>02</span>
            <h3>링크를 나눠요</h3>
            <p>공개 링크를 친구에게 보내 익명 편지를 받아요.</p>
          </li>
          <li>
            <span>03</span>
            <h3>크리스마스에 열어요</h3>
            <p>편지 내용을 힌트 삼아 누가 썼는지 맞혀봐요.</p>
          </li>
        </ol>
      </section>

      <section className="closing-banner">
        <span aria-hidden="true">✦</span>
        <div>
          <p>올해가 끝나기 전에</p>
          <h2>고마웠던 마음을 한 그루 모아보세요.</h2>
        </div>
        <Link className="button button-cream" to="/create">트리 만들기</Link>
      </section>
    </>
  )
}

export default HomePage
