import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { outcomeDetail2Model } from '../model/outcomeDetail2-model';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
  })
  export class OutcomeDetail2Service {
    url=environment.apiUrl

    constructor(private httpClient: HttpClient){

    }

    //servicio get
    getAllOutcomeDetails(): Observable<outcomeDetail2Model[]>{
        const headers=new HttpHeaders().set('ngrok-skip-browser-warning', 'true');
        return this.httpClient.get<outcomeDetail2Model[]>(this.url+'/outcomeDetail'+'/get',{headers});
    }

    //servicio add
    saveOutcomeDetail(request: any): Observable<any>{
        return this.httpClient.post<any>(this.url+'/outcomeDetail'+'/add', request)
        .pipe(map(res=>res));
    }

    //servicio update
    updateOutcomeDetail(request: any): Observable<any>{
        return this.httpClient.post<any>(this.url+'/outcomeDetail'+'/update', request)
        .pipe(map(res=>res));
    }

    //servicio delete
    deleteOutcomeDetail(id: number): Observable<any>{
        return this.httpClient.post<any>(this.url+'/outcomeDetail'+'/delete/'+id, Request)
        .pipe(map(res=>res));
    }

    //servicio getById

    getById(id: any){
        return this.httpClient.post<any>(this.url+'outcomeDetail'+'/get/'+id, Request)
        .pipe(map(res=>res));
    }
    


  }