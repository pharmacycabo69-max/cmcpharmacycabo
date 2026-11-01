import { ImageResponse } from "next/og";

export const alt = "CMC Pharmacy Cabo — 24/7 pharmacy delivery in Los Cabos";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", background: "#f0fdfa", display: "flex", flexDirection: "column", justifyContent: "center", padding: 80 }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <svg width="96" height="96" viewBox="0 0 64 64">
            <rect width="64" height="64" rx="14" fill="#0f766e" />
            <path fill="#fff" d="M26 12h12a2 2 0 0 1 2 2v10h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H40v10a2 2 0 0 1-2 2H26a2 2 0 0 1-2-2V40H14a2 2 0 0 1-2-2V26a2 2 0 0 1 2-2h10V14a2 2 0 0 1 2-2Z" />
            <circle cx="32" cy="32" r="5" fill="#0f766e" />
          </svg>
          <div style={{ marginLeft: 28, fontSize: 52, fontWeight: 700, color: "#0f172a" }}>CMC Pharmacy Cabo</div>
        </div>
        <div style={{ marginTop: 56, fontSize: 76, fontWeight: 700, color: "#0f172a", lineHeight: 1.1 }}>24/7 pharmacy delivery in Cabo San Lucas &amp; San José del Cabo</div>
        <div style={{ marginTop: 36, fontSize: 34, color: "#0f766e" }}>English-speaking pharmacists &amp; doctors · +52 624 267 3177</div>
      </div>
    ),
    size,
  );
}
