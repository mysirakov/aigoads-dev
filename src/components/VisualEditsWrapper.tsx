"use client";

import dynamic from "next/dynamic";

const VisualEditsMessenger = dynamic(
  () => import("orchids-visual-edits").then((mod) => mod.VisualEditsMessenger),
  { ssr: false }
);

export function VisualEditsWrapper() {
  return <VisualEditsMessenger />;
}
