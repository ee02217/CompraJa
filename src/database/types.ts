/**
 * Database Entity Types
 */

// Base timestamp type
type Timestamp = string;

/**
 * Shopping List
 */
export interface List {
  id: number;
  name: string;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface ListCreate {
  name: string;
}

export interface ListUpdate {
  name?: string;
}

/**
 * List Item (product in a shopping list)
 */
export interface ListItem {
  id: number;
  list_id: number;
  product_id: number | null;
  qty: number;
  note: string | null;
  checked: boolean;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface ListItemCreate {
  list_id: number;
  product_id?: number | null;
  qty?: number;
  note?: string | null;
  checked?: boolean;
}

export interface ListItemUpdate {
  qty?: number;
  note?: string | null;
  checked?: boolean;
  product_id?: number | null;
}

/**
 * Product
 */
export interface Product {
  id: number;
  barcode: string | null;
  name: string;
  brand: string | null;
  category: string | null;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface ProductCreate {
  barcode?: string | null;
  name: string;
  brand?: string | null;
  category?: string | null;
}

export interface ProductUpdate {
  barcode?: string | null;
  name?: string;
  brand?: string | null;
  category?: string | null;
}

/**
 * Store
 */
export interface Store {
  id: number;
  name: string;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface StoreCreate {
  name: string;
}

export interface StoreUpdate {
  name?: string;
}

/**
 * Price (product price at a store)
 */
export interface Price {
  id: number;
  product_id: number;
  store_id: number;
  price_cents: number;
  currency: string;
  captured_at: Timestamp;
  photo_uri: string | null;
  created_at: Timestamp;
}

export interface PriceCreate {
  product_id: number;
  store_id: number;
  price_cents: number;
  currency?: string;
  photo_uri?: string | null;
}

export interface PriceUpdate {
  price_cents?: number;
  currency?: string;
  photo_uri?: string | null;
}

/**
 * Database Diagnostics
 */
export interface DbDiagnostics {
  schemaVersion: number;
  lists: number;
  listItems: number;
  products: number;
  stores: number;
  prices: number;
}
