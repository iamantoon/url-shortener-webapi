import { Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalService } from 'src/app/shared/services/modal.service';
import { Link, LinkParams } from 'src/app/links/models/links';
import { LinksService } from 'src/app/links/links.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
  @Input() size? = 'md';
  @Input() title? = 'Modal title';
  @Output() closeEvent = new EventEmitter();
  @Output() submitEvent = new EventEmitter();
  createLinkForm: FormGroup = new FormGroup({
    link: new FormControl('', [Validators.required, Validators.pattern(/^(ftp|http|https):\/\/[^ "]+$/)]),
    expiryDate: new FormControl('12', [Validators.required]),
  }); 
  linkParams: LinkParams = new LinkParams;
  isDropdownVisible = true;
  @Input() options: any[] = [
    {value: '12', title: 'For 12 hours'},
    {value: '24', title: 'For 1 day'},
    {value: '168', title: 'For 1 week'},
    {value: '336', title: 'For 2 weeks'},
    {value: '720', title: 'For 1 month'},
    {value: '2160', title: 'For 2 months'}
  ];

  constructor(private elementRef: ElementRef, private linksService: LinksService, 
    private modalService: ModalService, private toastr: ToastrService){}

  createLink(){
    const link = this.createLinkForm.get('link')?.value; 
    const howManyHoursAccessible = this.createLinkForm.get('expiryDate')?.value;

    if (link && howManyHoursAccessible){
      this.linksService.createLink(link, howManyHoursAccessible).subscribe({
        next: () => {
          this.getPersonalLinks();
          this.toastr.success("Link was successfully created");
        }
      })
      this.createLinkForm.get('link')?.setValue('');
      this.createLinkForm.get('expiryDate')?.setValue('12');
      this.elementRef.nativeElement.remove();
      this.closeEvent.emit();
    }
  }
  
  getPersonalLinks(){   
    if (!this.linkParams) return;

    this.linksService.loadPersonalLinks(this.linkParams).subscribe({
      next: response => {
        if (response.pagination && response.result){
          this.linksService.setPersonalLinks(response);
        }
      }
    })
  }

  changeExpiryDate(hours: string){
    this.createLinkForm.patchValue({
      expiryDate: hours
    });
    this.isDropdownVisible = false;
  }
  
  convertHours(hours: number){
    const hoursInDay = 24;
    const hoursInWeek = 7 * hoursInDay;
    const hoursInMonth = 30 * hoursInDay;

    if (hours % hoursInMonth === 0) {
      const months = hours / hoursInMonth;
      return `${months} month${months !== 1 ? 's' : ''}`;
    } else if (hours % hoursInWeek === 0) {
      const weeks = hours / hoursInWeek;
      return `${weeks} week${weeks !== 1 ? 's' : ''}`;
    } else if (hours % hoursInDay === 0) {
      const days = hours / hoursInDay;
      return `${days} day${days !== 1 ? 's' : ''}`;
    } else {
      return `${hours} hour${hours !== 1 ? 's' : ''}`;
    }
  }

  toggleDropdown(event: Event){
    event.stopPropagation();
    this.isDropdownVisible = !this.isDropdownVisible;
  }

  close(): void {
    this.elementRef.nativeElement.remove();
    this.closeEvent.emit();
  }
}