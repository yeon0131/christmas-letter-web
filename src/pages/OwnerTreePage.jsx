import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { treeApi } from '../api'
import ChristmasTree from '../components/ChristmasTree'
import Countdown from '../components/Countdown'
import Modal from '../components/Modal'
import { ErrorView, LoadingView } from '../components/StatusView'
import { THEME_LABELS } from '../ornaments'
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
  const [guess, setGuess] = useState('')
  const [guessResult, setGuessResult] = useState(null)
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
      setGuess('')
      setGuessResult(null)
    }
  }

  const handleGuess = async (event) => {
    event.preventDefault()
    setWorking(true)
    setGuessResult(null)
    try {
      const result = await treeApi.guessSender(slug, selectedLetter.id, adminKey, guess)
      setGuessResult(result)
      if (result.correct) {
        setSelectedLetter((current) => ({
          ...current,
          identityRevealed: true,
          senderName: result.senderName,
        }))
        await loadTree()
      }
    } catch (error) {
      setGuessResult({ correct: false, message: error.message })
    } finally {
      setWorking(false)
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
      setGuessResult({ correct: false, message: error.message })
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
    <section className="owner-page">
      {copyNotice && <div className="toast" role="status">{copyNotice}</div>}

      <div className="owner-topbar">
        <div>
          <p className="eyebrow">{THEME_LABELS[tree.theme]} · OWNER</p>
          <h1>{tree.ownerName}님의 선물 편지 냥트리</h1>
        </div>
        <div className="owner-actions">
          <button className="button button-secondary" type="button" onClick={() => copyText(manageUrl, '관리 링크를 복사했어요.')}>
            관리 링크 보관
          </button>
          <button className="button" type="button" onClick={() => copyText(shareUrl, '친구에게 보낼 링크를 복사했어요!')}>
            친구 초대 링크 복사
          </button>
        </div>
      </div>

      <div className="owner-grid">
        <div className="owner-tree-column">
          <ChristmasTree
            ownerName={tree.ownerName}
            ornaments={tree.ornaments}
            theme={tree.theme}
            favoriteFish={tree.favoriteFish}
            interactive={!tree.locked}
            onSelect={openLetter}
            showEmptyMessage
          />
        </div>

        <aside className="owner-panel">
          <div className="letter-count-card">
            <span>지금까지 도착한 마음</span>
            <strong>{tree.letterCount}</strong>
            <small>LETTERS</small>
          </div>

          {tree.locked ? (
            <>
              <div className="locked-card">
                <span className="lock-icon" aria-hidden="true">✉</span>
                <h2>크리스마스 당일에 편지를 열어봐요</h2>
                <p>생선은 볼 수 있지만 편지 내용과 작성자 이름은 크리스마스까지 비밀이에요.</p>
              </div>
              <Countdown revealAt={tree.revealAt} />
            </>
          ) : (
            <div className="unlocked-card">
              <span aria-hidden="true">✦</span>
              <h2>편지가 열렸어요!</h2>
              <p>트리의 오너먼트를 눌러 편지를 읽고 누가 썼는지 맞혀보세요.</p>
            </div>
          )}

          <div className="share-card">
            <span>친구에게 보내는 주소</span>
            <code>{shareUrl}</code>
            <button type="button" onClick={() => copyText(shareUrl, '공개 링크를 복사했어요!')}>주소 복사</button>
          </div>

          <p className="admin-warning">
            관리 링크에는 비밀 키가 들어 있어요. 친구에게는 공개 링크만 보내주세요.
          </p>
        </aside>
      </div>

      {selectedLetter && (
        <Modal
          title="크리스마스에 도착한 편지"
          eyebrow="MERRY MAIL"
          onClose={() => setSelectedLetter(null)}
          size="wide"
        >
          <article className="opened-letter">
            <div className="letter-paper">
              <p>{selectedLetter.content}</p>
              <div className="letter-signature">
                {selectedLetter.identityRevealed
                  ? <>From. <strong>{selectedLetter.senderName}</strong></>
                  : <>From. <strong>아직 비밀</strong></>}
              </div>
            </div>

            {!selectedLetter.identityRevealed && (
              <form className="guess-form" onSubmit={handleGuess}>
                <label className="field">
                  <span>누가 썼을까요?</span>
                  <input
                    value={guess}
                    onChange={(event) => setGuess(event.target.value)}
                    maxLength={20}
                    placeholder="생각나는 이름"
                    required
                  />
                </label>
                <button className="button" type="submit" disabled={working}>정답 확인</button>
              </form>
            )}

            {guessResult && (
              <p className={`guess-result ${guessResult.correct ? 'correct' : 'wrong'}`} role="status">
                {guessResult.message}
              </p>
            )}

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
