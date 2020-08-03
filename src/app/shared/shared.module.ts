import { NgModule } from '@angular/core';
import { DropdownDirective } from './dropdown.directive';
import { SpinnerComponent } from './spinner/spinner.component';
import { AlertComponent } from './alert/alert/alert.component';
import { PlaceholderDirective } from './placeholder.directive';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    DropdownDirective,
    SpinnerComponent,
    AlertComponent,
    PlaceholderDirective
  ],
  imports: [CommonModule],
  exports: [
    CommonModule,
    DropdownDirective,
    SpinnerComponent,
    AlertComponent,
    PlaceholderDirective
  ]
})
export class SharedModule { }
