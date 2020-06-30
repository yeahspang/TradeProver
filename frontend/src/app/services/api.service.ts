import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Trade } from '../models/trade';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl: string;

  constructor(private http: HttpClient, @Inject('API_URL') apiUrl: string) {
    this.apiUrl = apiUrl;
  }

  public generateProof(userkey: string, tradeId: number): Observable<String> {
    const contents = {
      ApiKey: userkey,
      TradeId: tradeId
    };
    return this.http.post<string>(this.apiUrl + "/trades/proof", contents);
  }

  public getTrades(userkey: string): Observable<Trade[]> {
    const contents = {
      ApiKey: userkey
    };

    return this.http.post<Trade[]>(this.apiUrl + "/trades/table", contents);
  }

  public getProof(code : string) : Observable<Trade> {
    const contents = {
      encryptedCode: code
    }  
    return this.http.post<Trade>(this.apiUrl + "/trades/verify", contents);
  }
}
