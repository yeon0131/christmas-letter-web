import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { treeApi } from '../api'
import guideCat from '../assets/guide-cat.png'
import guideEnvelope from '../assets/guide-envelope.png'
import guideGift from '../assets/guide-gift.png'
import guideLink from '../assets/guide-link.png'
import heroCat from '../assets/hero-cat.png'
import fishHeart from '../assets/hero-fish-heart.png'
import fishStar from '../assets/hero-fish-star.png'
import fishStripe from '../assets/hero-fish-stripe.png'
import titleEars from '../assets/title-cat-ears.png'
import { saveTreeAccess } from '../storage'

const GUIDE_STEPS = [
  { image: guideEnvelope, label: '트리를 만들어요' },
  { image: guideLink, label: <>친구들에게 공개 링크를<br />공유해요</> },
  { image: guideCat, label: '친구들이 편지를 달아요' },
  { image: guideGift, label: <>크리스마스에 편지를<br />열어봐요</> },
]

function HomePage() {
  const navigate = useNavigate()
  const [ownerName, setOwnerName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      // 운영 백엔드가 이전 버전일 때도 트리 생성이 되도록 기본 물고기를 함께 보낸다.
      // 화면에서는 트리 생성 시 물고기를 선택하지 않고, 편지를 쓸 때만 고른다.
      const created = await treeApi.create({
        ownerName: ownerName.trim(),
        theme: 'CLASSIC',
        favoriteFish: 'RED_BAUBLE',
      })
      saveTreeAccess({
        slug: created.slug,
        adminKey: created.adminKey,
        ownerName: ownerName.trim(),
      })
      navigate(`/my-tree/${created.slug}`, { replace: true })
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="nyan-home-page">
      <section className="nyan-hero">
        <h1>
          <img className="nyan-title-ears-image" src={titleEars} alt="" aria-hidden="true" />
          냥트리 만들기
        </h1>
        <p className="nyan-subtitle">
          <span>냥트리에 도착한 편지는<br />크리스마스 당일에 선물 편지로 받아봐요</span>
        </p>
        <div className="nyan-hero-art" aria-label="산타모자를 쓴 고양이 주위를 물고기 편지가 도는 그림">
          <img className="nyan-hero-cat" src={heroCat} alt="산타모자를 쓴 냥트리 고양이" />
          <img className="nyan-fish nyan-fish-left" src={fishStripe} alt="" />
          <img className="nyan-fish nyan-fish-right" src={fishStar} alt="" />
          <img className="nyan-fish nyan-fish-bottom" src={fishHeart} alt="" />
        </div>
      </section>

      <section className="nyan-guide" id="how-it-works" aria-label="냥트리 이용안내">
        <div className="nyan-guide-title">
          <span aria-hidden="true">✦</span>
          <h2>냥트리 이용안내</h2>
          <span aria-hidden="true">✦</span>
        </div>
        <ol className="nyan-steps">
          {GUIDE_STEPS.map((step, index) => (
            <li key={index}>
              <span className="nyan-step-number">{index + 1}</span>
              <img src={step.image} alt="" />
              <b>{step.label}</b>
            </li>
          ))}
        </ol>
      </section>

      <form className="nyan-create" onSubmit={handleSubmit}>
        <label htmlFor="owner-name"><span aria-hidden="true">✦</span>트리 주인 이름</label>
        <input
          id="owner-name"
          value={ownerName}
          onChange={(event) => setOwnerName(event.target.value)}
          type="text"
          placeholder="친구들이 알아볼 이름"
          maxLength="30"
          required
        />
        <div className="nyan-button-wrap">
          <span className="nyan-button-rays left" aria-hidden="true" />
          <button type="submit" disabled={submitting}>
            {submitting ? '냥트리 만드는 중...' : '내 냥트리 만들기'} <span aria-hidden="true">›</span>
          </button>
          <span className="nyan-button-rays right" aria-hidden="true" />
        </div>
        {error && <p className="nyan-name-error" role="alert">{error}</p>}
      </form>
    </div>
  )
}

export default HomePage
