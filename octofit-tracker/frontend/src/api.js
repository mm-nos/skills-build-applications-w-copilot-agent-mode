const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()

function getApiBaseUrl() {
  if (codespaceName) {
    return `https://${codespaceName}-8000.app.github.dev/api`
  }

  if (typeof window !== 'undefined') {
    const { protocol, hostname } = window.location
    const codespaceHost = hostname.match(/^(.*)-5173\.app\.github\.dev$/)

    if (codespaceHost) {
      return `${protocol}//${codespaceHost[1]}-8000.app.github.dev/api`
    }
  }

  return 'http://localhost:8000/api'
}

export const apiBaseUrl = getApiBaseUrl()

export const hasCodespaceApi = apiBaseUrl.includes('.app.github.dev')

export function normalizeCollection(payload) {
  if (Array.isArray(payload)) {
    return payload
  }

  if (!payload || typeof payload !== 'object') {
    return []
  }

  const collectionKeys = ['results', 'data', 'items', 'docs', 'records']
  for (const key of collectionKeys) {
    const value = payload[key]
    if (Array.isArray(value)) {
      return value
    }

    if (value && typeof value === 'object') {
      const nestedItems = collectionKeys
        .map((nestedKey) => value[nestedKey])
        .find(Array.isArray)

      if (nestedItems) {
        return nestedItems
      }
    }
  }

  return Object.values(payload).find(Array.isArray) ?? []
}

export async function fetchCollection(resource) {
  const response = await fetch(`${apiBaseUrl}/${resource}/`)

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }

  return normalizeCollection(await response.json())
}
