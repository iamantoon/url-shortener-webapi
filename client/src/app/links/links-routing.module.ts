import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllLinksComponent } from './all-links/all-links.component';
import { PersonalLinksComponent } from './personal-links/personal-links.component';
import { AuthGuard } from '../core/guards/auth.guard';

const routes: Routes = [
  {path: 'all', component: AllLinksComponent},
  {path: 'my', component: PersonalLinksComponent, canActivate: [AuthGuard]}
]

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LinksRoutingModule { }
