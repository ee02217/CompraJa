/**
 * Shopping List Repository
 * 
 * CRUD operations for shopping lists
 */

import * as SQLite from 'expo-sqlite';
import { List, ListCreate, ListUpdate } from './types';

export class ListRepository {
  constructor(private db: SQLite.SQLiteDatabase) {}

  /**
   * Get all lists ordered by updated_at DESC
   */
  async findAll(): Promise<List[]> {
    return await db.getAllAsync<List>(
      'SELECT * FROM lists ORDER BY updated_at DESC'
    );
  }

  /**
   * Get list by ID
   */
  async findById(id: number): Promise<List | null> {
    return await db.getFirstAsync<List>(
      'SELECT * FROM lists WHERE id = ?',
      [id]
    );
  }

  /**
   * Create new list
   */
  async create(data: ListCreate): Promise<number> {
    const result = await db.runAsync(
      'INSERT INTO lists (name) VALUES (?)',
      [data.name]
    );
    return result.lastInsertRowId;
  }

  /**
   * Update list
   */
  async update(id: number, data: ListUpdate): Promise<void> {
    const fields: string[] = [];
    const values: (string | number)[] = [];

    if (data.name !== undefined) {
      fields.push('name = ?');
      values.push(data.name);
    }

    if (fields.length === 0) return;

    fields.push("updated_at = datetime('now')");
    values.push(id);

    await db.runAsync(
      `UPDATE lists SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
  }

  /**
   * Delete list (cascade deletes list_items)
   */
  async delete(id: number): Promise<void> {
    await db.runAsync('DELETE FROM lists WHERE id = ?', [id]);
  }

  /**
   * Get list with item count
   */
  async findWithCount(id: number): Promise<(List & { item_count: number }) | null> {
    return await db.getFirstAsync<List & { item_count: number }>(
      `SELECT l.*, COUNT(li.id) as item_count 
       FROM lists l 
       LEFT JOIN list_items li ON li.list_id = l.id 
       WHERE l.id = ? 
       GROUP BY l.id`,
      [id]
    );
  }
}
