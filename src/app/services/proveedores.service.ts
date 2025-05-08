import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SupplierModel } from '../model/proveedores_model';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SupplierBModel } from '../model/supplier-model';

@Injectable({
  providedIn: 'root'
})
export class ProveedoresService {
  url = environment.apiUrl

  constructor(private httpClient: HttpClient) { 

  }
  //servicio de lista

  // getSuppliers(): Observable<SupplierModel[]>{
  //   return this.httpClient.get<SupplierModel[]>(this.url+'/supplier'+'/get')
  //   .pipe(map(res=>res));
  // }

  getSuppliers(): Observable<SupplierModel[]> {
    const headers = new HttpHeaders().set('ngrok-skip-browser-warning', 'true');
    return this.httpClient.get<SupplierModel[]>(this.url+'/supplier'+'/get', { headers });
  }

  getSuppAcc(): Observable<SupplierBModel[]>{
    const headers = new HttpHeaders().set('ngrok-skip-browser-warning', 'true');
    return this.httpClient.get<SupplierBModel[]>(this.url+'/supplier'+'/getAcc', { headers });
  }

   //servicio de guardar

  saveSuppliers(request: any): Observable<any>{
    return this.httpClient.post<any>(this.url+'/supplier'+'/add', request)
    .pipe(map(res=>res));
  }

  //servicio de actualizar

  updateSuppliers(request: any): Observable<any>{
    return this.httpClient.post<any>(this.url+'/supplier'+'/update', request)
    .pipe(map(res=>res));
  }

  //servicio de eliminar

  deleteSuppliers(id: number): Observable<any>{
    return this.httpClient.post<any>(this.url+'/supplier'+'/delete/'+id, Request)
    .pipe(map(res=>res));
  }

  getByid(id: any){
    return this.httpClient.post<any>(this.url+'/supplier'+'/get/'+id, Request).pipe(map(res=>res));
   }

}
