/**
 * Database Schema Definitions
 * 
 * Design Decisions:
 * - INTEGER primary keys (AUTOINCREMENT) for simplicity and performance
 * - Foreign keys with ON DELETE CASCADE for data integrity
 * - UNIQUE constraints on barcode and store name
 * - Indexed columns for common query patterns
 * - Timestamps as ISO 8601 strings for simplicity
 */

export const SCHEMA_VERSION = 1;

export const CREATE_SCHEMA_VERSION_TABLE = `
  CREATE TABLE IF NOT EXISTS schema_version (
    version INTEGER PRIMARY KEY
  );
`;

export const TABLES = {
  // Shopping lists
  lists: `
    CREATE TABLE IF NOT EXISTS lists (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `,
  
  // List items (products in a list)
  list_items: `
    CREATE TABLE IF NOT EXISTS list_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      list_id INTEGER NOT NULL,
      product_id INTEGER,
      qty REAL DEFAULT 1,
      note TEXT,
      checked INTEGER DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (list_id) REFERENCES lists(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
    );
  `,
  
  // Products catalog
  products: `
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      barcode TEXT UNIQUE,
      name TEXT NOT NULL,
      brand TEXT,
      category TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `,
  
  // Stores
  stores: `
    CREATE TABLE IF NOT EXISTS stores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `,
  
  // Prices (product prices at stores)
  prices: `
    CREATE TABLE IF NOT EXISTS prices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      store_id INTEGER NOT NULL,
      price_cents INTEGER NOT NULL,
      currency TEXT DEFAULT 'EUR',
      captured_at TEXT NOT NULL DEFAULT (datetime('now')),
      photo_uri TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
      FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE
    );
  `,
} as const;

export const INDEXES = [
  // List items - by list
  'CREATE INDEX IF NOT EXISTS idx_list_items_list_id ON list_items(list_id);',
  // List items - by product
  'CREATE INDEX IF NOT EXISTS idx_list_items_product_id ON list_items(product_id);',
  // Products - by barcode (for fast lookup)
  'CREATE INDEX IF NOT EXISTS idx_products_barcode ON products(barcode);',
  // Prices - by product (price history)
  'CREATE INDEX IF NOT EXISTS idx_prices_product_id ON prices(product_id);',
  // Prices - by store (price comparison)
  'CREATE INDEX IF NOT EXISTS idx_prices_store_id ON prices(store_id);',
  // Prices - by captured date (sorting)
  'CREATE INDEX IF NOT EXISTS idx_prices_captured_at ON prices(captured_at);',
] as const;

export type TableName = keyof typeof TABLES;
