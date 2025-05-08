import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { ProductModel } from '../model/productos_model';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  url = environment.apiUrl

  constructor(private httpClient: HttpClient) { 

  }
  //servicio de lista

  // getProducts(): Observable<ProductModel[]>{
  //   return this.httpClient.get<ProductModel[]>(this.url+'/product'+'/get')
  //   .pipe(map(res=>res));
  // }

  getProducts(): Observable<ProductModel[]> {
    const headers = new HttpHeaders().set('ngrok-skip-browser-warning', 'true');
    return this.httpClient.get<ProductModel[]>(this.url+'/product'+'/get', { headers });
  }
   //servicio de guardar

  saveProduct(request: any): Observable<any>{
    return this.httpClient.post<any>(this.url+'/product'+'/add', request)
    .pipe(map(res=>res));
  }

  //servicio de actualizar

  updateProduct(request: any): Observable<any>{
    return this.httpClient.post<any>(this.url+'/product'+'/update', request)
    .pipe(map(res=>res));
  }

  //servicio de eliminar

  deleteProduct(id: number): Observable<any>{
    return this.httpClient.post<any>(this.url+'/product'+'/delete/'+id, Request)
    .pipe(map(res=>res));
  }

  getByid(id: any){
    return this.httpClient.post<any>(this.url+'/product'+'/get/'+id, Request).pipe(map(res=>res));
   }

   getBySupplierId(supplierDetailId: any){
    return this.httpClient.post<any>(this.url+'/product'+'/get/sup/'+supplierDetailId, Request).pipe(map(res=>res));
  }
  
  //  getByid(id: number): Observable<any>{
  //   return this.httpClient.post<any>('http://localhost:8082/product'+'/get/'+id, Request).pipe(map(res=>res));
  //  }

}
