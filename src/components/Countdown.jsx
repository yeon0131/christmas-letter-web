import { useEffect, useState } from 'react'
import guideGift from '../assets/guide-gift.png'
import { getCountdown } from '../utils/date'

function Countdown({ revealAt }) {
  const [countdown, setCountdown] = useState(() => getCountdown(revealAt))

  useEffect(() => {
    const timer = window.setInterval(() => setCountdown(getCountdown(revealAt)), 1000)
    return () => window.clearInterval(timer)
  }, [revealAt])

  if (countdown.difference === 0) {
    return <p className="countdown-open">편지가 열렸어요! 물고기를 눌러 확인해 봐요.</p>
  }

  return (
    <section className="nyan-countdown" aria-label={`크리스마스 편지 공개까지 ${countdown.days}일 ${countdown.hours}시간 ${countdown.minutes}분 ${countdown.seconds}초 남음`}>
      <div className="nyan-countdown-heading">
        <img src={guideGift} alt="" aria-hidden="true" />
        <div><small>편지가 열리기까지</small><b>12월 25일 00시 공개</b></div>
      </div>
      <div className="nyan-countdown-time" aria-hidden="true">
        <span><strong>{countdown.days}</strong><small>일</small></span>
        <i>:</i>
        <span><strong>{String(countdown.hours).padStart(2, '0')}</strong><small>시간</small></span>
        <i>:</i>
        <span><strong>{String(countdown.minutes).padStart(2, '0')}</strong><small>분</small></span>
        <i>:</i>
        <span><strong>{String(countdown.seconds).padStart(2, '0')}</strong><small>초</small></span>
      </div>
      <p>시간이 0이 되면 도착한 물고기를 눌러 편지를 읽을 수 있어요!</p>
    </section>
  )
}

export default Countdown
