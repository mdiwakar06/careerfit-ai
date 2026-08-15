import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "CareerFit AI Studio — Privacy-First Career Co-Pilot";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#f7f8f6",
          padding: "60px 80px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        {/* Top Bar: Brand & Beta Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "14px",
                backgroundColor: "#17211d",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#12715b",
                fontSize: "30px",
                fontWeight: "900",
              }}
            >
              C
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
              <span
                style={{
                  fontSize: "38px",
                  fontWeight: "900",
                  color: "#17211d",
                  letterSpacing: "-0.03em",
                }}
              >
                CareerFit
              </span>
              <span
                style={{
                  fontSize: "38px",
                  fontWeight: "900",
                  color: "#12715b",
                }}
              >
                .ai
              </span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 22px",
              borderRadius: "9999px",
              backgroundColor: "#e8f4f1",
              border: "2px solid rgba(18, 113, 91, 0.3)",
              color: "#12715b",
              fontSize: "18px",
              fontWeight: "700",
            }}
          >
            STUDIO BETA
          </div>
        </div>

        {/* Center Content: Headline & Subheading */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            maxWidth: "960px",
            gap: "20px",
          }}
        >
          <h1
            style={{
              fontSize: "56px",
              fontWeight: "900",
              color: "#17211d",
              lineHeight: 1.15,
              letterSpacing: "-0.03em",
              margin: 0,
            }}
          >
            Privacy-First Bidirectional{" "}
            <span style={{ color: "#12715b" }}>AI Career Co-Pilot</span>
          </h1>

          <p
            style={{
              fontSize: "24px",
              color: "#52605b",
              lineHeight: 1.4,
              margin: 0,
              maxWidth: "820px",
            }}
          >
            Dual Role & Culture Match Scoring (0–10) • Google X-Y-Z Resume Rewriter • Grounded pgvector Q&A Workspace
          </p>
        </div>

        {/* Bottom Feature Pills */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "16px",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 24px",
              borderRadius: "12px",
              backgroundColor: "#ffffff",
              border: "1px solid #e3e6e1",
              fontSize: "16px",
              fontWeight: "600",
              color: "#17211d",
            }}
          >
            100% PII Auto-Scrubbed
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 24px",
              borderRadius: "12px",
              backgroundColor: "#ffffff",
              border: "1px solid #e3e6e1",
              fontSize: "16px",
              fontWeight: "600",
              color: "#17211d",
            }}
          >
            Google X-Y-Z Formula
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 24px",
              borderRadius: "12px",
              backgroundColor: "#ffffff",
              border: "1px solid #e3e6e1",
              fontSize: "16px",
              fontWeight: "600",
              color: "#17211d",
            }}
          >
            3-Persona Review Panel
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
