import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { RecipesService } from './recipes/recipes.service';
import { AuthInterceptorService } from './auth/auth/auth-interceptor.service';

@NgModule({
  providers: [
    RecipesService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true }
  ]
})
export class CoreModule { }
