import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthComponent } from './auth.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [AuthComponent],
  imports: [
    RouterModule.forChild([
      { path: '', component: AuthComponent },
    ]),
    FormsModule,
    SharedModule
  ]
})
export class AuthModule { }
