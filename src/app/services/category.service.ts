import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CategoryModel } from '../model/category-model';
import { Observable, throwError} from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  url = environment.apiUrl

  constructor(private httpClient: HttpClient) { 

  }
  //servicio de lista

  // getCategory(): Observable<CategoryModel[]>{
  //   return this.httpClient.get<CategoryModel[]>(this.url+'/category'+'/get')
  //   .pipe(map(res=>res));
  // }

  getCategory(): Observable<CategoryModel[]> {
    const headers = new HttpHeaders().set('ngrok-skip-browser-warning', 'true');
    return this.httpClient.get<CategoryModel[]>(this.url+'/category'+'/get', { headers });
  }

  // getCategory(): Observable<CategoryModel[]> {
  //   return this.httpClient.get<CategoryModel[]>('http://localhost:8082/category/get')
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

  saveCategory(request: any): Observable<any>{
    return this.httpClient.post<any>(this.url+'/category'+'/add', request)
    .pipe(map(res=>res));
  }

  //servicio de actualizar

  updateCategory(request: any): Observable<any>{
    return this.httpClient.post<any>(this.url+'/category'+'/update', request)
    .pipe(map(res=>res));
  }

  //servicio de eliminar

  deleteCategory(id: number): Observable<any>{
    return this.httpClient.post<any>(this.url+'/category'+'/delete/'+id, Request)
    .pipe(map(res=>res));
  }

}
