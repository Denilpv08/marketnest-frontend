// --- Enums ---
export enum UserRole {
  superadmin = "superadmin",
  admin = "admin",
  customer = "customer",
}

export enum IdentityType {
  cc = "cc",
  ce = "ce",
  passport = "passport",
  nit = "nit",
}

export enum StoreStatus {
  pending = "pending",
  active = "active",
  suspended = "suspended",
}

export enum StoreType {
  restaurant = "restaurant",
  liquor_store = "liquor_store",
  clothing = "clothing",
  barbershop = "barbershop",
  pharmacy = "pharmacy",
  hardware_store = "hardware_store",
  other = "other",
}

export enum BusinessType {
  products = "products",
  services = "services",
  products_services = "products_services",
}

export enum OrderStatus {
  pending = "pending",
  paid = "paid",
  processing = "processing",
  shipped = "shipped",
  delivered = "delivered",
  cancelled = "cancelled",
}

export enum AppointmentStatus {
  pending = "pending",
  confirmed = "confirmed",
  cancelled = "cancelled",
  completed = "completed",
}

export enum DurationUnit {
  minutes = "minutes",
  hours = "hours",
  days = "days",
}

// --- Interfaces ---
export interface User {
  id: number;
  name: string;
  last_name: string | null;
  email: string;
  role: UserRole;
  identity_type: IdentityType | null;
  identity_number: string | null;
  city: string | null;
  address: string | null;
  photo_url: string | null;
  is_active: boolean;
  created_at: string;
}

export interface DaySchedule {
  open: string;
  close: string;
}

export interface Store {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  owner_id: number;
  status: StoreStatus;
  store_type: StoreType | null;
  custom_store_type: string | null;
  business_type: BusinessType;
  tax_id: string | null;
  phone: string | null;
  contact_email: string | null;
  city: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  opening_hours: Record<string, DaySchedule | null> | null;
  allows_appointments: boolean;
  logo_url: string | null;
  primary_color: string;
  secondary_color: string;
  banner_url: string | null;
  created_at: string;
}

export interface Product {
  id: number;
  store_id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
}

export interface ServiceCategory {
  id: number;
  store_id: number;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Service {
  id: number;
  store_id: number;
  category_id: number | null;
  name: string;
  description: string | null;
  price: number;
  duration: number;
  duration_unit: DurationUnit;
  image_url: string | null;
  is_active: boolean;
  category: ServiceCategory | null;
  created_at: string;
}

export interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  product: Product;
  created_at: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

export interface OrderItem {
  id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
}

export interface Order {
  id: number;
  user_id: number;
  store_id: number;
  total_amount: number;
  status: OrderStatus;
  items: OrderItem[];
  created_at: string;
}

export interface Appointment {
  id: number;
  store_id: number;
  user_id: number;
  service_id: number | null;
  date: string;
  time: string;
  status: AppointmentStatus;
  notes: string | null;
  admin_notes: string | null;
  service: Service | null;
  created_at: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface DashboardStore {
  total_sales: number;
  total_orders: number;
  paid_orders: number;
  total_products: number;
  low_stock_products: Product[];
  out_of_stock_products: Product[];
}

export interface DashboardSuperadmin {
  total_stores: number;
  active_stores: number;
  pending_stores: number;
  suspended_stores: number;
  total_users: number;
  total_revenue: number;
  total_orders: number;
}
