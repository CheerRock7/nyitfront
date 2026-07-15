import Link from "next/link";
import { ArrowRight, Wrench } from "lucide-react";
import { buildSlots } from "@/lib/data";
import { CategoryIcon } from "@/components/icons";

// The signature "จัดสเปกคอม" ad: a build sheet wired into one machine. Opaque
// on purpose (dark card on the white sheet). The schematic is decorative — the
// copy + CTA carry the meaning — so it's hidden from assistive tech.
const parts = buildSlots.slice(0, 6).map((slot) => ({
  cat: slot.cat,
  code: slot.cat.toUpperCase(),
  name: slot.label.replace(/\s*\(.*\)\s*$/, ""),
}));

export function PcBuilderFeature() {
  return (
    <div className="builder">
      <span className="builder-bp" aria-hidden />

      <div className="builder-copy">
        <span className="builder-eye mono">
          <Wrench className="h-3.5 w-3.5" /> PC Builder
        </span>
        <h2>
          จัดสเปกคอมตามงบ
          <br />
          <span className="accent">เราเลือก ประกอบ เทสต์ ให้ครบ</span>
        </h2>
        <p>บอกงบที่มี แล้วเราจัดชุดที่คุ้มและแรงที่สุดในงบนั้นให้</p>

        <div className="builder-actions">
          <Link href="/builder" className="builder-cta">
            เริ่มจัดสเปก <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="builder-schema" aria-hidden>
        <span className="schema-cap mono">อุปกรณ์ในชุด</span>
        <ul className="bus">
          {parts.map((part) => (
            <li key={part.code} className="node">
              <span className="node-dot" />
              <span className="node-ico">
                <CategoryIcon name={part.cat} className="h-4 w-4" />
              </span>
              <span className="node-name">{part.name}</span>
              <span className="node-code mono">{part.code}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
