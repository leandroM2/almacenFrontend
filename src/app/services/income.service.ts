import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { incomeModel } from '../model/income-model';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IncomeService {

  url = environment.apiUrl
  constructor(private httpClient: HttpClient) { 

  }
  //servicio de lista

  // getIncome(): Observable<incomeModel[]>{
  //   return this.httpClient.get<incomeModel[]>(this.url+'/income'+'/get')
  //   .pipe(map(res=>res));
  // }

  getIncome(): Observable<incomeModel[]> {
    const headers = new HttpHeaders().set('ngrok-skip-browser-warning', 'true');
    return this.httpClient.get<incomeModel[]>(this.url+'/income'+'/get', { headers });
  }

   //servicio de guardar

  saveIncome(request: any): Observable<any>{
    return this.httpClient.post<any>(this.url+'/income'+'/add', request)
    .pipe(map(res=>res));
  }

  //servicio de actualizar

  updateIncome(request: any): Observable<any>{
    return this.httpClient.post<any>(this.url+'/income'+'/update', request)
    .pipe(map(res=>res));
  }

  //servicio de eliminar

  deleteIncome(id: number): Observable<any>{
    return this.httpClient.post<any>(this.url+'/income'+'/delete/'+id, Request)
    .pipe(map(res=>res));
  }

   //servicio de autorizar

   AuthIncome(id: number): Observable<any>{
    return this.httpClient.post<any>(this.url+'/income'+'/auth/'+id, Request)
    .pipe(map(res=>res));
  }
}
