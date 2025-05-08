import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { incomeDetailModel } from '../model/incomeDetail-model';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IncomeDetailService {

  url = environment.apiUrl

  constructor(private httpClient: HttpClient) { 

  }
  //servicio de lista

  // getIncomeDetail(): Observable<incomeDetailModel[]>{
  //   return this.httpClient.get<incomeDetailModel[]>(this.url+'/incomeDetail'+'/get')
  //   .pipe(map(res=>res));
  // }

  getIncomeDetail(): Observable<incomeDetailModel[]> {
    const headers = new HttpHeaders().set('ngrok-skip-browser-warning', 'true');
    return this.httpClient.get<incomeDetailModel[]>(this.url+'/incomeDetail'+'/get', { headers });
  }

   //servicio de guardar

  saveIncomeDetail(request: any): Observable<any>{
    return this.httpClient.post<any>(this.url+'/incomeDetail'+'/add', request)
    .pipe(map(res=>res));
  }

  //servicio de actualizar

  updateIncomeDetail(request: any): Observable<any>{
    return this.httpClient.post<any>(this.url+'/incomeDetail'+'/update', request)
    .pipe(map(res=>res));
  }

  //servicio de eliminar

  deleteIncomeDetail(id: number): Observable<any>{
    return this.httpClient.post<any>(this.url+'/incomeDetail'+'/delete/'+id, Request)
    .pipe(map(res=>res));
  }
}
