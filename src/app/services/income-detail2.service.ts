import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { incomeDetail2Model } from '../model/incomeDetail2-model';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
  })
  export class IncomeDetail2Service{
  url = environment.apiUrl

  constructor(private httpClient: HttpClient) { 

  }


  getIncomeDetail(): Observable<incomeDetail2Model[]>{
    const headers = new HttpHeaders().set('ngrok-skip-browser-warning', 'true');
    return this.httpClient.get<incomeDetail2Model[]>(this.url+'/incomeDetail'+'/get', { headers });
  }

  saveIncomeDetail(request: any): Observable<any>{
    return this.httpClient.post<any>(this.url+'/incomeDetail'+'/add', request)
    .pipe(map(res=>res));
  }

  updateIncomeDetail(request: any): Observable<any>{
    return this.httpClient.post<any>(this.url+'/incomeDetail'+'/update', request)
    .pipe(map(res=>res));
  }

  deleteIncomeDetail(id: number): Observable<any>{
    return this.httpClient.post<any>(this.url+'/incomeDetail'+'/delete/'+id, Request)
    .pipe(map(res=>res));
  }

  }