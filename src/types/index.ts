// Type definitions for the app
export interface Product {
  id: string;
  name: string;
  quantity?: number;
  checked?: boolean;
}

export interface Store {
  id: string;
  name: string;
}

export interface Price {
  id: string;
  productId: string;
  storeId: string;
  price: number;
  date: Date;
}
