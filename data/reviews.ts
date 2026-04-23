export type Review = {
  id: number;
  dealer_id: number;
  dealer_type: "shop" | "service";
  user_name: string;
  rating: number;
  comment: string;
  date: string;
  approved: boolean;
};

export const reviews: Review[] = [
  { id: 1, dealer_id: 1, dealer_type: "shop", user_name: "Ardit M.", rating: 5, comment: "Shërbim fantastik, morën pjesët brenda ditës. Rekomandoj shumë!", date: "2026-04-10", approved: true },
  { id: 2, dealer_id: 1, dealer_type: "shop", user_name: "Blerina K.", rating: 4, comment: "Çmime të mira dhe staff i sjellshëm. Do kthehem.", date: "2026-03-28", approved: true },
  { id: 3, dealer_id: 2, dealer_type: "shop", user_name: "Gentian F.", rating: 5, comment: "Gjeta pjesën që kërkoja prej muajsh. Super!", date: "2026-04-05", approved: true },
  { id: 4, dealer_id: 2, dealer_type: "shop", user_name: "Sabrina H.", rating: 3, comment: "Mirë, por pritja ishte pak e gjatë.", date: "2026-03-15", approved: true },
  { id: 5, dealer_id: 4, dealer_type: "shop", user_name: "Erjon B.", rating: 5, comment: "Profesionalizëm i lartë dhe çmime konkurruese.", date: "2026-04-12", approved: true },
  { id: 6, dealer_id: 1, dealer_type: "service", user_name: "Klajdi P.", rating: 5, comment: "Mekanikë shumë të aftë, zgjidhën problemin brenda 2 orësh.", date: "2026-04-08", approved: true },
  { id: 7, dealer_id: 2, dealer_type: "service", user_name: "Marsela D.", rating: 4, comment: "Punë e mirë, çmim i arsyeshëm.", date: "2026-03-20", approved: true },
  { id: 8, dealer_id: 3, dealer_type: "service", user_name: "Fatos N.", rating: 5, comment: "Servis i shkëlqyer, makinën e kthyen si të re!", date: "2026-04-01", approved: true },
];
