const STORAGE_KEY = 'christmas-letter-tree-access'

function readTrees() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

export function saveTreeAccess(tree) {
  const otherTrees = readTrees().filter((saved) => saved.slug !== tree.slug)
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify([{ ...tree, savedAt: new Date().toISOString() }, ...otherTrees]),
  )
}

export function getTreeAccess(slug) {
  return readTrees().find((tree) => tree.slug === slug) || null
}

export function getLatestTreeAccess() {
  return readTrees()[0] || null
}
