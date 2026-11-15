import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { treeApi } from '../api'
import { saveTreeAccess } from '../storage'

const THEMES = [
  { value: 'CLASSIC', name: '클래식 레드', description: '리본과 체리 레드' },
  { value: 'SNOWY', name: '스노우 크림', description: '눈과 따뜻한 크림색' },
  { value: 'MIDNIGHT', name: '미드나잇 블루', description: '밤하늘과 금빛 별' },
]

function CreateTreePage() {
  const navigate = useNavigate()
  const [ownerName, setOwnerName] = useState('')
  const [theme, setTheme] = useState('CLASSIC')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      const created = await treeApi.create({ ownerName, theme })
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
        <p className="eyebrow">MAKE YOUR TREE</p>
        <h1>누구의 마음을<br />기다릴까요?</h1>
        <p>트리를 만든 뒤 공개 링크를 친구들에게 보내면 준비 끝이에요.</p>
        <div className="wax-seal" aria-hidden="true">25</div>
      </div>

      <form className="paper-form" onSubmit={handleSubmit}>
        <div className="form-header">
          <span>CHRISTMAS TREE ORDER</span>
          <span>2026</span>
        </div>

        <label className="field">
          <span>트리 주인 이름</span>
          <input
            value={ownerName}
            onChange={(event) => setOwnerName(event.target.value)}
            maxLength={30}
            placeholder="친구들이 알아볼 이름"
            required
            autoFocus
          />
          <small>{ownerName.length}/30</small>
        </label>

        <fieldset className="theme-fieldset">
          <legend>트리 분위기</legend>
          <div className="theme-options">
            {THEMES.map((item) => (
              <label className={`theme-option ${theme === item.value ? 'selected' : ''}`} key={item.value}>
                <input
                  type="radio"
                  name="theme"
                  value={item.value}
                  checked={theme === item.value}
                  onChange={() => setTheme(item.value)}
                />
                <span className={`theme-swatch swatch-${item.value.toLowerCase()}`} aria-hidden="true" />
                <strong>{item.name}</strong>
                <small>{item.description}</small>
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
