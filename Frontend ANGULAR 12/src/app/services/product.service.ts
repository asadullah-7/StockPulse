import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment'; // 👈 Dynamic environment import

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = environment.baseUrl; // 👈 Live / Configurable Base URL

  constructor(private http: HttpClient) {}

  // --- PRODUCTS ---
  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/products`);
  }

  createProduct(productData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/products`, productData);
  }

  updateProduct(id: number, productData: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/products/${id}`, productData);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/products/${id}`);
  }

  // --- CATEGORIES ---
  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/categories`);
  }

  createCategory(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/categories`, data);
  }

  updateCategory(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/categories/${id}`, data);
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/categories/${id}`);
  }

  // --- BRANDS ---
  getBrands(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/brands`);
  }

  createBrand(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/brands`, data);
  }

  updateBrand(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/brands/${id}`, data);
  }

  deleteBrand(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/brands/${id}`);
  }

  // --- SUPPLIERS ---
  getSuppliers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/suppliers`);
  }

  createSupplier(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/suppliers`, data);
  }

  updateSupplier(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/suppliers/${id}`, data);
  }

  deleteSupplier(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/suppliers/${id}`);
  }

  // --- CUSTOMERS ---
  getCustomers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/customers`);
  }

  createCustomer(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/customers`, data);
  }

  updateCustomer(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/customers/${id}`, data);
  }

  deleteCustomer(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/customers/${id}`);
  }

  // --- ORDERS / INVOICING ---
  getOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/orders`);
  }

  getOrderById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/orders/${id}`);
  }

  createOrder(orderPayload: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/orders`, orderPayload);
  }

  deleteOrder(orderId: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/orders/${orderId}`);
  }

  // --- DASHBOARD ---
  getDashboardStats(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/dashboard/summary`);
  }

  // --- REPORTS ---
  getSalesReport(startDate?: string, endDate?: string): Observable<any> {
    let url = `${this.baseUrl}/reports/sales`;
    if (startDate && endDate) {
      url += `?startDate=${startDate}&endDate=${endDate}`;
    }
    return this.http.get<any>(url);
  }

  getStockReport(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/reports/stock`);
  }
}