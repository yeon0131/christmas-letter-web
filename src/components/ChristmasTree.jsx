import catTreeImage from '../assets/hero-cat.png'
import fishCandy from '../assets/fish-candy.png'
import fishChecker from '../assets/fish-checker.png'
import fishFlower from '../assets/fish-flower.png'
import fishHeart from '../assets/fish-heart.png'
import fishStar from '../assets/fish-star.png'
import fishStripe from '../assets/fish-stripe.png'

const FISH_IMAGES = {
  RED_BAUBLE: fishHeart,
  GOLD_STAR: fishStar,
  BLUE_BELL: fishStripe,
  GIFT_TAG: fishFlower,
  CANDY_CANE: fishCandy,
  GREEN_HEART: fishChecker,
}

const MAX_VISIBLE_FISH = 10

const FISH_SLOTS = [
  { x: 39, y: 51 },
  { x: 79, y: 41 },
  { x: 40, y: 81 },
  { x: 72, y: 72 },
  { x: 23, y: 69 },
  { x: 84, y: 62 },
  { x: 61, y: 48 },
  { x: 19, y: 50 },
  { x: 57, y: 84 },
  { x: 72, y: 34 },
]

function ChristmasTree({
  ornaments = [],
  ownerName,
  onSelect,
  interactive = false,
  senderNames = {},
  showSenderNames = false,
  showEmptyMessage = false,
  showNameplate = true,
}) {
  const firstVisibleIndex = Math.max(ornaments.length - MAX_VISIBLE_FISH, 0)
  const visibleOrnaments = ornaments.slice(firstVisibleIndex)
  const hiddenFishCount = ornaments.length - visibleOrnaments.length

  return (
    <section className="nyan-tree-art" aria-label={`${ownerName || ''}의 크리스마스 냥트리`}>
      <img className="nyan-tree-cat" src={catTreeImage} alt="초록빛 마법 궤도 속에 서 있는 산타 고양이" />

      <div className="nyan-fish-layer">
        {visibleOrnaments.map((ornament, visibleIndex) => {
          const index = firstVisibleIndex + visibleIndex
          const slot = FISH_SLOTS[index % FISH_SLOTS.length]
          const orbitLayer = Math.floor(index / FISH_SLOTS.length)
          const fishTilt = [-7, 6, 5, -5, 8][index % 5]
          const senderName = showSenderNames ? senderNames[ornament.id] : ''
          const style = {
            left: `${slot.x + ((orbitLayer % 3) - 1) * 1.5}%`,
            top: `${slot.y + (orbitLayer % 2 === 0 ? 0 : 2)}%`,
            '--fish-delay': `${Math.min(index * 0.08, 1.2)}s`,
            '--fish-tilt': `${fishTilt}deg`,
            '--fish-counter-tilt': `${-fishTilt}deg`,
          }
          const fish = (
            <>
              <img src={FISH_IMAGES[ornament.ornamentType] || fishHeart} alt="선물 편지가 담긴 물고기" />
              {senderName && (
                <span className="nyan-tree-fish-name" title={senderName}>{senderName}</span>
              )}
            </>
          )

          if (interactive) {
            return (
              <button
                type="button"
                className="nyan-tree-fish"
                style={style}
                key={ornament.id}
                onClick={() => onSelect?.(ornament)}
                aria-label={senderName ? `${senderName}의 편지 열기` : '편지 열기'}
              >
                {fish}
              </button>
            )
          }

          return (
            <span
              className="nyan-tree-fish"
              style={style}
              key={ornament.id}
              aria-label={senderName ? `${senderName}의 선물 편지` : undefined}
              aria-hidden={senderName ? undefined : true}
            >
              {fish}
            </span>
          )
        })}
      </div>

      {hiddenFishCount > 0 && (
        <span className="nyan-fish-overflow">+{hiddenFishCount}마리</span>
      )}

      {showEmptyMessage && ornaments.length === 0 && (
        <span className="nyan-empty-note">첫 선물 편지를 기다리는 중...</span>
      )}

      {showNameplate && (
        <span className="sr-only">{ownerName || '당신'}의 냥트리</span>
      )}
    </section>
  )
}

export default ChristmasTree
