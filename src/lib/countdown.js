// The one genuinely non-obvious thing in this codebase:
//
// The target is a FIXED INSTANT, not a viewer-local wall clock — midnight on
// Thursday, Aug 31 2028 in US Eastern time (EDT, so UTC-4; DST doesn't end
// until November). bep and bepper are in different timezones, and the clock
// that becomes true for both of them is the one in the place they're moving to,
// so the page anchors there. Everyone on earth sees the same numbers.
//
// Months are walked as real calendar months in Eastern time, which is what
// "22 months away" means to a person. Two consequences, both intended:
//   - the days figure can jump by 1-3 when a month boundary passes, because
//     months are different lengths;
//   - the hours figure shifts by one across a US DST boundary, because calendar
//     months are wall-clock units and wall clocks are what move in March/Nov.
export const EVENT_ISO = '2028-08-31T00:00:00-04:00'
export const EVENT_ZONE = 'America/New_York'
export const EVENT_DATE = new Date(EVENT_ISO)

const partsFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: EVENT_ZONE,
  hour12: false,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
})

/** An instant's wall-clock parts in the event's timezone. */
function zonedParts(date) {
  const parts = {}
  for (const { type, value } of partsFormatter.formatToParts(date)) {
    if (type !== 'literal') parts[type] = Number(value)
  }
  if (parts.hour === 24) parts.hour = 0 // some engines report midnight as 24
  return parts
}

/** Wall-clock parts as a comparable number (UTC used purely as a fixed frame). */
function wallMs({ year, month, day, hour, minute, second }) {
  return Date.UTC(year, month - 1, day, hour, minute, second)
}

/** Add calendar months, clamping the day (Jan 31 + 1 month -> Feb 28/29). */
function addMonths(parts, count) {
  const total = parts.year * 12 + (parts.month - 1) + count
  const year = Math.floor(total / 12)
  const month = (total % 12) + 1
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate()
  return { ...parts, year, month, day: Math.min(parts.day, daysInMonth) }
}

/** Calendar-aware difference between two wall clocks, `from` <= `to`. */
function calendarDiff(from, to) {
  const toMs = wallMs(to)

  let months = (to.year - from.year) * 12 + (to.month - from.month)
  while (months > 0 && wallMs(addMonths(from, months)) > toMs) months -= 1
  if (months < 0) months = 0

  let rest = Math.max(0, toMs - wallMs(addMonths(from, months)))
  const days = Math.floor(rest / 86_400_000)
  rest -= days * 86_400_000
  const hours = Math.floor(rest / 3_600_000)
  rest -= hours * 3_600_000
  const minutes = Math.floor(rest / 60_000)
  rest -= minutes * 60_000
  const seconds = Math.floor(rest / 1000)

  return { months, days, hours, minutes, seconds }
}

/**
 * Time between now and the event.
 * `phase` is 'before' while counting down, 'after' once it has arrived — at
 * which point the same figures count up instead.
 */
export function timeToEvent(now = new Date()) {
  const nowParts = zonedParts(now)
  const eventParts = zonedParts(EVENT_DATE)
  const isBefore = now.getTime() < EVENT_DATE.getTime()

  return {
    phase: isBefore ? 'before' : 'after',
    ...(isBefore
      ? calendarDiff(nowParts, eventParts)
      : calendarDiff(eventParts, nowParts)),
  }
}
