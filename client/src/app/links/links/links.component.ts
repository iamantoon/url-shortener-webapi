import { Component, Input, TemplateRef } from '@angular/core';
import { ModalService } from 'src/app/shared/services/modal.service';
import { Link } from '../models/links';

@Component({
  selector: 'app-links',
  templateUrl: './links.component.html',
  styleUrls: ['./links.component.css']
})
export class LinksComponent {
  @Input() links?: Link[]
  @Input() isPersonal = false;

  constructor(private modalService: ModalService){}

  openCreateLinkModal(modalTemplate: TemplateRef<any>){
    this.modalService.open(modalTemplate, {size: 'lg', title: 'Create a short link'}).subscribe(action => {})
  }
}