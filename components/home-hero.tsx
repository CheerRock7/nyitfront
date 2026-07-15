import Link from "next/link";
import { baht } from "@/lib/data";

export type CategoryStat = { count: number; from: number };
export type HeroStats = { gpu: CategoryStat; cpu: CategoryStat; set: CategoryStat };

// Inline glyphs so the whole hero renders on the server (the fan is pure-CSS
// hover, no client JS needed).
function Glyph({ name }: { name: "gpu" | "cpu" | "monitor" }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  if (name === "gpu") {
    return (
      <svg {...common}>
        <rect x="2" y="6" width="20" height="12" rx="2" />
        <circle cx="8" cy="12" r="2.4" />
        <circle cx="15" cy="12" r="2.4" />
        <path d="M2 18v2M6 18v2M18 18v2" />
      </svg>
    );
  }
  if (name === "monitor") {
    return (
      <svg {...common}>
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <rect x="6" y="6" width="12" height="12" rx="2" />
      <rect x="9" y="9" width="6" height="6" rx="1" />
      <path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2" />
    </svg>
  );
}

const Wrench = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z" />
  </svg>
);
const Arrow = ({ size = 18 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

function FanCard({
  variant,
  glyph,
  tag,
  title,
  sub,
  stat,
  unit,
  href,
  cta,
}: {
  variant: "back" | "mid" | "front";
  glyph: "gpu" | "cpu" | "monitor";
  tag: string;
  title: string;
  sub: string;
  stat: CategoryStat;
  unit: string;
  href: string;
  cta: string;
}) {
  return (
    <Link href={href} className={`fan-card ${variant}`}>
      <span className="glow" aria-hidden />
      <span className="wm" aria-hidden>
        <span style={{ display: "block", width: 170, height: 170 }}>
          <Glyph name={glyph} />
        </span>
      </span>
      <span className="top">
        <span className="tag">{tag}</span>
        <span className="badge">
          <span style={{ display: "block", width: 18, height: 18 }}>
            <Glyph name={glyph} />
          </span>
        </span>
      </span>
      <h3>{title}</h3>
      <p className="sub">{sub}</p>
      <span className="meta">
        {stat.count > 0 ? (
          <span className="pill">
            <b>{stat.count}</b> {unit}
          </span>
        ) : null}
        {stat.from > 0 ? (
          <span className="pill">
            <b>{baht(stat.from)}+</b>
          </span>
        ) : null}
      </span>
      <span className="go">
        {cta} <Arrow size={15} />
      </span>
    </Link>
  );
}

export function HomeHero({ stats }: { stats: HeroStats }) {
  return (
    <section className="wrap home-hero">
      <div>
        <span className="eyebrow">◆ NYIT Computer · เชียงใหม่</span>
        <h1>
          ประกอบคอมที่ใช่
          <br />
          <span className="grad">ครบ จบ ในที่เดียว</span>
        </h1>
        <p className="lead">
          การ์ดจอ ซีพียู เมนบอร์ด แรม SSD และคอมเซ็ตพร้อมใช้งาน เริ่มจัดเสปกของคุณได้เลย
        </p>
        <div className="actions">
          <Link className="cta-build" href="/builder">
            <span className="cta-ico">
              <Wrench />
            </span>
            <span className="cta-txt">
              <b>จัดสเปกคอมตามงบ</b>
              <small>เลือก CPU · VGA · RAM · SSD ในชุดเดียว</small>
            </span>
            <span className="cta-arr">
              <Arrow />
            </span>
          </Link>
        </div>
      </div>

      <div className="fanwrap">
        <div className="fan">
          <FanCard
            variant="back"
            glyph="cpu"
            tag="Processors"
            title="CPU"
            sub="ซีพียู Intel / AMD สำหรับทำงานและเกมมิ่ง"
            stat={stats.cpu}
            unit="รุ่น"
            href="/products?cat=cpu"
            cta="ดูสินค้า"
          />
          <FanCard
            variant="front"
            glyph="gpu"
            tag="Graphic Cards"
            title="VGA"
            sub="การ์ดจอสำหรับเล่นเกม ตัดต่อ และงานกราฟิก"
            stat={stats.gpu}
            unit="รุ่น"
            href="/products?cat=gpu"
            cta="ดูสินค้า"
          />
          <FanCard
            variant="mid"
            glyph="monitor"
            tag="Build Ready"
            title="CPU Set"
            sub="ชุดคอมพร้อมใช้งาน เลือกสเปกให้เข้ากับงบ"
            stat={stats.set}
            unit="ชุด"
            href="/builder"
            cta="จัดสเปกเลย"
          />
        </div>
        <span className="fan-hint mono" aria-hidden>
          ↑ ชี้เมาส์ที่การ์ด
        </span>
      </div>
    </section>
  );
}
