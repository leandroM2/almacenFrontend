import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { CardModel } from '../model/card-model';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  constructor(private httpClient: HttpClient) { 

  }
  //servicio de lista

  getCards(): Observable<CardModel[]>{
    return this.httpClient.get<CardModel[]>('http://localhost:9001/api/v1/card'+'/list')
    .pipe(map(res=>res));
  }

   //servicio de guardar

  saveCard(request: any): Observable<any>{
    return this.httpClient.post<any>('http://localhost:9001/api/v1/card'+'/save', request)
    .pipe(map(res=>res));
  }

  //servicio de actualizar

  updateCard(request: any): Observable<any>{
    return this.httpClient.post<any>('http://localhost:9001/api/v1/card'+'/update', request)
    .pipe(map(res=>res));
  }

  //servicio de eliminar

  deleteCard(id: number): Observable<any>{
    return this.httpClient.get<any>('http://localhost:9001/api/v1/card'+'/delete/'+id)
    .pipe(map(res=>res));
  }



}
