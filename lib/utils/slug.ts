export function generateSlug(title: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 50)

  const suffix = Math.random().toString(36).slice(2, 6)
  return base ? `${base}-${suffix}` : suffix
}
