const STORAGE_KEY = 'dcb_blocks_v1'

export const loadBlocks = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(b => b && b.id && b.type)
  } catch {
    return []
  }
}

export const saveBlocks = (blocks) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(blocks))
  } catch {
    // Storage full or unavailable
  }
}

export const clearBlocks = () => {
  localStorage.removeItem(STORAGE_KEY)
}
