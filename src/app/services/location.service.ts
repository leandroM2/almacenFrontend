import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocationModel } from '../model/location-model';
import { Observable, throwError} from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  url = environment.apiUrl

  constructor(private httpClient: HttpClient) { 

  }
  //servicio de lista

  // getLocation(): Observable<LocationModel[]>{
  //   return this.httpClient.get<LocationModel[]>(this.url+'/location'+'/get')
  //   .pipe(map(res=>res));
  // }

  getLocation(): Observable<LocationModel[]> {
    const headers = new HttpHeaders().set('ngrok-skip-browser-warning', 'true');
    return this.httpClient.get<LocationModel[]>(this.url+'/location'+'/get', { headers });
  }

  // getLocation(): Observable<LocationModel[]> {
  //   return this.httpClient.get<LocationModel[]>('http://localhost:8082/location/get')
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

  saveLocation(request: any): Observable<any>{
    return this.httpClient.post<any>(this.url+'/location'+'/add', request)
    .pipe(map(res=>res));
  }

  //servicio de actualizar

  updateLocation(request: any): Observable<any>{
    return this.httpClient.post<any>(this.url+'/location'+'/update', request)
    .pipe(map(res=>res));
  }

  //servicio de eliminar

  deleteLocation(id: number): Observable<any>{
    return this.httpClient.post<any>(this.url+'/location'+'/delete/'+id, Request)
    .pipe(map(res=>res));
  }

}
