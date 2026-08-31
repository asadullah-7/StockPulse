import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment'; // 👈 Dynamic environment import

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  // Environment file se live ya local URL dynamically extract hoga
  private baseUrl = `${environment.baseUrl}/Suppliers`; 

  constructor(private http: HttpClient) {}

  getSuppliers(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  getSupplierById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  createSupplier(supplier: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, supplier);
  }

  updateSupplier(id: number, supplier: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, supplier);
  }

  deleteSupplier(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }
}