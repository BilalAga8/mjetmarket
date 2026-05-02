-- Tabela e porosive të produkteve (Buy Now)
CREATE TABLE IF NOT EXISTS product_orders (
  id             uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id     uuid REFERENCES products(id) ON DELETE SET NULL,
  product_name   text NOT NULL,
  product_price_from numeric,
  product_price_to   numeric,
  vehicle_make   text,
  vehicle_model  text,
  vehicle_year   text,
  full_name      text NOT NULL,
  phone          text NOT NULL,
  notes          text,
  status         text DEFAULT 'pritje' CHECK (status IN ('pritje','konfirmuar','anuluar')),
  created_at     timestamptz DEFAULT now()
);

ALTER TABLE product_orders ENABLE ROW LEVEL SECURITY;

-- Admini lexon të gjitha
CREATE POLICY "admin read orders" ON product_orders
  FOR SELECT USING (true);

-- Çdokush mund të krijojë porosi
CREATE POLICY "public insert orders" ON product_orders
  FOR INSERT WITH CHECK (true);

-- Admini mund të përditësojë statusin
CREATE POLICY "admin update orders" ON product_orders
  FOR UPDATE USING (true);
