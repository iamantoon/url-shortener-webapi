import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Statistics } from './models/statistics';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  baseUrl = 'http://localhost:5000/api/statistics';

  constructor(private http: HttpClient){}

  getStatistics(){
    return this.http.get<Statistics>(this.baseUrl);
  }
}
