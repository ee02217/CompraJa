/**
 * Price Repository
 * 
 * CRUD operations for prices (product prices at stores)
 */

import * as SQLite from 'expo-sqlite';
import { Price, PriceCreate, PriceUpdate } from '../types';

export class PriceRepository {
  constructor(private db: SQLite.SQLiteDatabase) {}

  /**
   * Get all prices
   */
  async findAll(): Promise<Price[]> {
    return await db.getAllAsync<Price>(
      'SELECT * FROM prices ORDER BY captured_at DESC'
    );
  }

  /**
   * Get price by ID
   */
  async findById(id: number): Promise<Price | null> {
    return await db.getFirstAsync<Price>(
      'SELECT * FROM prices WHERE id = ?',
      [id]
    );
  }

  /**
   * Get prices for a product
   */
  async findByProduct(productId: number): Promise<Price[]> {
    return await db.getAllAsync<Price>(
      'SELECT * FROM prices WHERE product_id = ? ORDER BY captured_at DESC',
      [productId]
    );
  }

  /**
   * Get prices for a store
   */
  async findByStore(storeId: number): Promise<Price[]> {
    return await db.getAllAsync<Price>(
      'SELECT * FROM prices WHERE store_id = ? ORDER BY captured_at DESC',
      [storeId]
    );
  }

  /**
   * Get latest price for a product at a store
   */
  async findLatest(productId: number, storeId: number): Promise<Price | null> {
    return await db.getFirstAsync<Price>(
      'SELECT * FROM prices WHERE product_id = ? AND store_id = ? ORDER BY captured_at DESC LIMIT 1',
      [productId, storeId]
    );
  }

  /**
   * Create new price record
   */
  async create(data: PriceCreate): Promise<number> {
    const result = await db.runAsync(
      'INSERT INTO prices (product_id, store_id, price_cents, currency, photo_uri) VALUES (?, ?, ?, ?, ?)',
      [data.product_id, data.store_id, data.price_cents, data.currency ?? 'EUR', data.photo_uri ?? null]
    );
    return result.lastInsertRowId;
  }

  /**
   * Update price record
   */
  async update(id: number, data: PriceUpdate): Promise<void> {
    const fields: string[] = [];
    const values: (string | number | null)[] = [];

    if (data.price_cents !== undefined) {
      fields.push('price_cents = ?');
      values.push(data.price_cents);
    }
    if (data.currency !== undefined) {
      fields.push('currency = ?');
      values.push(data.currency);
    }
    if (data.photo_uri !== undefined) {
      fields.push('photo_uri = ?');
      values.push(data.photo_uri);
    }

    if (fields.length === 0) return;

    values.push(id);

    await db.runAsync(
      `UPDATE prices SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
  }

  /**
   * Delete price record
   */
  async delete(id: number): Promise<void> {
    await db.runAsync('DELETE FROM prices WHERE id = ?', [id]);
  }

  /**
   * Get price history with product and store info
   */
  async findWithDetails(productId?: number, storeId?: number): Promise<(Price & { product_name: string; store_name: string })[]> {
    let query = `
      SELECT p.*, pr.name as product_name, s.name as store_name
      FROM prices p
      JOIN products pr ON pr.id = p.product_id
      JOIN stores s ON s.id = p.store_id
    `;
    
    const conditions: string[] = [];
    const params: number[] = [];
    
    if (productId !== undefined) {
      conditions.push('p.product_id = ?');
      params.push(productId);
    }
    if (storeId !== undefined) {
      conditions.push('p.store_id = ?');
      params.push(storeId);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' ORDER BY p.captured_at DESC';
    
    return await db.getAllAsync<Price & { product_name: string; store_name: string }>(query, params);
  }
}
