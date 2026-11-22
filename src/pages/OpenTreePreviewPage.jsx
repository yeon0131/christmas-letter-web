import { useState } from 'react'
import titleEars from '../assets/title-cat-ears.png'
import ChristmasTree from '../components/ChristmasTree'
import Modal from '../components/Modal'

const PREVIEW_LETTERS = [
  {
    id: 1,
    ornamentType: 'RED_BAUBLE',
    senderName: '붕어빵',
    content: '올해도 네 덕분에 많이 웃었어!\n내년에도 맛있는 거 많이 먹고 재밌게 놀자.\n메리 크리스마스 🎄',
  },
  { id: 2, ornamentType: 'BLUE_BELL', senderName: '감자' },
  { id: 3, ornamentType: 'GOLD_STAR', senderName: '눈사람' },
  { id: 4, ornamentType: 'GIFT_TAG', senderName: '산타냥' },
  { id: 5, ornamentType: 'GREEN_HEART', senderName: '귤' },
]

function OpenTreePreviewPage() {
  const [selectedLetter, setSelectedLetter] = useState(null)
  const senderNames = Object.fromEntries(
    PREVIEW_LETTERS.map((letter) => [letter.id, letter.senderName]),
  )

  return (
    <section className="nyan-owner-page nyan-open-preview">
      <section className="nyan-owner-intro">
        <p className="nyan-owner-kicker"><span aria-hidden="true">✦</span> 기다리던 크리스마스예요! <span aria-hidden="true">✦</span></p>
        <h1><strong>션팡</strong>님의<br /><span className="nyan-owner-title-tree"><img src={titleEars} alt="" aria-hidden="true" />냥트리</span></h1>
        <p className="nyan-owner-subtitle">도착한 물고기를 눌러<br />친구들의 선물 편지를 열어봐요</p>
      </section>

      <section className="nyan-owner-tree" aria-label="션팡님의 열린 냥트리 미리보기">
        <ChristmasTree
          ownerName="션팡"
          ornaments={PREVIEW_LETTERS}
          interactive
          onSelect={setSelectedLetter}
          senderNames={senderNames}
          showSenderNames
          showNameplate={false}
        />
        <p className="nyan-letter-count"><span>열어볼 선물 편지</span><strong>{PREVIEW_LETTERS.length}</strong><span>개</span></p>
        <p className="nyan-open-hint">궁금한 물고기를 톡 눌러보세요!</p>
      </section>

      <section className="nyan-unlocked-card">
        <span className="nyan-unlocked-date" aria-hidden="true">12.25</span>
        <div>
          <h2>선물 편지가 열렸어요!</h2>
          <p>물고기를 누르면 편지 내용과 보낸 친구의 이름을 확인할 수 있어요.</p>
        </div>
      </section>

      {selectedLetter && (
        <Modal
          title={`${selectedLetter.senderName}이 보낸 선물 편지`}
          eyebrow="MERRY MAIL · 12.25"
          onClose={() => setSelectedLetter(null)}
          size="wide"
        >
          <article className="opened-letter">
            <div className="letter-opened-stamp" aria-hidden="true">OPEN!</div>
            <div className="letter-paper">
              <p>{selectedLetter.content || '메리 크리스마스! 따뜻한 연말 보내고 내년에도 행복한 일만 가득하길 바라.'}</p>
              <div className="letter-signature">
                From. <strong>{selectedLetter.senderName}</strong>
              </div>
            </div>
          </article>
        </Modal>
      )}
    </section>
  )
}

export default OpenTreePreviewPage
