const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()

export const apiBaseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api`
  : 'http://localhost:8000/api'

export const hasCodespaceApi = Boolean(codespaceName)

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
