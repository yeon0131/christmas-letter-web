const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080').replace(/\/$/, '')

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

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
