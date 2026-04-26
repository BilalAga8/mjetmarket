import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ — Pyetje të Shpeshta",
  description: "Gjeni përgjigjet për pyetjet më të shpeshta rreth MjetMarket — si të kërkoni, si të shisni, pjesë këmbimi, servise dhe llogaria juaj.",
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return children;
}
