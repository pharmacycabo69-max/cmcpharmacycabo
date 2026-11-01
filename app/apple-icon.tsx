import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", background: "#0f766e", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="120" height="120" viewBox="0 0 64 64">
          <path fill="#fff" d="M26 12h12a2 2 0 0 1 2 2v10h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H40v10a2 2 0 0 1-2 2H26a2 2 0 0 1-2-2V40H14a2 2 0 0 1-2-2V26a2 2 0 0 1 2-2h10V14a2 2 0 0 1 2-2Z" />
          <circle cx="32" cy="32" r="5" fill="#0f766e" />
        </svg>
      </div>
    ),
    size,
  );
}
