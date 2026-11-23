import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { treeApi } from '../api'
import titleEars from '../assets/title-cat-ears.png'
import ChristmasTree from '../components/ChristmasTree'
import Countdown from '../components/Countdown'
import Modal from '../components/Modal'
import { ErrorView, LoadingView } from '../components/StatusView'
import { getTreeAccess, saveTreeAccess } from '../storage'

function getInitialAccess(slug) {
  const hashKey = new URLSearchParams(window.location.hash.slice(1)).get('key')
  const saved = getTreeAccess(slug)

  if (hashKey) {
    const access = { slug, adminKey: hashKey, ownerName: saved?.ownerName || '' }
    saveTreeAccess(access)
    window.history.replaceState(null, '', window.location.pathname)
    return access
  }

  return saved
}

function OwnerTreePage() {
  const { slug } = useParams()
  const [access, setAccess] = useState(() => getInitialAccess(slug))
  const [manualKey, setManualKey] = useState('')
  const [tree, setTree] = useState(null)
  const [loading, setLoading] = useState(Boolean(access))
  const [loadError, setLoadError] = useState('')
  const [selectedLetter, setSelectedLetter] = useState(null)
  const [letterError, setLetterError] = useState('')
  const [working, setWorking] = useState(false)
  const [copyNotice, setCopyNotice] = useState('')

  const adminKey = access?.adminKey

  const loadTree = useCallback(async () => {
    if (!adminKey) return
    setLoading(true)
    setLoadError('')
    try {
      setTree(await treeApi.getOwner(slug, adminKey))
    } catch (error) {
      setLoadError(error.message)
    } finally {
      setLoading(false)
    }
  }, [adminKey, slug])

  useEffect(() => {
    if (!adminKey) return undefined

    let cancelled = false

    treeApi.getOwner(slug, adminKey)
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
  }, [adminKey, slug])

  const shareUrl = useMemo(
    () => `${window.location.origin}/tree/${slug}`,
    [slug],
  )

  const manageUrl = useMemo(
    () => adminKey
      ? `${window.location.origin}/my-tree/${slug}#key=${encodeURIComponent(adminKey)}`
      : '',
    [adminKey, slug],
  )

  const senderNames = Object.fromEntries(
    (tree?.letters || []).map((letter) => [letter.id, letter.senderName]),
  )

  const copyText = async (value, message) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopyNotice(message)
      window.setTimeout(() => setCopyNotice(''), 2500)
    } catch {
      setCopyNotice('복사하지 못했어요. 주소를 직접 선택해 주세요.')
    }
  }

  const handleKeySubmit = (event) => {
    event.preventDefault()
    const nextAccess = { slug, adminKey: manualKey.trim(), ownerName: '' }
    saveTreeAccess(nextAccess)
    setAccess(nextAccess)
  }

  const openLetter = (ornament) => {
    const letter = tree.letters.find((item) => item.id === ornament.id)
    if (letter) {
      setSelectedLetter(letter)
      setLetterError('')
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('이 편지를 트리에서 삭제할까요? 삭제하면 되돌릴 수 없어요.')) return

    setWorking(true)
    try {
      await treeApi.deleteLetter(slug, selectedLetter.id, adminKey)
      setSelectedLetter(null)
      await loadTree()
    } catch (error) {
      setLetterError(error.message)
    } finally {
      setWorking(false)
    }
  }

  if (!access) {
    return (
      <section className="access-page">
        <div className="access-card">
          <p className="eyebrow">OWNER ACCESS</p>
          <h1>트리 관리 키를<br />입력해 주세요.</h1>
          <p>트리를 만들 때 받은 관리 링크 또는 관리 키가 필요해요.</p>
          <form onSubmit={handleKeySubmit}>
            <label className="field">
              <span>비밀 관리 키</span>
              <input
                value={manualKey}
                onChange={(event) => setManualKey(event.target.value)}
                placeholder="관리 키 붙여넣기"
                required
              />
            </label>
            <button className="button button-full" type="submit">내 트리 열기</button>
          </form>
        </div>
      </section>
    )
  }

  if (loading) return <LoadingView message="비밀 관리 키를 확인하는 중이에요..." />
  if (loadError) {
    return (
      <div>
        <ErrorView message={loadError} onRetry={loadTree} />
        <div className="center-action">
          <button className="text-link" type="button" onClick={() => setAccess(null)}>
            다른 관리 키 입력하기
          </button>
        </div>
      </div>
    )
  }

  return (
    <section className="nyan-owner-page">
      {copyNotice && <div className="toast" role="status">{copyNotice}</div>}

      <section className="nyan-owner-intro">
        <p className="nyan-owner-kicker"><span aria-hidden="true">✦</span> 냥트리가 완성됐어요! <span aria-hidden="true">✦</span></p>
        <h1><strong>{tree.ownerName}</strong>님의<br /><span className="nyan-owner-title-tree"><img src={titleEars} alt="" aria-hidden="true" />냥트리</span></h1>
        <p className="nyan-owner-subtitle">공개 링크를 친구들에게 보내고<br />크리스마스 선물 편지를 기다려요</p>
      </section>

      <section className="nyan-owner-tree" aria-label={`${tree.ownerName}님의 냥트리`}>
        <ChristmasTree
          ownerName={tree.ownerName}
          ornaments={tree.ornaments}
          interactive={!tree.locked}
          onSelect={openLetter}
          senderNames={senderNames}
          showSenderNames
          showEmptyMessage
          showNameplate={false}
        />
        <p className="nyan-letter-count"><span>도착한 선물 편지</span><strong>{tree.letterCount}</strong><span>개</span></p>
        {!tree.locked && <p className="nyan-open-hint">물고기를 눌러 편지를 읽어봐요!</p>}
      </section>

      {tree.locked && tree.letters.length > 0 && (
        <section className="nyan-sender-list" aria-label="편지를 보낸 친구들">
          <h2>편지를 보낸 친구들</h2>
          <p>이름은 먼저 보여요. 편지 내용은 크리스마스에 열려요.</p>
          <ul>
            {tree.letters.map((letter) => (
              <li key={letter.id}>From. {letter.senderName}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="nyan-share-box" aria-label="공개 링크 공유">
        <div className="nyan-share-heading">
          <span className="nyan-public-icon" aria-hidden="true">
            <svg viewBox="0 0 34 34">
              <path className="nyan-public-outline" d="M17.2 3.2C24.8 3 30.6 8.9 30.8 16.8c.2 7.7-5.8 13.9-13.6 14C9.4 31 3.2 24.9 3.3 17.1 3.4 9.3 9.4 3.4 17.2 3.2Z" />
              <path d="M4.4 16.8c6 .6 19.6.5 25.3-.1M17 3.9c-4.2 4.1-6 8.8-5.9 13.2.1 4.7 2 9.5 6.1 13M17.3 3.9c4 3.9 5.8 8.7 5.7 13.1-.1 4.7-2 9.5-5.8 13.1" />
            </svg>
          </span>
          <div><h2>친구에게 보낼 공개 링크</h2><p>이 링크로 들어온 친구들이 편지를 달 수 있어요.</p></div>
        </div>
        <div className="nyan-link-paper"><span>{shareUrl}</span></div>
        <div className="nyan-share-button-wrap">
          <span className="nyan-button-rays left" aria-hidden="true" />
          <button type="button" onClick={() => copyText(shareUrl, '공개 링크를 복사했어요! 친구에게 보내주세요.')}>공개 링크 복사하기</button>
          <span className="nyan-button-rays right" aria-hidden="true" />
        </div>
      </section>

      <section className="nyan-manage-box" aria-label="관리 링크 안내">
        <span className="nyan-manage-lock" aria-hidden="true">
          <svg viewBox="0 0 38 42">
            <path className="nyan-lock-shackle" d="M10.5 18.8v-5.1C10.5 7.4 14 4 19 4s8.5 3.5 8.5 9.7v5.1" />
            <path className="nyan-lock-body" d="M7.2 18.2c5.8-.7 17.9-.6 23.6.2.8 5 .5 13.7-.4 18.3-5.4 1-17.7 1-23.1-.2-.8-5.2-.9-13.2-.1-18.3Z" />
            <path className="nyan-lock-detail" d="M19 24.8c-1.7 0-2.8 1.2-2.8 2.6 0 1 .5 1.8 1.4 2.3l-.5 3.1h3.8l-.5-3.1c.9-.5 1.4-1.3 1.4-2.3 0-1.4-1.1-2.6-2.8-2.6Z" />
          </svg>
        </span>
        <div><h2>관리 링크는 나만 보관해요</h2><p>로그인 없이 이 링크로 내 냥트리를 다시 열 수 있어요.<br />친구에게는 위의 공개 링크만 보내주세요.</p></div>
        <button type="button" onClick={() => copyText(manageUrl, '관리 링크를 복사했어요. 나만 보관해요!')}>관리 링크 복사하기</button>
      </section>

      {tree.locked ? (
        <Countdown revealAt={tree.revealAt} />
      ) : (
        <section className="nyan-unlocked-card">
          <span className="nyan-unlocked-date" aria-hidden="true">12.25</span>
          <div>
            <h2>선물 편지가 열렸어요!</h2>
            <p>냥트리의 물고기를 눌러 친구들의 편지를 읽어보세요.</p>
          </div>
        </section>
      )}

      <Link className="nyan-back-home" to="/">← 새 냥트리 만들기</Link>

      {selectedLetter && (
        <Modal
          title="크리스마스에 도착한 편지"
          eyebrow="MERRY MAIL"
          onClose={() => setSelectedLetter(null)}
          size="wide"
        >
          <article className="opened-letter">
            <div className="letter-opened-stamp" aria-hidden="true">OPEN!</div>
            <div className="letter-paper">
              <p>{selectedLetter.content}</p>
              <div className="letter-signature">
                From. <strong>{selectedLetter.senderName}</strong>
              </div>
            </div>

            {letterError && <p className="guess-result wrong" role="alert">{letterError}</p>}

            <button className="danger-link" type="button" onClick={handleDelete} disabled={working}>
              이 편지 삭제하기
            </button>
          </article>
        </Modal>
      )}
    </section>
  )
}

export default OwnerTreePage
