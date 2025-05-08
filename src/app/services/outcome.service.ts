import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { outcomeModel } from '../model/outcome-model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OutcomeService {

  url = environment.apiUrl

  constructor(private httpClient: HttpClient) { 

  }
  //servicio de lista

  // getOutcome(): Observable<outcomeModel[]>{
  //   return this.httpClient.get<outcomeModel[]>(this.url+'/outcome'+'/get')
  //   .pipe(map(res=>res));
  // }

  getOutcome(): Observable<outcomeModel[]> {
    const headers = new HttpHeaders().set('ngrok-skip-browser-warning', 'true');
    return this.httpClient.get<outcomeModel[]>(this.url+'/outcome'+'/get', { headers });
  }

   //servicio de guardar

  saveOutcome(request: any): Observable<any>{
    return this.httpClient.post<any>(this.url+'/outcome'+'/add', request)
    .pipe(map(res=>res));
  }

  //servicio de actualizar

  updateOutcome(request: any): Observable<any>{
    return this.httpClient.post<any>(this.url+'/outcome'+'/update', request)
    .pipe(map(res=>res));
  }

  //servicio de eliminar

  deleteOutcome(id: number): Observable<any>{
    return this.httpClient.post<any>(this.url+'/outcome'+'/delete/'+id, Request)
    .pipe(map(res=>res));
  }

  //servicio de seleccionar

  getOutcomeByid(id: number): Observable<any>{
    return this.httpClient.post<any>(this.url+'/outcome'+'/get/'+id, Request)
    .pipe(map(res=>res));
  }

  //servicio de autorizar

  AuthOutcome(id: number): Observable<any>{
    return this.httpClient.post<any>(this.url+'/outcome'+'/auth/'+id, Request)
    .pipe(map(res=>res));
  }

}
