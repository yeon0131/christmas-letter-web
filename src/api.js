const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080').replace(/\/$/, '')
const REQUEST_TIMEOUT_MS = 120000
const WARM_UP_VALID_MS = 10 * 60 * 1000

let warmUpPromise = null
let warmedUpAt = 0

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

async function request(path, options = {}, timeoutMs = REQUEST_TIMEOUT_MS) {
  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs)
  let response

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new ApiError('서버 응답이 너무 늦어졌어요. 잠시 후 다시 시도해 주세요.', 0, null)
    }
    throw new ApiError('서버에 연결하지 못했어요. 인터넷 연결을 확인하고 다시 시도해 주세요.', 0, null)
  } finally {
    window.clearTimeout(timeoutId)
  }

  const hasBody = response.status !== 204
  const data = hasBody ? await response.json().catch(() => null) : null

  if (!response.ok) {
    const fieldMessage = data?.fieldErrors
      ? Object.values(data.fieldErrors).find(Boolean)
      : null

    throw new ApiError(
      fieldMessage || data?.message || '요청을 처리하지 못했어요. 잠시 후 다시 시도해 주세요.',
      response.status,
      data,
    )
  }

  return data
}

export const treeApi = {
  warmUp() {
    if (Date.now() - warmedUpAt < WARM_UP_VALID_MS) {
      return Promise.resolve()
    }

    if (!warmUpPromise) {
      warmUpPromise = request('/actuator/health')
        .then(() => {
          warmedUpAt = Date.now()
        })
        .finally(() => {
          warmUpPromise = null
        })
    }

    return warmUpPromise
  },

  create(payload) {
    return request('/api/trees', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  getPublic(slug) {
    return request(`/api/trees/${slug}`)
  },

  getOwner(slug, adminKey) {
    return request(`/api/trees/${slug}/owner`, {
      headers: { 'X-Tree-Admin-Key': adminKey },
    })
  },

  addLetter(slug, payload) {
    return request(`/api/trees/${slug}/letters`, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  guessSender(slug, letterId, adminKey, answer) {
    return request(`/api/trees/${slug}/letters/${letterId}/guess`, {
      method: 'POST',
      headers: { 'X-Tree-Admin-Key': adminKey },
      body: JSON.stringify({ answer }),
    })
  },

  deleteLetter(slug, letterId, adminKey) {
    return request(`/api/trees/${slug}/letters/${letterId}`, {
      method: 'DELETE',
      headers: { 'X-Tree-Admin-Key': adminKey },
    })
  },
}
