import treeImage from '../assets/vintage-tree.png'

function ChristmasTree({
  ornaments = [],
  theme = 'CLASSIC',
  ownerName,
  onSelect,
  interactive = false,
  showEmptyMessage = false,
}) {
  return (
    <section className={`tree-stage theme-${theme.toLowerCase()}`} aria-label={`${ownerName || ''}의 크리스마스 트리`}>
      <div className="tree-glow" aria-hidden="true" />
      <img className="tree-image" src={treeImage} alt="리본과 금빛 장식으로 꾸민 크리스마스 트리" />

      <div className="ornament-layer">
        {ornaments.map((ornament, index) => {
          const style = {
            left: `${ornament.positionX}%`,
            top: `${ornament.positionY}%`,
            '--ornament-delay': `${Math.min(index * 0.08, 1.2)}s`,
          }
          const className = `ornament ornament-${ornament.ornamentType.toLowerCase()}`

          if (interactive) {
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

          return <span className={className} style={style} key={ornament.id} aria-hidden="true"><span /></span>
        })}
      </div>

      {showEmptyMessage && ornaments.length === 0 && (
        <div className="empty-tree-note">
          첫 번째 마음을<br />기다리고 있어요
        </div>
      )}

      <div className="tree-nameplate">
        <small>DEAR</small>
        <strong>{ownerName || '당신'}의 트리</strong>
      </div>
    </section>
  )
}

export default ChristmasTree
