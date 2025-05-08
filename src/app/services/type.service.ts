import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TypeModel } from '../model/type-model';
import { Observable, throwError} from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TypeService {
  url = environment.apiUrl

  constructor(private httpClient: HttpClient) { 

  }
  //servicio de lista

  // getType(): Observable<TypeModel[]>{
  //   return this.httpClient.get<TypeModel[]>(this.url+'/type'+'/get')
  //   .pipe(map(res=>res));
  // }

  getType(): Observable<TypeModel[]> {
    const headers = new HttpHeaders().set('ngrok-skip-browser-warning', 'true');
    return this.httpClient.get<TypeModel[]>(this.url+'/type'+'/get', { headers });
  }

  // getType(): Observable<TypeModel[]> {
  //   return this.httpClient.get<TypeModel[]>('http://localhost:8082/type/get')
  //     .pipe(
  //       map(res => res),
  //       catchError(this.handleError)
  //     );
  // }

  // private handleError(error: HttpErrorResponse): Observable<never> {
  //   let errorMessage = 'An unknown error occurred!';
  //   if (error.error instanceof ErrorEvent) {
  //     // Client-side errors
  //     errorMessage = `Error: ${error.error.message}`;
  //   } else {
  //     // Server-side errors
  //     if (error.status === 401) {
  //       errorMessage = `Error ${error.status}: ${error.error.mensaje}`;
  //     } else {
  //       errorMessage = `Error ${error.status}: ${error.message}`;
  //     }
  //   }
  //   console.error('An error occurred:', errorMessage);
  //   return throwError(errorMessage);
  // }
   //servicio de guardar

  saveType(request: any): Observable<any>{
    return this.httpClient.post<any>(this.url+'/type'+'/add', request)
    .pipe(map(res=>res));
  }

  //servicio de actualizar

  updateType(request: any): Observable<any>{
    return this.httpClient.post<any>(this.url+'/type'+'/update', request)
    .pipe(map(res=>res));
  }

  //servicio de eliminar

  deleteType(id: number): Observable<any>{
    return this.httpClient.post<any>(this.url+'/type'+'/delete/'+id, Request)
    .pipe(map(res=>res));
  }

}
