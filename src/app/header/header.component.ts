import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

import { AuthService } from '../auth/auth/auth.service';
import { User } from '../auth/auth/user.model';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/auth/store/auth.actions';
import * as RecipesActions from '../recipes/store/recipes.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() selectedFeature = new EventEmitter<string>();
  isAuthenticated = false;
  userSub: Subscription;

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.userSub = this.store.select('auth').pipe(map(authState => authState.user)).subscribe((user: User) => this.isAuthenticated = !!user);
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

  onNavSelect(feature: string) {
    this.selectedFeature.emit(feature);
  }

  onSave() {
    // this.dataStorageService.storeRecipes();
    this.store.dispatch(new RecipesActions.StoreRecipe());
  }

  onFetch() {
    this.store.dispatch(new RecipesActions.FetchRecipes());
  }

  onSignout() {
    this.store.dispatch(new AuthActions.SignOut());
  }

}
