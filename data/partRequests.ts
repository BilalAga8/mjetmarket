export type OrderStatus = "pritje" | "proces" | "derguar" | "mbyllur";
export type PartnerType = string | null;

export interface PartRequest {
  id: string;
  full_name: string;
  phone: string;
  vin: string;
  vehicle_make: string;
  vehicle_model: string;
  vehicle_year: string;
  part_description: string;
  extra_notes: string;
  status: OrderStatus;
  assigned_partner: PartnerType;
  admin_notes: string;
  client_price: string;
  created_at: string;
}

export const STATUS_LABELS: Record<OrderStatus, string> = {
  pritje:   "Në Pritje",
  proces:   "Në Proces",
  derguar:  "Dërguar",
  mbyllur:  "Mbyllur",
};

export const STATUS_COLORS: Record<OrderStatus, string> = {
  pritje:  "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  proces:  "bg-blue-500/15 text-blue-400 border-blue-500/30",
  derguar: "bg-green-500/15 text-green-400 border-green-500/30",
  mbyllur: "bg-gray-500/15 text-gray-400 border-gray-500/30",
};

export const mockRequests: PartRequest[] = [
  {
    id: "req-001",
    full_name: "Arben Krasniqi",
    phone: "+355 69 123 4567",
    vin: "WBA3A5G5XDNN12345",
    vehicle_make: "BMW",
    vehicle_model: "320d",
    vehicle_year: "2012",
    part_description: "Filtro Vaji",
    extra_notes: "Duhet urgjentisht",
    status: "pritje",
    assigned_partner: null,
    admin_notes: "",
    client_price: "",
    created_at: "2026-04-22T09:15:00Z",
  },
  {
    id: "req-002",
    full_name: "Mirela Hoxha",
    phone: "+355 68 987 6543",
    vin: "WVWZZZ1JZ3W386752",
    vehicle_make: "Volkswagen",
    vehicle_model: "Golf 4",
    vehicle_year: "2003",
    part_description: "Disqe Frenash",
    extra_notes: "",
    status: "proces",
    assigned_partner: "A",
    admin_notes: "Çmimi blerje 45€",
    client_price: "65",
    created_at: "2026-04-21T14:30:00Z",
  },
  {
    id: "req-003",
    full_name: "Fatos Berisha",
    phone: "+355 67 555 1234",
    vin: "ZFA19800000123456",
    vehicle_make: "Fiat",
    vehicle_model: "Punto",
    vehicle_year: "2008",
    part_description: "Rripa Timing",
    extra_notes: "Kit i plotë nëse ka",
    status: "derguar",
    assigned_partner: "C",
    admin_notes: "Partneri C dërgon direkt",
    client_price: "90",
    created_at: "2026-04-20T11:00:00Z",
  },
];
