import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User, SignUser } from '../shared/interfaces/user';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { SocialAuthService } from '@abacritt/angularx-social-login';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = 'http://localhost:5000/api/account/';
  private currentUserSource = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient, private router: Router, private authService: SocialAuthService){}

  login(values: SignUser){
    return this.http.post<User>(this.baseUrl + 'login', values).pipe(
      map(user => {
        localStorage.setItem('user', JSON.stringify(user));
        this.currentUserSource.next(user);
      })
    )
  }

  register(values: SignUser){
    return this.http.post<User>(this.baseUrl + 'register', values).pipe(
      map(user => {
        localStorage.setItem('user', JSON.stringify(user));
        this.currentUserSource.next(user);
      })
    )
  }

  externalLogin(externalLoginDto: { provider: string, token: string }): Observable<void> {
    return this.http.post<User>(this.baseUrl + 'signin-google', externalLoginDto).pipe(
      map(user => {
        localStorage.setItem('user', JSON.stringify(user));
        this.currentUserSource.next(user);
      })
    );
  }

  exchangeGitHubCodeForToken(code: string): Observable<any> {
    return this.http.post<{ token: string }>(this.baseUrl + 'signin-github', { code }).pipe(
      map(response => {
        const token = response.token;
        localStorage.setItem('github_token', token);
        this.setGitHubToken(token).subscribe();
      })
    );
  }

  setGitHubToken(token: string) {
    return this.http.post<User>(this.baseUrl + 'verify-github-token', { provider: 'GitHub', token }).pipe(
      map(user => {
        this.currentUserSource.next(user);
        localStorage.setItem('user', JSON.stringify(user));
      })
    );
  }
    
  setCurrentUser(user: User){
    this.currentUserSource.next(user);
  }

  signOut(): void {
    this.authService.signOut().then(() => {
      this.logout();
      this.router.navigate(['/login']);
    });
  }

  logout(){
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
    this.router.navigateByUrl('/');
  }
}
