export function formatRevealDate(value) {
  return new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

export function getCountdown(value) {
  const difference = Math.max(0, new Date(value).getTime() - Date.now())
  const days = Math.floor(difference / 86400000)
  const hours = Math.floor((difference % 86400000) / 3600000)
  const minutes = Math.floor((difference % 3600000) / 60000)
  const seconds = Math.floor((difference % 60000) / 1000)

  return { difference, days, hours, minutes, seconds }
}
