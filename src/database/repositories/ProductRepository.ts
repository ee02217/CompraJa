/**
 * Product Repository
 * 
 * CRUD operations for products
 */

import * as SQLite from 'expo-sqlite';
import { Product, ProductCreate, ProductUpdate } from '../types';

export class ProductRepository {
  constructor(private db: SQLite.SQLiteDatabase) {}

  /**
   * Get all products ordered by name
   */
  async findAll(): Promise<Product[]> {
    return await db.getAllAsync<Product>(
      'SELECT * FROM products ORDER BY name ASC'
    );
  }

  /**
   * Get product by ID
   */
  async findById(id: number): Promise<Product | null> {
    return await db.getFirstAsync<Product>(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );
  }

  /**
   * Find product by barcode
   */
  async findByBarcode(barcode: string): Promise<Product | null> {
    return await db.getFirstAsync<Product>(
      'SELECT * FROM products WHERE barcode = ?',
      [barcode]
    );
  }

  /**
   * Search products by name (partial match)
   */
  async search(query: string): Promise<Product[]> {
    return await db.getAllAsync<Product>(
      'SELECT * FROM products WHERE name LIKE ? ORDER BY name ASC LIMIT 20',
      [`%${query}%`]
    );
  }

  /**
   * Create new product
   */
  async create(data: ProductCreate): Promise<number> {
    const result = await db.runAsync(
      'INSERT INTO products (barcode, name, brand, category) VALUES (?, ?, ?, ?)',
      [data.barcode ?? null, data.name, data.brand ?? null, data.category ?? null]
    );
    return result.lastInsertRowId;
  }

  /**
   * Update product
   */
  async update(id: number, data: ProductUpdate): Promise<void> {
    const fields: string[] = [];
    const values: (string | number | null)[] = [];

    if (data.barcode !== undefined) {
      fields.push('barcode = ?');
      values.push(data.barcode);
    }
    if (data.name !== undefined) {
      fields.push('name = ?');
      values.push(data.name);
    }
    if (data.brand !== undefined) {
      fields.push('brand = ?');
      values.push(data.brand);
    }
    if (data.category !== undefined) {
      fields.push('category = ?');
      values.push(data.category);
    }

    if (fields.length === 0) return;

    fields.push("updated_at = datetime('now')");
    values.push(id);

    await db.runAsync(
      `UPDATE products SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
  }

  /**
   * Delete product
   */
  async delete(id: number): Promise<void> {
    await db.runAsync('DELETE FROM products WHERE id = ?', [id]);
  }

  /**
   * Get product with latest price
   */
  async findWithLatestPrice(id: number): Promise<(Product & { latest_price: number | null }) | null> {
    return await db.getFirstAsync<Product & { latest_price: number | null }>(
      `SELECT p.*, 
              (SELECT price_cents FROM prices WHERE product_id = p.id ORDER BY captured_at DESC LIMIT 1) as latest_price
       FROM products p 
       WHERE p.id = ?`,
      [id]
    );
  }
}
