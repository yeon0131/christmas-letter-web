import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { treeApi } from '../api'
import titleEars from '../assets/title-cat-ears.png'
import ChristmasTree from '../components/ChristmasTree'
import Countdown from '../components/Countdown'
import Modal from '../components/Modal'
import { ErrorView, LoadingView } from '../components/StatusView'
import { ORNAMENTS } from '../ornaments'

function PublicTreePage() {
  const { slug } = useParams()
  const [tree, setTree] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [composerOpen, setComposerOpen] = useState(false)
  const [form, setForm] = useState({
    senderName: '',
    content: '',
    ornamentType: 'RED_BAUBLE',
  })
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const [notice, setNotice] = useState('')

  const loadTree = useCallback(async () => {
    setLoading(true)
    setLoadError('')
    try {
      setTree(await treeApi.getPublic(slug))
    } catch (error) {
      setLoadError(error.message)
    } finally {
      setLoading(false)
    }
  }, [slug])

  useEffect(() => {
    let cancelled = false

    treeApi.getPublic(slug)
      .then((data) => {
        if (!cancelled) setTree(data)
      })
      .catch((error) => {
        if (!cancelled) setLoadError(error.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [slug])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setFormError('')

    try {
      await treeApi.addLetter(slug, form)
      setComposerOpen(false)
      setForm({ senderName: '', content: '', ornamentType: 'RED_BAUBLE' })
      setNotice('편지가 트리에 포근하게 달렸어요!')
      await loadTree()
      window.setTimeout(() => setNotice(''), 3500)
    } catch (error) {
      setFormError(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <LoadingView />
  if (loadError) return <ErrorView message={loadError} onRetry={loadTree} />

  const senderNames = Object.fromEntries(
    tree.ornaments.map((ornament) => [ornament.id, ornament.senderName]),
  )

  return (
    <section className="nyan-public-page">
      {notice && <div className="toast" role="status">{notice}</div>}

      <section className="nyan-public-intro">
        <p className="nyan-public-kicker"><span aria-hidden="true">✦</span> 친구의 냥트리에 도착했어요! <span aria-hidden="true">✦</span></p>
        <h1><strong>{tree.ownerName}</strong>님의<br /><span className="nyan-public-title-tree"><img src={titleEars} alt="" aria-hidden="true" />냥트리</span></h1>
        <p className="nyan-public-subtitle"><span>크리스마스 선물 편지 보내기</span></p>
      </section>

      <section className="nyan-public-tree" aria-label={`${tree.ownerName}님의 냥트리`}>
        <ChristmasTree
          ownerName={tree.ownerName}
          ornaments={tree.ornaments}
          senderNames={senderNames}
          showSenderNames
          showEmptyMessage
          showNameplate={false}
        />
        <p className="nyan-letter-count"><span>지금까지 달린 물고기</span><strong>{tree.letterCount}</strong><span>마리</span></p>
      </section>

      {tree.locked ? (
        <Countdown revealAt={tree.revealAt} />
      ) : (
        <section className="nyan-unlocked-card">
          <span aria-hidden="true">✦</span>
          <h2>편지가 공개됐어요</h2>
          <p>새 선물 편지 접수는 마감됐어요.</p>
        </section>
      )}

      {tree.locked && (
        <section className="nyan-letter-invite">
          <span className="nyan-letter-doodle" aria-hidden="true">✉</span>
          <h2><strong>{tree.ownerName}</strong>님에게<br />익명 선물 편지를 남겨주세요</h2>
          <p>편지를 보내면 냥트리의 초록색 줄에<br />내가 고른 물고기가 하나 달려요.</p>
          <div className="nyan-public-cta-wrap">
            <span className="nyan-button-rays left" aria-hidden="true" />
            <button type="button" onClick={() => setComposerOpen(true)}>선물 편지 보내기 <span aria-hidden="true">›</span></button>
            <span className="nyan-button-rays right" aria-hidden="true" />
          </div>
        </section>
      )}

      <Link className="nyan-public-make" to="/">나도 냥트리 만들기 →</Link>

      {composerOpen && (
        <Modal
          title="크리스마스 선물 편지 보내기"
          eyebrow="A SECRET LETTER"
          onClose={() => setComposerOpen(false)}
          size="wide"
        >
          <form className="letter-form" onSubmit={handleSubmit}>
            <label className="field">
              <span>사용할 이름</span>
              <input
                value={form.senderName}
                onChange={(event) => setForm({ ...form, senderName: event.target.value })}
                maxLength={20}
                placeholder="트리 주인이 나를 부르는 이름"
                required
              />
              <small>이름은 바로 보이고, 편지 내용은 크리스마스까지 비밀이에요.</small>
            </label>

            <fieldset className="ornament-fieldset">
              <legend>편지 생선 고르기</legend>
              <div className="ornament-options">
                {ORNAMENTS.map((ornament) => (
                  <label
                    className={form.ornamentType === ornament.value ? 'selected' : ''}
                    key={ornament.value}
                    title={ornament.label}
                  >
                    <input
                      type="radio"
                      name="ornamentType"
                      value={ornament.value}
                      checked={form.ornamentType === ornament.value}
                      onChange={() => setForm({ ...form, ornamentType: ornament.value })}
                    />
                    <span className={`mini-ornament ornament-${ornament.value.toLowerCase()}`}>
                      <i />
                    </span>
                    <small>{ornament.label}</small>
                  </label>
                ))}
              </div>
            </fieldset>

            <label className="field">
              <span>편지 내용</span>
              <textarea
                value={form.content}
                onChange={(event) => setForm({ ...form, content: event.target.value })}
                maxLength={500}
                rows={7}
                placeholder="올해 함께한 기억이나 고마웠던 마음을 남겨주세요."
                required
              />
              <small className="field-count">{form.content.length}/500</small>
            </label>

            {formError && <p className="form-error" role="alert">{formError}</p>}
            <button className="button button-full" type="submit" disabled={submitting}>
              {submitting ? '편지를 보내는 중...' : '선물 편지 보내기'}
            </button>
          </form>
        </Modal>
      )}
    </section>
  )
}

export default PublicTreePage
