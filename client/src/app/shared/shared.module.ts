import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from 'ngx-toastr';
import { NgChartsModule } from 'ng2-charts';
import { ModalComponent } from './components/modal/modal.component';

@NgModule({
  declarations: [
    ModalComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxSpinnerModule.forRoot({
      type: 'square-jelly-box'
    }),
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right'
    }),
    NgChartsModule.forRoot()
  ],
  exports: [
    HttpClientModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    ToastrModule,
    NgChartsModule
  ]
})

export class SharedModule { }
