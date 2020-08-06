import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';

const appRoutes: Routes = [
  { path: '', redirectTo: '/recipes', pathMatch: 'full' },
  { path: 'recipes', loadChildren: () => import('./recipes/recipes.module').then(mod => mod.RecipesModule) },
  { path: 'auth', loadChildren: () => import('./auth/auth/auth.module').then(mod => mod.AuthModule) },
  { path: 'shopping-list', loadChildren: () => import('./shopping-list/shopping-list.module').then(mod => mod.ShoppingListModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules, initialNavigation: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
