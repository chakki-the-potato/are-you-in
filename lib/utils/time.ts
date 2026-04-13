/**
 * Generate 15-minute slot keys between start and end times.
 * @param start - "HH:MM"
 * @param end   - "HH:MM"
 * @returns Array of "HH:MM" strings (e.g., ["09:00", "09:15", ...])
 */
export function generateTimeSlots(start: string, end: string): string[] {
  const slots: string[] = []
  const [startH, startM] = start.split(':').map(Number)
  const [endH, endM] = end.split(':').map(Number)
  let totalMinutes = startH * 60 + startM
  const endMinutes = endH * 60 + endM

  while (totalMinutes < endMinutes) {
    const h = Math.floor(totalMinutes / 60)
    const m = totalMinutes % 60
    slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`)
    totalMinutes += 15
  }

  return slots
}

/**
 * Convert a date + slot key to an ISO UTC timestamp.
 * @param date - "YYYY-MM-DD"
 * @param slot - "HH:MM"
 */
export function slotToTimestamp(date: string, slot: string): string {
  return `${date}T${slot}:00.000Z`
}

/**
 * Add 15 minutes to a slot key.
 */
export function addFifteenMin(slot: string): string {
  const [h, m] = slot.split(':').map(Number)
  const totalMinutes = h * 60 + m + 15
  const newH = Math.floor(totalMinutes / 60)
  const newM = totalMinutes % 60
  return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`
}

/**
 * Format an ISO timestamp string to a display time like "9:00 AM".
 */
export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

/**
 * Format an ISO date string to "M월 D일" (Korean locale).
 */
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Get slot key from an ISO timestamp (UTC).
 */
export function timestampToSlot(iso: string): string {
  const d = new Date(iso)
  const h = d.getUTCHours()
  const m = d.getUTCMinutes()
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}
