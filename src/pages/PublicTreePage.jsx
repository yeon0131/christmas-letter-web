import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { treeApi } from '../api'
import ChristmasTree from '../components/ChristmasTree'
import Countdown from '../components/Countdown'
import Modal from '../components/Modal'
import { ErrorView, LoadingView } from '../components/StatusView'
import { ORNAMENTS, THEME_LABELS } from '../ornaments'

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

  return (
    <section className="tree-page">
      {notice && <div className="toast" role="status">{notice}</div>}

      <div className="tree-page-copy">
        <p className="eyebrow">{THEME_LABELS[tree.theme]} TREE</p>
        <h1>크리스마스 선물<br />편지 보내기</h1>
        <p>
          {tree.ownerName}님이 크리스마스에 열어볼 익명 편지를 남겨주세요.
          편지가 도착하면 냥트리에 생선이 하나씩 나타나요.
        </p>

        {tree.locked ? (
          <Countdown revealAt={tree.revealAt} />
        ) : (
          <div className="open-notice">
            <span aria-hidden="true">✦</span>
            <p>편지가 공개되어 새 편지 접수가 마감됐어요.</p>
          </div>
        )}

        <div className="letter-counter">
          <strong>{tree.letterCount}</strong>
          <span>개의 마음이<br />트리에 달렸어요</span>
        </div>

        {tree.locked && (
          <button className="button button-large" type="button" onClick={() => setComposerOpen(true)}>
            선물 편지 보내기
            <span aria-hidden="true">✉</span>
          </button>
        )}

        <Link className="text-link back-link" to="/">나도 트리 만들기 →</Link>
      </div>

      <div className="tree-page-visual">
        <ChristmasTree
          ownerName={tree.ownerName}
          ornaments={tree.ornaments}
          theme={tree.theme}
          showEmptyMessage
        />
      </div>

      {composerOpen && (
        <Modal
          title="크리스마스 선물 편지 보내기"
          eyebrow="A SECRET LETTER"
          onClose={() => setComposerOpen(false)}
          size="wide"
        >
          <form className="letter-form" onSubmit={handleSubmit}>
            <label className="field">
              <span>정답으로 사용할 이름</span>
              <input
                value={form.senderName}
                onChange={(event) => setForm({ ...form, senderName: event.target.value })}
                maxLength={20}
                placeholder="트리 주인이 나를 부르는 이름"
                required
              />
              <small>크리스마스까지 트리 주인에게 보이지 않아요.</small>
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
