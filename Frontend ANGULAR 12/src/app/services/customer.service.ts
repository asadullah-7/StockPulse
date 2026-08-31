import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'; // 👈 Dynamic environment import

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  // Base URL environment file se le raha hai 🌐
  private apiUrl = `${environment.baseUrl}/Customers`;

  constructor(private http: HttpClient) {}

  // 1. Get All Customers
  getCustomers(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  // 2. Get Single Customer by ID
  getCustomerById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // 3. Create New Customer
  createCustomer(customer: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, customer);
  }

  // 4. Update Customer
  updateCustomer(id: number, customer: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, customer);
  }

  // 5. Delete Customer
  deleteCustomer(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}