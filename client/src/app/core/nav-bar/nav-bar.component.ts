import { Component } from '@angular/core';
import { AccountService } from 'src/app/account/account.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {
  isDropdownVisible = false;

  constructor(public accountService: AccountService){}

  logout(){
    this.accountService.logout();
    this.accountService.signOut();
  }
}