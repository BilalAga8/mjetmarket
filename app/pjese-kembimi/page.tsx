import PjeseKembimiClient from "./PjeseKembimiClient";
import { partCategories } from "../../data/partCategories";

export default function PjeseKembimiPage() {
  return <PjeseKembimiClient categories={partCategories} />;
}
