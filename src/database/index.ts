/**
 * CompraJa Database Layer
 * 
 * SQLite persistence using expo-sqlite
 * 
 * @packageDocumentation
 */

// Schema & Migrations
export { SCHEMA_VERSION, TABLES, INDEXES, CREATE_SCHEMA_VERSION_TABLE } from './schema';
export type { TableName } from './schema';
export { MigrationRunner, openDatabase } from './migration';

// Types
export type {
  List, ListCreate, ListUpdate,
  ListItem, ListItemCreate, ListItemUpdate,
  Product, ProductCreate, ProductUpdate,
  Store, StoreCreate, StoreUpdate,
  Price, PriceCreate, PriceUpdate,
  DbDiagnostics
} from './types';

// Repositories
export {
  ListRepository,
  ListItemRepository,
  ProductRepository,
  StoreRepository,
  PriceRepository
} from './repositories';

// Diagnostics
export { DatabaseDiagnostics as DbDiagnostics, getDbDiagnostics, printDbDiagnostics } from './diagnostics';
