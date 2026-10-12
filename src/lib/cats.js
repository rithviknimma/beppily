// Cats come from a live API, so the page has to survive someone else's uptime
// until Aug 2028. Three sources, tried in order; the last one lives in this
// repo, so a cat always appears even with every API down.
//
// Photos and gifs are both accepted as-is — whatever the API hands back. The
// surprise is part of the fun, and filtering wouldn't work anyway: TheCatAPI's
// `mime_types=gif` filter leaks jpgs.
const LOCAL_CATS = ['fallback-1.jpg', 'fallback-2.jpg', 'fallback-3.jpg'].map(
  (name) => `${import.meta.env.BASE_URL}cats/${name}`,
)

const TIMEOUT_MS = 6000

function timeoutSignal() {
  return AbortSignal.timeout(TIMEOUT_MS)
}

/** Primary: TheCatAPI. No key needed, S3-backed, one call for both cats. */
async function fromTheCatApi(count) {
  const response = await fetch(
    `https://api.thecatapi.com/v1/images/search?limit=${count}&_=${Date.now()}`,
    { signal: timeoutSignal() },
  )
  if (!response.ok) throw new Error(`TheCatAPI: ${response.status}`)

  const cats = (await response.json())
    .map((cat) => cat?.url)
    .filter((url) => typeof url === 'string')
  if (cats.length < count) throw new Error('TheCatAPI: not enough cats')

  return cats.slice(0, count)
}

/** Backup: cataas. One request per cat. */
async function fromCataas(count) {
  const requests = Array.from({ length: count }, (_, index) =>
    fetch(`https://cataas.com/cat?json=true&_=${Date.now()}-${index}`, {
      signal: timeoutSignal(),
    }).then((response) => {
      if (!response.ok) throw new Error(`cataas: ${response.status}`)
      return response.json()
    }),
  )

  const cats = (await Promise.all(requests))
    .map((cat) => cat?.url)
    .filter((url) => typeof url === 'string')
  if (cats.length < count) throw new Error('cataas: not enough cats')

  return cats
}

/** A cat from this repo. Also the <img onError> net when an API URL 404s. */
export function randomRepoCat() {
  return LOCAL_CATS[Math.floor(Math.random() * LOCAL_CATS.length)]
}

/** Last resort: the cats committed to this repo. */
function fromRepo(count) {
  const shuffled = [...LOCAL_CATS].sort(() => Math.random() - 0.5)
  return Array.from(
    { length: count },
    (_, index) => shuffled[index % shuffled.length],
  )
}

/** Resolves to `count` cat image URLs. Never rejects. */
export async function fetchCats(count = 2) {
  for (const source of [fromTheCatApi, fromCataas]) {
    try {
      return await source(count)
    } catch {
      // try the next source
    }
  }
  return fromRepo(count)
}
