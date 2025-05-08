import { Injectable } from '@angular/core';
import { KardexModel } from '../model/kardex-model';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { archivesModel } from '../model/archives-model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class KardexService {

  url = environment.apiUrl

    constructor(private httpClient: HttpClient) { 

  }
  //servicio de lista

  // getKardex(): Observable<KardexModel[]>{
  //   return this.httpClient.get<KardexModel[]>(this.url+'/kardex'+'/get')
  //   .pipe(map(res=>res));
  // }

  getKardex(): Observable<KardexModel[]> {
    const headers = new HttpHeaders().set('ngrok-skip-browser-warning', 'true');
    return this.httpClient.get<KardexModel[]>(this.url+'/kardex'+'/get', { headers });
  }

   //servicio de guardar

  saveKardex(request: any): Observable<any>{
    return this.httpClient.post<any>(this.url+'/kardex'+'/add', request)
    .pipe(map(res=>res));
  }

  //servicio de lista de entradas

  // getInKardex(): Observable<KardexModel[]>{
  //   return this.httpClient.get<KardexModel[]>(this.url+'/kardex'+'/get/in')
  //   .pipe(map(res=>res));
  // }

  getInKardex(): Observable<KardexModel[]> {
    const headers = new HttpHeaders().set('ngrok-skip-browser-warning', 'true');
    return this.httpClient.get<KardexModel[]>(this.url+'/kardex'+'/get/in', { headers });
  }

  //servicio de lista de salidas

  // getOutKardex(): Observable<KardexModel[]>{
  //   return this.httpClient.get<KardexModel[]>(this.url+'/kardex'+'/get/out')
  //   .pipe(map(res=>res));
  // }
  getOutKardex(): Observable<KardexModel[]> {
    const headers = new HttpHeaders().set('ngrok-skip-browser-warning', 'true');
    return this.httpClient.get<KardexModel[]>(this.url+'/kardex'+'/get/out', { headers });
  }


   //servicio de encontrar por id

  //  GetByIdKardex(id: string): Observable<any>{
  //   return this.httpClient.get<any>(this.url+'/kardex'+'/get/'+id)
  //   .pipe(map(res=>res));
  // }

  GetByIdKardex(id: string): Observable<any> {
    const headers = new HttpHeaders().set('ngrok-skip-browser-warning', 'true');
    return this.httpClient.get<any>(this.url+'/kardex'+'/get/'+id, { headers });
  }

  //servicio de autorizar

  AuthKardex(id: string): Observable<any>{
    return this.httpClient.post<any>(this.url+'/kardex'+'/auth/'+id, Request)
    .pipe(map(res=>res));
  }
//servicio de archivos
  ArchivesKardex(id: string): Observable<any>{
    return this.httpClient.post<any>(this.url+'/kardex'+'/file/'+id, Request)
    .pipe(map(res=>res));
  }

//servicio de descargar
//arreglar para la api de leandro
getDownloadArchives(id: string): Observable<Blob> {
  const url2 = this.url+'/archives'+'/descargar/'+id;
  const headers = new HttpHeaders().set('ngrok-skip-browser-warning', 'true');
  return this.httpClient.get(url2,{ headers ,responseType: 'blob' }).pipe(
    map(response => {
      return new Blob([response], { type: 'application/pdf' });
    }),
    catchError(error => {
      console.error('Error downloading file', error);
      return throwError(error);
    })
  );
}
}


