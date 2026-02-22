/**
 * List Item Repository
 * 
 * CRUD operations for list items (products in shopping lists)
 */

import * as SQLite from 'expo-sqlite';
import { ListItem, ListItemCreate, ListItemUpdate } from '../types';

export class ListItemRepository {
  constructor(private db: SQLite.SQLiteDatabase) {}

  /**
   * Get all items in a list
   */
  async findByListId(listId: number): Promise<ListItem[]> {
    return await db.getAllAsync<ListItem>(
      'SELECT * FROM list_items WHERE list_id = ? ORDER BY created_at ASC',
      [listId]
    );
  }

  /**
   * Get item by ID
   */
  async findById(id: number): Promise<ListItem | null> {
    return await db.getFirstAsync<ListItem>(
      'SELECT * FROM list_items WHERE id = ?',
      [id]
    );
  }

  /**
   * Create new list item
   */
  async create(data: ListItemCreate): Promise<number> {
    const result = await db.runAsync(
      'INSERT INTO list_items (list_id, product_id, qty, note, checked) VALUES (?, ?, ?, ?, ?)',
      [
        data.list_id,
        data.product_id ?? null,
        data.qty ?? 1,
        data.note ?? null,
        data.checked ? 1 : 0
      ]
    );
    return result.lastInsertRowId;
  }

  /**
   * Update list item
   */
  async update(id: number, data: ListItemUpdate): Promise<void> {
    const fields: string[] = [];
    const values: (string | number | null)[] = [];

    if (data.qty !== undefined) {
      fields.push('qty = ?');
      values.push(data.qty);
    }
    if (data.note !== undefined) {
      fields.push('note = ?');
      values.push(data.note);
    }
    if (data.checked !== undefined) {
      fields.push('checked = ?');
      values.push(data.checked ? 1 : 0);
    }
    if (data.product_id !== undefined) {
      fields.push('product_id = ?');
      values.push(data.product_id);
    }

    if (fields.length === 0) return;

    fields.push("updated_at = datetime('now')");
    values.push(id);

    await db.runAsync(
      `UPDATE list_items SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
  }

  /**
   * Toggle checked status
   */
  async toggleChecked(id: number): Promise<void> {
    await db.runAsync(
      "UPDATE list_items SET checked = NOT checked, updated_at = datetime('now') WHERE id = ?",
      [id]
    );
  }

  /**
   * Delete list item
   */
  async delete(id: number): Promise<void> {
    await db.runAsync('DELETE FROM list_items WHERE id = ?', [id]);
  }

  /**
   * Delete all items in a list
   */
  async deleteByListId(listId: number): Promise<void> {
    await db.runAsync('DELETE FROM list_items WHERE list_id = ?', [listId]);
  }

  /**
   * Get items with product details
   */
  async findWithProducts(listId: number): Promise<(ListItem & { product_name: string | null; product_barcode: string | null })[]> {
    return await db.getAllAsync<ListItem & { product_name: string | null; product_barcode: string | null }>(
      `SELECT li.*, p.name as product_name, p.barcode as product_barcode
       FROM list_items li
       LEFT JOIN products p ON p.id = li.product_id
       WHERE li.list_id = ?
       ORDER BY li.created_at ASC`,
      [listId]
    );
  }
}
