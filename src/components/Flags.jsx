function starPoints(radius) {
  const points = [];
  for (let i = 0; i < 5; i += 1) {
    const outer = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
    const inner = outer + Math.PI / 5;
    points.push(`${(radius * Math.cos(outer)).toFixed(2)},${(radius * Math.sin(outer)).toFixed(2)}`);
    points.push(`${(radius * 0.382 * Math.cos(inner)).toFixed(2)},${(radius * 0.382 * Math.sin(inner)).toFixed(2)}`);
  }
  return points.join(" ");
}

function Star({ cx, cy, r, rotate = 0 }) {
  return (
    <polygon
      points={starPoints(r)}
      transform={`translate(${cx} ${cy}) rotate(${rotate})`}
    />
  );
}

function Japan() {
  return (
    <svg viewBox="0 0 90 60" aria-hidden="true">
      <rect width="90" height="60" fill="#fff" />
      <circle cx="45" cy="30" r="18" fill="#bc002d" />
    </svg>
  );
}

function UnitedKingdom() {
  return (
    <svg viewBox="0 0 60 30" aria-hidden="true">
      <defs>
        <clipPath id="uk-edge">
          <rect width="60" height="30" />
        </clipPath>
        <clipPath id="uk-saltire">
          <path d="M30,15 h30 v15 z v-15 h-30 z h-30 v15 z v-15 h30 z" />
        </clipPath>
      </defs>
      <g clipPath="url(#uk-edge)">
        <rect width="60" height="30" fill="#012169" />
        <path d="M0 0 L60 30 M60 0 L0 30" stroke="#fff" strokeWidth="6" />
        <path d="M0 0 L60 30 M60 0 L0 30" stroke="#c8102e" strokeWidth="4" clipPath="url(#uk-saltire)" />
        <path d="M30 0 V30 M0 15 H60" stroke="#fff" strokeWidth="10" />
        <path d="M30 0 V30 M0 15 H60" stroke="#c8102e" strokeWidth="6" />
      </g>
    </svg>
  );
}

function UnitedStates() {
  const stripe = 100 / 13;
  const cantonH = stripe * 7;
  const stars = [];
  for (let row = 0; row < 9; row += 1) {
    const count = row % 2 === 0 ? 6 : 5;
    const y = ((row + 1) * cantonH) / 10;
    for (let col = 0; col < count; col += 1) {
      const x = count === 6 ? ((col + 0.5) * 76) / 6 : ((col + 1) * 76) / 6;
      stars.push({ x, y, key: `${row}-${col}` });
    }
  }
  return (
    <svg viewBox="0 0 190 100" aria-hidden="true">
      {Array.from({ length: 13 }, (_, index) => (
        <rect
          key={index}
          y={stripe * index}
          width="190"
          height={stripe + 0.4}
          fill={index % 2 ? "#fff" : "#b22234"}
        />
      ))}
      <rect width="76" height={cantonH} fill="#3c3b6e" />
      <g fill="#fff">
        {stars.map((item) => (
          <Star key={item.key} cx={item.x} cy={item.y} r="1.55" />
        ))}
      </g>
    </svg>
  );
}

function China() {
  const small = [
    [10, 2],
    [12, 4],
    [12, 7],
    [10, 9],
  ];
  return (
    <svg viewBox="0 0 30 20" aria-hidden="true">
      <rect width="30" height="20" fill="#de2910" />
      <g fill="#ffde00">
        <Star cx="5" cy="5" r="3" />
        {small.map(([cx, cy]) => {
          const turn = (Math.atan2(5 - cy, 5 - cx) * 180) / Math.PI + 90;
          return <Star key={`${cx}-${cy}`} cx={cx} cy={cy} r="1" rotate={turn} />;
        })}
      </g>
    </svg>
  );
}

const FLAGS = [
  { name: "Japan", label: "Japan", Flag: Japan },
  { name: "United Kingdom", label: "UK", Flag: UnitedKingdom },
  { name: "United States", label: "US", Flag: UnitedStates },
  { name: "China", label: "China", Flag: China },
];

export default function Flags() {
  return (
    <ul className="flag-row" aria-label="Japan, United Kingdom, United States, and China">
      {FLAGS.map(({ name, label, Flag }) => (
        <li key={name}>
          <Flag />
          <span>{label}</span>
        </li>
      ))}
    </ul>
  );
}
