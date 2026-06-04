"use client";

import { useEffect } from "react";

/** Last-resort boundary for errors thrown above the route segment (e.g. in the
 *  root layout / providers). Must render its own <html>/<body>. */
export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="lv">
      <body style={{ background: "#0b1326", color: "#dae2fd", fontFamily: "system-ui, sans-serif" }}>
        <div style={{ maxWidth: 480, margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
          <h1 style={{ fontSize: 28, marginBottom: 12 }}>Kaut kas nogāja greizi</h1>
          <p style={{ color: "#c2c8c1", marginBottom: 24 }}>
            Atvaino — radās negaidīta kļūda. Mēģini vēlreiz.
          </p>
          <button
            onClick={reset}
            style={{
              background: "#accfb6",
              color: "#0b1326",
              border: "none",
              borderRadius: 12,
              padding: "12px 24px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Mēģināt vēlreiz
          </button>
        </div>
      </body>
    </html>
  );
}
