import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Statistics } from './models/statistics';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  baseUrl = environment.apiUrl + 'statistics';

  constructor(private http: HttpClient){}

  getStatistics(){
    return this.http.get<Statistics>(this.baseUrl);
  }
}
