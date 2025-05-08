import { HttpClient, HttpErrorResponse, HttpEvent, HttpEventType, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserModel } from '../model/user-model';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  url = environment.apiUrl

  constructor(private httpClient: HttpClient) { }
  
  registrarse(data:any){
    return this.httpClient.post(this.url+"/user/add",
    data,{headers:new HttpHeaders().set('Content-Type','application/json')})
  }

 iniciarSesion(data:any){
    return this.httpClient.post(this.url+"/user/iniciarSesion",
    data,{headers:new HttpHeaders().set('Content-Type','application/json')})
  }

  //Traertoken(request: any): Observable<any>{
    //return this.httpClient.post<any>('http://localhost:8082/user/'+'/iniciarSesion', request)
    //.pipe(map(res=>res));
  //}

//  getUser(): Observable<UserModel[]>{
//     return this.httpClient.get<UserModel[]>(this.url+'/user'+'/get')
//     .pipe(map(res=>res));
//   }

  getUser(): Observable<UserModel[]> {
    const headers = new HttpHeaders().set('ngrok-skip-browser-warning', 'true');
    return this.httpClient.get<UserModel[]>(this.url+'/user'+'/get', { headers });
  }

  saveUser(request: any): Observable<any>{
    return this.httpClient.post<any>(this.url+'/user'+'/add', request)
    .pipe(map(res=>res));
  }

  updateUser(request: any): Observable<any>{
    return this.httpClient.post<any>(this.url+'/user'+'/update', request)
    .pipe(map(res=>res));
  }

  deleteUser(id: number): Observable<any>{
    return this.httpClient.post<any>(this.url+'/user'+'/delete/'+id, Request)
    .pipe(map(res=>res));
  }

  authUser(id: number): Observable<any>{
    return this.httpClient.post<any>(this.url+'/user'+'/auth/'+id, Request)
    .pipe(map(res=>res));
  }

  //servicio de subir arhivo

  uploadFile(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file);

    const req = new HttpRequest('POST', this.url+"/user/upload", formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.httpClient.request(req).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(`Error: ${error.message}`);
  }

  //servicio de eliminar firma

  deletefirma(id: string): Observable<any>{
    return this.httpClient.post<any>(this.url+'/user'+'/delfile/'+id, Request)
    .pipe(map(res=>res));
  }

}
