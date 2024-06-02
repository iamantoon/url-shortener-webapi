import { Component, OnInit } from '@angular/core';
import { AccountService } from '../account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { SignUser } from 'src/app/shared/interfaces/user';
import { GoogleLoginProvider, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
    confirmPassword: new FormControl('', [Validators.required, this.matchValues('password')])
  });
  user!: SocialUser;
  
  constructor(private account: AccountService, private router: Router, private authService: SocialAuthService, 
    private route: ActivatedRoute){}

  ngOnInit(): void {
    this.initializeForm();
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

  register(){
    this.account.register({email: this.registerForm.value.email, password: this.registerForm.value.password } as SignUser).subscribe({
      next: () => this.router.navigateByUrl('/')
    });
  }

  initializeForm(){
    this.registerForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
      confirmPassword: new FormControl('', [Validators.required, this.matchValues('password')])
    });
    this.registerForm.controls['password'].valueChanges.subscribe({
      next: () => this.registerForm.controls['confirmPassword'].updateValueAndValidity()
    });
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control.value === control.parent?.get(matchTo)?.value ? null : {notMatching: true};
    }
  }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  // Github 

  loginWithGitHub(): void {
    window.location.href = 'https://github.com/login/oauth/authorize?client_id=Ov23limjOqHasbcXYUtR&redirect_uri=http://localhost:5000/api/account/signin-github&scope=user:email';
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
}