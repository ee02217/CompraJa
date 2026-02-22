/**
 * Database Diagnostics
 * 
 * Utility functions to inspect database state
 */

import * as SQLite from 'expo-sqlite';
import { DbDiagnostics as DbDiagType } from './types';
import { MigrationRunner } from './migration';

export class DatabaseDiagnostics {
  private db: SQLite.SQLiteDatabase;

  constructor(db: SQLite.SQLiteDatabase) {
    this.db = db;
  }

  /**
   * Get database diagnostics (version + counts)
   */
  async getDiagnostics(): Promise<DbDiagnostics> {
    const runner = new MigrationRunner(this.db);
    const schemaVersion = await runner.getVersion();

    const [lists, listItems, products, stores, prices] = await Promise.all([
      this.db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM lists'),
      this.db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM list_items'),
      this.db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM products'),
      this.db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM stores'),
      this.db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM prices'),
    ]);

    return {
      schemaVersion,
      lists: lists?.count ?? 0,
      listItems: listItems?.count ?? 0,
      products: products?.count ?? 0,
      stores: stores?.count ?? 0,
      prices: prices?.count ?? 0,
    };
  }

  /**
   * Print diagnostics to console
   */
  async printDiagnostics(): Promise<void> {
    const diag = await this.getDiagnostics();
    
    console.log('═══════════════════════════════════════');
    console.log('         DATABASE DIAGNOSTICS          ');
    console.log('═══════════════════════════════════════');
    console.log(`Schema Version:  ${diag.schemaVersion}`);
    console.log('───────────────────────────────────────');
    console.log(`Shopping Lists:  ${diag.lists}`);
    console.log(`List Items:      ${diag.listItems}`);
    console.log(`Products:        ${diag.products}`);
    console.log(`Stores:          ${diag.stores}`);
    console.log(`Prices:          ${diag.prices}`);
    console.log('═══════════════════════════════════════');
  }

  /**
   * List all tables
   */
  async listTables(): Promise<string[]> {
    const result = await this.db.getAllAsync<{ name: string }>(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
    );
    return result.map(r => r.name);
  }

  /**
   * Show table schema
   */
  async showTableSchema(tableName: string): Promise<string | null> {
    const result = await this.db.getFirstAsync<{ sql: string }>(
      "SELECT sql FROM sqlite_master WHERE type='table' AND name = ?",
      [tableName]
    );
    return result?.sql ?? null;
  }
}

/**
 * Standalone function to get diagnostics
 */
export async function getDbDiagnostics(db: SQLite.SQLiteDatabase): Promise<DbDiagnostics> {
  const diag = new DbDiagnostics(db);
  return await diag.getDiagnostics();
}

/**
 * Standalone function to print diagnostics
 */
export async function printDbDiagnostics(db: SQLite.SQLiteDatabase): Promise<void> {
  const diag = new DbDiagnostics(db);
  await diag.printDiagnostics();
}
