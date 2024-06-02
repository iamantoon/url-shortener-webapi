import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Link, LinkParams, PaginatedResult } from './models/links';

@Injectable({
  providedIn: 'root'
})
export class LinksService {
  baseUrl = 'http://localhost:5000/api/links/';
  linksSubject: BehaviorSubject<PaginatedResult<Link[]>> = new BehaviorSubject<PaginatedResult<Link[]>>([] as PaginatedResult<Link[]>);
  links$: Observable<PaginatedResult<Link[]>> = this.linksSubject.asObservable(); 
  personalLinksSubject: BehaviorSubject<PaginatedResult<Link[]>> = new BehaviorSubject<PaginatedResult<Link[]>>([] as PaginatedResult<Link[]>);
  personalLinks$: Observable<PaginatedResult<Link[]>> = this.personalLinksSubject.asObservable(); 
  linkParams: LinkParams | undefined;

  constructor(private http: HttpClient){
    this.linkParams = new LinkParams();
  }

  loadLinks(linkParams: LinkParams){
    let params = this.getPaginationHeaders(linkParams.pageNumber, linkParams.pageSize);

    params = params.append('maxExpiryDate', linkParams.maxExpiryDate);
    params = params.append('orderBy', linkParams.orderBy);

    return this.getPaginatedResult<Link[]>(this.baseUrl, params).pipe(
      map(response => {
        this.linksSubject.next(response);
        return response;
      })
    )
  }

  loadPersonalLinks(linkParams: LinkParams){
    let params = this.getPaginationHeaders(linkParams.pageNumber, linkParams.pageSize);

    params = params.append('maxExpiryDate', linkParams.maxExpiryDate);
    params = params.append('orderBy', linkParams.orderBy);

    return this.getPaginatedResult<Link[]>(this.baseUrl + 'my', params).pipe(
      map(response => {
        this.personalLinksSubject.next(response);
        return response;
      })
    )
  }

  private getPaginationHeaders(pageNumber: number, pageSize: number){
    let params = new HttpParams();
    
    params = params.append("pageNumber", pageNumber);
    params = params.append("pageSize", pageSize);
    
    return params;
  }

  private getPaginatedResult<T>(url: string, params: HttpParams){
    const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>;

    return this.http.get<T>(url, {observe: 'response', params}).pipe(
      map(response => {
        if (response.body){
          paginatedResult.result = response.body;
        }
        const pagination = response.headers.get('Pagination');
        if (pagination){
          paginatedResult.pagination = JSON.parse(pagination);
        }
        return paginatedResult;
      })
    )
  }

  getLink(id: number){
    return this.http.get<Link>(this.baseUrl + id);
  }

  createLink(link: string, howManyHoursAccessible: number){
    return this.http.post(this.baseUrl, {link, howManyHoursAccessible});
  }

  setLinks(value: PaginatedResult<Link[]>){
    this.linksSubject.next(value);
  }

  setPersonalLinks(value: PaginatedResult<Link[]>){
    this.personalLinksSubject.next(value);
  }

  getLinksParams(){
    return this.linkParams;
  }

  setLinksParams(params: LinkParams){
    this.linkParams = params;
  }

  resetLinkParams(){
    this.linkParams = new LinkParams();
    return this.linkParams;
  }

  public getValidDate(date: any){
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    const formattedDay = day < 10 ? '0' + day : day;
    const formattedMonth = month < 10 ? '0' + month : month;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    const formattedSeconds = seconds < 10 ? '0' + seconds : seconds;

    return `${year}-${formattedMonth}-${formattedDay} ${hours}:${formattedMinutes}:${formattedSeconds}`;
  }
}