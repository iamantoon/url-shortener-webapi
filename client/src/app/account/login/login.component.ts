import { Component, OnInit } from '@angular/core';
import { AccountService } from '../account.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SignUser } from 'src/app/shared/interfaces/user';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GoogleLoginProvider, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  });
  user!: SocialUser;

  constructor(private account: AccountService, private router: Router, private toastr: ToastrService, 
    private authService: SocialAuthService, private route: ActivatedRoute){}

  ngOnInit(): void {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      if (user) {
        const externalLoginDto = {
          provider: 'Google',
          token: user.idToken
        };
        this.account.externalLogin(externalLoginDto).subscribe(() => {
          this.router.navigate(['/']);
        });
      }
    });
  }

  loginWithGitHub(): void {
    window.location.href = `https://github.com/login/oauth/authorize?client_id=Ov23limjOqHasbcXYUtR&redirect_uri=${environment.apiUrl}account/signin-github&scope=user:email`;
  }

  handleGitHubCallback(): void {
    this.route.queryParams.subscribe((params) => {
      const code = params['code'];
      if (code) {
        this.account.exchangeGitHubCodeForToken(code).subscribe(() => {
          this.router.navigate(['/']);
        });
      }
    });
  }

  getQueryParam(name: string): string | null {
    const results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    return results ? results[1] : null;
  }

  login(){
    this.account.login(this.loginForm.value as SignUser).subscribe({
      next: () => this.router.navigateByUrl('/'),
      error: (error) => this.toastr.error(error.message)
    });
  }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }
}