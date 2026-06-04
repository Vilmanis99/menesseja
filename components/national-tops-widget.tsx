import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { SectionLabel } from "@/components/ui/section-label";
import { fetchNationalTops } from "@/lib/supabase/tops";

/** Dashboard teaser of the live national tops. Renders nothing until there's
 *  enough community data, so it never shows an empty box. */
export async function NationalTopsTeaser() {
  const tops = await fetchNationalTops(3);
  if (tops.length < 3) return null;

  return (
    <section className="mb-lg">
      <div className="mb-sm flex items-center justify-between">
        <SectionLabel icon="trending_up" iconClassName="text-primary">
          Ko Latvijā stāda visvairāk
        </SectionLabel>
        <Link href="/topi" className="text-label-sm text-primary hover:underline">
          Visi topi
        </Link>
      </div>
      <Card tone="container" className="flex items-center gap-md p-md">
        {tops.map((t, i) => (
          <Link key={t.cropId} href={`/augi/${t.cropId}`} className="group flex flex-1 flex-col items-center gap-1 text-center">
            <span className="text-2xl leading-none">{t.emoji}</span>
            <span className="text-body-md text-on-surface group-hover:text-primary">{t.name}</span>
            <span className="text-label-sm text-on-surface-variant">
              {i === 0 ? "🥇 " : i === 1 ? "🥈 " : "🥉 "}
              {t.plantings}×
            </span>
          </Link>
        ))}
      </Card>
    </section>
  );
}
