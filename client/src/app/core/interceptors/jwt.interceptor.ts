import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, switchMap, take } from 'rxjs';
import { AccountService } from 'src/app/account/account.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private accountService: AccountService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const githubToken = localStorage.getItem('github_token');

    return this.accountService.currentUser$.pipe(
      take(1),
      switchMap(user => {
        if (user) {
          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${user.token}`
            }
          });
        } else if (githubToken) {
          request = request.clone({
            setHeaders: {
              Authorization: `token ${githubToken}`
            }
          });
        }

        return next.handle(request);
      })
    );
  }
}