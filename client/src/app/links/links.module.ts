import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LinksRoutingModule } from './links-routing.module';
import { SharedModule } from '../shared/shared.module';
import { LinksComponent } from './links/links.component';
import { LinkComponent } from './link/link.component';
import { AllLinksComponent } from './all-links/all-links.component';
import { PersonalLinksComponent } from './personal-links/personal-links.component';

@NgModule({
  declarations: [
    LinksComponent,
    LinkComponent,
    AllLinksComponent,
    PersonalLinksComponent
  ],
  imports: [
    CommonModule,
    LinksRoutingModule,
    SharedModule
  ]
})
export class LinksModule {}