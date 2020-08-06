import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { Recipe } from '../recipe.model';
import * as RecipesActions from './recipes.actions';
import * as fromApp from '../../store/app.reducer';

@Injectable()
export class RecipesEffects {
  constructor(private action$: Actions, private http: HttpClient, private store: Store<fromApp.AppState>) { }

  @Effect() fetchRecipes = this.action$.pipe(ofType(RecipesActions.FETCH_RECIPES), switchMap(() =>
    this.http.get<Recipe[]>('https://angular-recipe-3a349.firebaseio.com/recipes.json')
  ), map(recipes =>
    recipes.map(recipe => ({ ...recipe, ingredients: recipe.ingredients ? recipe.ingredients : [] }))
  ), map(recipes =>
    new RecipesActions.SetRecipes(recipes)
  ));

  @Effect({ dispatch: false }) storeRecipes = this.action$.pipe(ofType(RecipesActions.STORE_RECIPE),
    withLatestFrom(this.store.select('recipes')),
    switchMap(([actionData, recipesState]) => {
      return this.http.put('https://angular-recipe-3a349.firebaseio.com/recipes.json', recipesState.recipes);
    }))
}
