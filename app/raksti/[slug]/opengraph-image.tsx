import { ImageResponse } from "next/og";
import { getArticle } from "@/lib/articles";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function ArticleImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  const title = article?.title ?? "Dārza padoms";
  const category = article?.category ?? "Mēness Sēja";
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#0b1326", padding: "64px 72px", color: "#f0f3ed" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontSize: 30, color: "#accfb6", fontWeight: 700 }}>Mēness Sēja</div>
        <div style={{ fontSize: 22, color: "#d6b384", textTransform: "uppercase", letterSpacing: 3 }}>{category}</div>
      </div>
      <div style={{ display: "flex", fontSize: title.length > 70 ? 50 : 60, lineHeight: 1.12, fontWeight: 700, maxWidth: 1020 }}>{title}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 16, color: "#c2c8c1", fontSize: 24 }}>
        <div style={{ width: 16, height: 16, borderRadius: 16, background: "#accfb6" }} />
        Latvijas klimatam · skaidri un praktiski
      </div>
    </div>,
    size,
  );
}
