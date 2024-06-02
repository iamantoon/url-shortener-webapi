import { Component, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.css']
})
export class LinkComponent {
  @Input() link!: string;
  @Input() date?: string;

  constructor(private toastr: ToastrService){}

  copyText(link: string) {
    navigator.clipboard.writeText(link).then(() => {
      this.toastr.show("Link copied");
    }).catch(err => {
      console.error('Ошибка копирования текста: ', err);
    });
  }
}