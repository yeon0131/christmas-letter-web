import catTreeImage from '../assets/cat-magic-tree.png'

const FISH_SLOTS = [
  { x: 18, y: 42 },
  { x: 78, y: 40 },
  { x: 24, y: 72 },
  { x: 76, y: 70 },
  { x: 30, y: 27 },
  { x: 70, y: 25 },
  { x: 13, y: 58 },
  { x: 87, y: 57 },
  { x: 42, y: 85 },
  { x: 60, y: 84 },
]

function ChristmasTree({
  ornaments = [],
  theme = 'CLASSIC',
  ownerName,
  onSelect,
  interactive = false,
  showEmptyMessage = false,
  showNameplate = true,
  favoriteFish,
}) {
  const displayedOrnaments = favoriteFish
    ? [{ id: 'favorite-fish', ornamentType: favoriteFish, decorative: true }, ...ornaments]
    : ornaments

  return (
    <section className={`tree-stage cat-tree-stage theme-${theme.toLowerCase()}`} aria-label={`${ownerName || ''}의 크리스마스 냥트리`}>
      <div className="tree-glow" aria-hidden="true" />
      <img className="tree-image cat-tree-image" src={catTreeImage} alt="초록빛 마법 궤도 속에 서 있는 산타 고양이" />

      <div className="ornament-layer">
        {displayedOrnaments.map((ornament, index) => {
          const slot = FISH_SLOTS[index % FISH_SLOTS.length]
          const orbitLayer = Math.floor(index / FISH_SLOTS.length)
          const style = {
            left: `${slot.x + ((orbitLayer % 3) - 1) * 2}%`,
            top: `${slot.y + (orbitLayer % 2 === 0 ? -1 : 2)}%`,
            '--ornament-delay': `${Math.min(index * 0.08, 1.2)}s`,
            '--fish-tilt': `${[-8, 6, -3, 9, -5][index % 5]}deg`,
          }
          const className = `ornament ornament-${ornament.ornamentType.toLowerCase()}`

          if (interactive && !ornament.decorative) {
            return (
              <button
                type="button"
                className={className}
                style={style}
                key={ornament.id}
                onClick={() => onSelect?.(ornament)}
                aria-label="편지 열기"
              >
                <span aria-hidden="true" />
              </button>
            )
          }

          return (
            <span
              className={`${className}${ornament.decorative ? ' favorite-fish' : ''}`}
              style={style}
              key={ornament.id}
              aria-hidden="true"
            >
              <span />
            </span>
          )
        })}
      </div>

      {showEmptyMessage && ornaments.length === 0 && (
        <div className="empty-tree-note">
          첫 번째 선물 편지를<br />기다리고 있어요
        </div>
      )}

      {showNameplate && (
        <div className="tree-nameplate">
          <small>CHRISTMAS MAIL</small>
          <strong>{ownerName || '당신'}의 냥트리</strong>
        </div>
      )}
    </section>
  )
}

export default ChristmasTree
