import { useEffect, useState } from 'react'
import { formatRevealDate, getCountdown } from '../utils/date'

function Countdown({ revealAt }) {
  const [countdown, setCountdown] = useState(() => getCountdown(revealAt))

  useEffect(() => {
    const timer = window.setInterval(() => setCountdown(getCountdown(revealAt)), 1000)
    return () => window.clearInterval(timer)
  }, [revealAt])

  if (countdown.difference === 0) {
    return <p className="countdown-open">편지를 열 수 있어요!</p>
  }

  return (
    <div className="countdown-wrap" aria-label={`편지 공개까지 ${countdown.days}일 ${countdown.hours}시간`}>
      <div className="countdown">
        <span><strong>{countdown.days}</strong><small>일</small></span>
        <i>:</i>
        <span><strong>{String(countdown.hours).padStart(2, '0')}</strong><small>시간</small></span>
        <i>:</i>
        <span><strong>{String(countdown.minutes).padStart(2, '0')}</strong><small>분</small></span>
        <i>:</i>
        <span><strong>{String(countdown.seconds).padStart(2, '0')}</strong><small>초</small></span>
      </div>
      <p>{formatRevealDate(revealAt)}에 열려요</p>
    </div>
  )
}

export default Countdown
