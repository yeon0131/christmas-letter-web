import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { treeApi } from '../api'
import { ORNAMENTS } from '../ornaments'
import { saveTreeAccess } from '../storage'

function CreateTreePage() {
  const navigate = useNavigate()
  const [ownerName, setOwnerName] = useState('')
  const [favoriteFish, setFavoriteFish] = useState('RED_BAUBLE')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      const created = await treeApi.create({ ownerName, theme: 'CLASSIC', favoriteFish })
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
    <section className="form-page">
      <div className="form-intro">
        <p className="eyebrow">CHRISTMAS LETTER TREE</p>
        <h1>선물 편지를 받을<br />냥트리를 만들어요</h1>
        <p>냥트리를 만든 뒤 공개 링크를 친구들에게 보내면 준비 끝이에요.</p>
        <div className="wax-seal" aria-hidden="true">25</div>
      </div>

      <form className="paper-form" onSubmit={handleSubmit}>
        <div className="form-header">
          <span>CHRISTMAS CAT TREE</span>
          <span>2026</span>
        </div>

        <label className="field">
          <span>트리 주인 이름</span>
          <input
            className="owner-name-input"
            value={ownerName}
            onChange={(event) => setOwnerName(event.target.value)}
            maxLength={30}
            placeholder="친구들이 알아볼 이름"
            required
            autoFocus
          />
          <small>{ownerName.length}/30</small>
        </label>

        <fieldset className="fish-fieldset">
          <legend>첫 번째 물고기를 골라주세요</legend>
          <div className="fish-choice-grid">
            {ORNAMENTS.map((fish) => (
              <label className={`fish-choice ${favoriteFish === fish.value ? 'selected' : ''}`} key={fish.value}>
                <input
                  type="radio"
                  name="favoriteFish"
                  value={fish.value}
                  checked={favoriteFish === fish.value}
                  onChange={() => setFavoriteFish(fish.value)}
                />
                <span className={`mini-ornament ornament-${fish.value.toLowerCase()}`} aria-hidden="true" />
                <strong>{fish.label}</strong>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="form-notice">
          <span aria-hidden="true">✦</span>
          <p>회원가입 없이 관리할 수 있는 비밀 관리 키가 발급돼요.</p>
        </div>

        {error && <p className="form-error" role="alert">{error}</p>}

        <button className="button button-full button-large" type="submit" disabled={submitting}>
          {submitting ? '트리를 심는 중...' : '내 트리 만들기'}
        </button>
      </form>
    </section>
  )
}

export default CreateTreePage
