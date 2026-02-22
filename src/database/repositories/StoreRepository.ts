/**
 * Store Repository
 * 
 * CRUD operations for stores
 */

import * as SQLite from 'expo-sqlite';
import { Store, StoreCreate, StoreUpdate } from '../types';

export class StoreRepository {
  constructor(private db: SQLite.SQLiteDatabase) {}

  /**
   * Get all stores ordered by name
   */
  async findAll(): Promise<Store[]> {
    return await db.getAllAsync<Store>(
      'SELECT * FROM stores ORDER BY name ASC'
    );
  }

  /**
   * Get store by ID
   */
  async findById(id: number): Promise<Store | null> {
    return await db.getFirstAsync<Store>(
      'SELECT * FROM stores WHERE id = ?',
      [id]
    );
  }

  /**
   * Find store by name
   */
  async findByName(name: string): Promise<Store | null> {
    return await db.getFirstAsync<Store>(
      'SELECT * FROM stores WHERE name = ?',
      [name]
    );
  }

  /**
   * Search stores by name (partial match)
   */
  async search(query: string): Promise<Store[]> {
    return await db.getAllAsync<Store>(
      'SELECT * FROM stores WHERE name LIKE ? ORDER BY name ASC LIMIT 20',
      [`%${query}%`]
    );
  }

  /**
   * Create new store
   */
  async create(data: StoreCreate): Promise<number> {
    const result = await db.runAsync(
      'INSERT INTO stores (name) VALUES (?)',
      [data.name]
    );
    return result.lastInsertRowId;
  }

  /**
   * Update store
   */
  async update(id: number, data: StoreUpdate): Promise<void> {
    if (data.name === undefined) return;

    await db.runAsync(
      "UPDATE stores SET name = ?, updated_at = datetime('now') WHERE id = ?",
      [data.name, id]
    );
  }

  /**
   * Delete store
   */
  async delete(id: number): Promise<void> {
    await db.runAsync('DELETE FROM stores WHERE id = ?', [id]);
  }
}
