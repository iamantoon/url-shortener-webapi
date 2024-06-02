import { Component, OnInit } from '@angular/core';
import { LinksService } from '../links.service';
import { LinkParams } from '../models/links';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-all-links',
  templateUrl: './all-links.component.html',
  styleUrls: ['./all-links.component.css']
})
export class AllLinksComponent implements OnInit {
  linkParams: LinkParams | undefined = new LinkParams();
  filterForm: FormGroup = new FormGroup({filterByExpiryDate: new FormControl('8640', Validators.required)});
  isDropdownOpen = false;

  constructor(public linksService: LinksService){}

  ngOnInit(): void {
    this.getLinks();
    this.initializeForm();
  }

  initializeForm(){
    this.filterForm = new FormGroup({
      filterByExpiryDate: new FormControl('8640', Validators.required)
    })
  }

  getLinks(){
    if (!this.linkParams) return;
    this.linkParams.maxExpiryDate = this.filterForm.get('filterByExpiryDate')?.value;    
    this.linksService.setLinksParams(this.linkParams);
    
    if (this.linkParams){
      this.linksService.setLinksParams(this.linkParams);
      this.linksService.loadLinks(this.linkParams).subscribe({
        next: response => {
          if (response.pagination && response.result){
            this.linksService.setLinks(response);
          }
        }
      })
    }
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
    this.linkParams = this.linksService.resetLinkParams();
    this.filterForm.get('filterByExpiryDate')?.setValue('8640');
    this.isDropdownOpen = false;
    this.getLinks();
  }

  pageChanged(event: any){
    if (this.linkParams && this.linkParams.pageNumber !== event.page){
      this.linkParams.pageNumber = event.page;
      this.linksService.setLinksParams(this.linkParams);
      this.getLinks();
    }
  }
}