/**
 * Migration Runner
 * 
 * Safe migration approach:
 * 1. Store schema version in a single-row table
 * 2. Run migrations sequentially from current version to target
 * 3. Each migration is idempotent (uses IF NOT EXISTS)
 * 4. Foreign keys enabled for data integrity
 */

import * as SQLite from 'expo-sqlite';
import { SCHEMA_VERSION, CREATE_SCHEMA_VERSION_TABLE, TABLES, INDEXES } from './schema';

export class MigrationRunner {
  private db: SQLite.SQLiteDatabase;

  constructor(db: SQLite.SQLiteDatabase) {
    this.db = db;
  }

  /**
   * Get current schema version from database
   */
  async getVersion(): Promise<number> {
    try {
      const result = await this.db.getFirstAsync<{ version: number }>(
        'SELECT version FROM schema_version ORDER BY version DESC LIMIT 1'
      );
      return result?.version ?? 0;
    } catch {
      // Table doesn't exist yet
      return 0;
    }
  }

  /**
   * Initialize the schema_version table if needed
   */
  private async initVersionTable(): Promise<void> {
    await this.db.execAsync(CREATE_SCHEMA_VERSION_TABLE);
  }

  /**
   * Run all migrations from current version to target
   */
  async migrate(): Promise<void> {
    await this.db.execAsync('PRAGMA foreign_keys = ON;');
    
    await this.initVersionTable();
    
    const currentVersion = await this.getVersion();
    
    if (currentVersion >= SCHEMA_VERSION) {
      console.log(`[DB] Already at schema version ${currentVersion}`);
      return;
    }

    console.log(`[DB] Migrating from v${currentVersion} to v${SCHEMA_VERSION}...`);
    
    // Run each migration step
    await this.runMigrations(currentVersion);
    
    // Update version
    await this.db.execAsync(
      'INSERT OR REPLACE INTO schema_version (version) VALUES (?);',
      [SCHEMA_VERSION]
    );
    
    console.log(`[DB] Migration complete. Schema version: ${SCHEMA_VERSION}`);
  }

  /**
   * Run migrations for each version
   */
  private async runMigrations(fromVersion: number): Promise<void> {
    // Version 0 -> 1: Initial schema
    if (fromVersion < 1) {
      await this.migrateToV1();
    }
    
    // Add future migrations here as needed:
    // if (fromVersion < 2) { await this.migrateToV2(); }
  }

  /**
   * Create all tables and indexes for version 1
   */
  private async migrateToV1(): Promise<void> {
    console.log('[DB] Running migration v1: Initial schema');
    
    // Create tables
    for (const [name, sql] of Object.entries(TABLES)) {
      console.log(`[DB] Creating table: ${name}`);
      await this.db.execAsync(sql);
    }
    
    // Create indexes
    for (const sql of INDEXES) {
      await this.db.execAsync(sql);
    }
    
    console.log('[DB] Tables and indexes created');
  }

  /**
   * Reset database (for development/testing)
   * WARNING: Deletes all data!
   */
  async reset(): Promise<void> {
    console.log('[DB] Resetting database...');
    
    // Disable foreign keys to allow cascade delete
    await this.db.execAsync('PRAGMA foreign_keys = OFF;');
    
    // Drop tables in reverse dependency order
    await this.db.execAsync('DROP TABLE IF EXISTS prices;');
    await this.db.execAsync('DROP TABLE IF EXISTS list_items;');
    await this.db.execAsync('DROP TABLE IF EXISTS stores;');
    await this.db.execAsync('DROP TABLE IF EXISTS products;');
    await this.db.execAsync('DROP TABLE IF EXISTS lists;');
    await this.db.execAsync('DROP TABLE IF EXISTS schema_version;');
    
    await this.db.execAsync('PRAGMA foreign_keys = ON;');
    
    console.log('[DB] Database reset complete');
  }
}

/**
 * Open and migrate database
 */
export async function openDatabase(): Promise<SQLite.SQLiteDatabase> {
  const db = await SQLite.openDatabaseAsync('compraja.db');
  
  // Enable WAL mode for better performance
  await db.execAsync('PRAGMA journal_mode = WAL;');
  
  // Run migrations
  const runner = new MigrationRunner(db);
  await runner.migrate();
  
  return db;
}
