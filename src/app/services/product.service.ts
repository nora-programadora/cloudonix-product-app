import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ProductService {
 private apiUrl = 'http://rest-items.research.cloudonix.io/items';

  constructor(private http: HttpClient) {}

  getProducts(authKey: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${authKey}`);
    return this.http.get(this.apiUrl, { headers });
  }

  deleteProduct(id: number, authKey: string): Observable<void> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${authKey}`);
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
  }

  getProductById(id: string, authKey: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${authKey}`);
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers });
  }
  
  addProduct(productData: any, authKey: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${authKey}`);
    return this.http.post<any>(this.apiUrl, productData, { headers });
  }

  updateProduct(id: number, productData: any, authKey: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${authKey}`);
    return this.http.patch<any>(`${this.apiUrl}/${id}`, productData, { headers });
  }
}
