/**
 * Margin drawings. Purely decorative, so all of it is aria-hidden, and the
 * wobble comes from one SVG displacement filter rather than from hand-placed
 * imperfections. No stick figures: bep and bepper are the cats.
 */
export default function Doodles() {
  return (
    <>
      <svg className="crayon-defs" aria-hidden="true">
        <filter id="crayon-wobble">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.04"
            numOctaves="3"
            seed="7"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="3"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>

      {/* lopsided sun */}
      <svg
        className="doodle doodle--sun"
        viewBox="0 0 120 120"
        aria-hidden="true"
      >
        <g
          fill="none"
          stroke="#f0a93b"
          strokeWidth="4"
          strokeLinecap="round"
          filter="url(#crayon-wobble)"
        >
          <circle cx="60" cy="58" r="26" />
          <path d="M60 18 V4 M60 112 V98 M18 58 H4 M116 58 H102" />
          <path d="M28 26 L18 15 M92 90 L104 101 M92 26 L103 16 M28 90 L17 100" />
        </g>
      </svg>

      {/* the house they're moving into, drawn badly on purpose */}
      <svg
        className="doodle doodle--house"
        viewBox="0 0 160 150"
        aria-hidden="true"
      >
        <g
          fill="none"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#crayon-wobble)"
        >
          <path d="M26 142 L26 72 L132 70 L134 143 Z" stroke="#7b5e3b" />
          <path d="M18 74 L80 24 L142 72" stroke="#d2574f" />
          <path d="M108 44 L108 22 L122 22 L121 54" stroke="#7b5e3b" />
          <path d="M62 143 L62 104 L92 103 L93 142" stroke="#d2574f" />
          <circle cx="86" cy="124" r="2.5" stroke="#7b5e3b" />
          <path d="M38 88 L56 88 L56 100 L38 100 Z" stroke="#5b8bbd" />
          <path d="M104 88 L122 88 L122 100 L104 100 Z" stroke="#5b8bbd" />
          <path
            d="M80 60 C 72 50, 60 56, 66 66 C 70 72, 78 78, 80 80 C 82 78, 90 72, 94 66 C 100 56, 88 50, 80 60 Z"
            stroke="#e0657f"
          />
        </g>
      </svg>

      {/* scribbly cloud */}
      <svg
        className="doodle doodle--cloud"
        viewBox="0 0 140 70"
        aria-hidden="true"
      >
        <path
          d="M22 54 C 2 54, 4 32, 24 34 C 24 12, 56 8, 64 28 C 76 12, 108 16, 108 38 C 130 34, 134 56, 114 55 Z"
          fill="none"
          stroke="#9fc4e3"
          strokeWidth="4"
          strokeLinecap="round"
          filter="url(#crayon-wobble)"
        />
      </svg>

      {/* paw prints wandering up the margin */}
      <svg
        className="doodle doodle--paws"
        viewBox="0 0 70 190"
        aria-hidden="true"
      >
        <g fill="#b48ec4" filter="url(#crayon-wobble)">
          {[12, 62, 112, 162].map((y, index) => (
            <g key={y} transform={`translate(${index % 2 ? 30 : 4} ${y})`}>
              <ellipse cx="16" cy="18" rx="9" ry="7.5" />
              <circle cx="6" cy="7" r="3.4" />
              <circle cx="14" cy="3" r="3.4" />
              <circle cx="22" cy="4" r="3.4" />
              <circle cx="28" cy="10" r="3.4" />
            </g>
          ))}
        </g>
      </svg>
    </>
  )
}
