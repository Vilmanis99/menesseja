import { ImageResponse } from "next/og";

export const alt = "Mēness Sēja — Latviešu Mēness sējas kalendārs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0b1326",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            width: 170,
            height: 170,
            borderRadius: 170,
            background: "#dde3eb",
            boxShadow: "0 0 70px rgba(221,227,235,0.35)",
            marginBottom: 36,
          }}
        />
        <div style={{ fontSize: 78, fontWeight: 700, color: "#accfb6" }}>Mēness Sēja</div>
        <div style={{ fontSize: 34, color: "#c2c8c1", marginTop: 14 }}>
          Sēj pēc Mēness, laika un senču gudrības
        </div>
        <div style={{ fontSize: 24, color: "#8c928c", marginTop: 28 }}>
          Latviešu Mēness sējas un biodinamiskais dārza kalendārs
        </div>
      </div>
    ),
    size,
  );
}
