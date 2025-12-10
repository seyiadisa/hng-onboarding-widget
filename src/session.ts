export function getSessionId() {
  try {
    const key = 'tour-widget-session-id-v1'
    let id = localStorage.getItem(key)
    if (!id) {
      id = crypto?.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`
      localStorage.setItem(key, id)
    }
    return id
  } catch (e) {
    return `anon-${Date.now()}`
  }
}
