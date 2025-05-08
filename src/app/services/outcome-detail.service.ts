import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { outcomeDetailModel } from '../model/outcomeDetail-model';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OutcomeDetailService {

  url = environment.apiUrl
  
  constructor(private httpClient: HttpClient) { 

  }
  //servicio de lista

  // getOutcomeDetail(): Observable<outcomeDetailModel[]>{
  //   return this.httpClient.get<outcomeDetailModel[]>(this.url+'/outcomeDetail'+'/get')
  //   .pipe(map(res=>res));
  // }

  getOutcomeDetail(): Observable<outcomeDetailModel[]> {
    const headers = new HttpHeaders().set('ngrok-skip-browser-warning', 'true');
    return this.httpClient.get<outcomeDetailModel[]>(this.url+'/outcomeDetail'+'/get', { headers });
  }

   //servicio de guardar

  saveOutcomeDetail(request: any): Observable<any>{
    return this.httpClient.post<any>(this.url+'/outcomeDetail'+'/add', request)
    .pipe(map(res=>res));
  }

  //servicio de actualizar

  updateOutcomeDetail(request: any): Observable<any>{
    return this.httpClient.post<any>(this.url+'/outcomeDetail'+'/update', request)
    .pipe(map(res=>res));
  }

  //servicio de eliminar

  deleteOutcomeDetail(id: number): Observable<any>{
    return this.httpClient.post<any>(this.url+'/outcomeDetail'+'/delete/'+id, Request)
    .pipe(map(res=>res));
  }

  getOutDetailById(id: number): Observable<any>{
    return this.httpClient.post<any>(this.url+'/outcomeDetail'+'/get/'+id, Request)
    .pipe(map(res=>res));
  }
}
