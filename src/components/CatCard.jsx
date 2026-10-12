import { randomRepoCat } from '../lib/cats'

/**
 * A cat taped into the page. The image box is a fixed square with
 * object-fit: cover, because the APIs return every aspect ratio imaginable and
 * a reserved box means the layout never jumps when one loads.
 */
export default function CatCard({ name, url, tilt }) {
  return (
    <figure className="cat" style={{ '--tilt': tilt }}>
      <div className="cat__tape cat__tape--left" aria-hidden="true" />
      <div className="cat__tape cat__tape--right" aria-hidden="true" />

      <div className="cat__frame">
        {url ? (
          <img
            className="cat__img"
            src={url}
            alt="a random cat photo, taped into the page"
            loading="eager"
            onError={(event) => {
              event.currentTarget.src = randomRepoCat()
            }}
          />
        ) : (
          <div className="cat__loading">
            <span aria-hidden="true">🐾</span>
            <span className="cat__loading-text">finding a cat</span>
          </div>
        )}
      </div>

      <figcaption className="cat__name">
        {name}
        <svg
          className="cat__underline"
          viewBox="0 0 120 10"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M3 6 C 22 2, 38 9, 58 5 S 96 2, 117 6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </figcaption>
    </figure>
  )
}
