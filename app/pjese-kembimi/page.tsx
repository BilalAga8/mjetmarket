import type { Metadata } from "next";
import PjeseKembimiClient from "./PjeseKembimiClient";
import { partCategories } from "../../data/partCategories";

export const metadata: Metadata = {
  title: "Pjesë Këmbimi",
  description: "Porosit pjesë këmbimi për makinën tënde direkt online. Partnerë të verifikuar në të gjithë Shqipërinë.",
  keywords: ["pjese kembimi makine", "auto parts shqiperi", "pjese kembimi tirane", "spare parts shqiperi", "pjese auto shqiperi"],
};

export default function PjeseKembimiPage() {
  return <PjeseKembimiClient categories={partCategories} />;
}
