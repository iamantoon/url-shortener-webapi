import { Component, OnInit } from '@angular/core';
import { LinkParams } from '../models/links';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LinksService } from '../links.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-personal-links',
  templateUrl: './personal-links.component.html',
  styleUrls: ['./personal-links.component.css']
})
export class PersonalLinksComponent implements OnInit {
  linkParams: LinkParams = new LinkParams;
  filterForm: FormGroup = new FormGroup({filterByExpiryDate: new FormControl('8640')});
  isDropdownOpen = false;

  constructor(public linksService: LinksService, private toastr: ToastrService){
    this.linkParams = new LinkParams();
  }

  ngOnInit(): void {
    this.getPersonalLinks();
    this.initializeForm();
  }

  initializeForm(){
    this.filterForm = new FormGroup({
      filterByExpiryDate: new FormControl('8640')
    })
  }

  getPersonalLinks(){
    this.linkParams.maxExpiryDate = this.filterForm.get('filterByExpiryDate')?.value;    
    
    if (!this.linkParams) return;

    this.linksService.loadPersonalLinks(this.linkParams).subscribe({
      next: response => {
        if (response.pagination && response.result){
          this.linksService.setPersonalLinks(response);
        }
      }
    })
  }

  setExpiryDate(value: string) {
    this.filterForm.get('filterByExpiryDate')?.setValue(value);
    this.isDropdownOpen = false;
  }

  getDropdownLabel(): string {
    const value = this.filterForm.get('filterByExpiryDate')?.value;
    switch(value) {
      case '24':
        return 'Display links that will expire in 1 day';
      case '168':
        return 'Display links that will expire in 1 week';
      case '336':
        return 'Display links that will expire in 2 weeks';
      case '720':
        return 'Display links that will expire in 1 month';
      default:
        return 'All active links';
    }
  }
  
  resetFilters(){
    this.linkParams = new LinkParams();
    this.filterForm.get('filterByExpiryDate')?.setValue('8640');
    this.isDropdownOpen = false;
    this.getPersonalLinks();
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  pageChanged(event: any){
    if (this.linkParams.pageNumber !== event.page){
      this.linkParams.pageNumber = event.page;
      this.getPersonalLinks();
    }
  }
}