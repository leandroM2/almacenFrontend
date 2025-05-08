import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { clientModel } from '../model/client-model';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  url = environment.apiUrl
  constructor(private httpClient: HttpClient) { 

  }
  //servicio de lista

  // getClients(): Observable<clientModel[]>{
  //   return this.httpClient.get<clientModel[]>(this.url+'/client'+'/get')
  //   .pipe(map(res=>res));
  // }
  getClients(): Observable<clientModel[]> {
    const headers = new HttpHeaders().set('ngrok-skip-browser-warning', 'true');
    return this.httpClient.get<clientModel[]>(this.url+'/client'+'/get', { headers });
  }

   //servicio de guardar

  saveClient(request: any): Observable<any>{
    return this.httpClient.post<any>(this.url+'/client'+'/add', request)
    .pipe(map(res=>res));
  }

  //servicio de actualizar

  updateClient(request: any): Observable<any>{
    return this.httpClient.post<any>(this.url+'/client'+'/update', request)
    .pipe(map(res=>res));
  }

  //servicio de eliminar

  deleteClient(id: number): Observable<any>{
    return this.httpClient.post<any>(this.url+'/client'+'/delete/'+id, Request)
    .pipe(map(res=>res));
  }

}
