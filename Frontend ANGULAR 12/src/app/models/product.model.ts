export interface Product {
  pid: number;
  name: string;
  price: number;
  qtyInStock: number;
  reOrderThreshold: number;
  categoryName?: string;
  brandName?: string;
  supplierName?: string;
}

export interface Category {
  catID: number;
  catName: string; // 👈 C# Model ke mutabiq
  catDescription?: string;
}

export interface Brand {
  brandID: number;
  name: string;
}

export interface Supplier {
  supplierID: number;
  name: string;
  phone?: string;
  dealsIn?: string;
}