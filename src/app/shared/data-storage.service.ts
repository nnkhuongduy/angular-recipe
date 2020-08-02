import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, tap, take, exhaustMap } from 'rxjs/operators';

import { RecipesService } from '../recipes/recipes.service';
import { Recipe } from '../recipes/recipe.model';
import { AuthService } from '../auth/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {
  constructor(private http: HttpClient, private recipesService: RecipesService, private authService: AuthService) { }

  storeRecipes() {
    const recipes: Recipe[] = this.recipesService.getRecipes();
    this.http.put('https://angular-recipe-3a349.firebaseio.com/recipes.json', recipes).subscribe(respone => console.log(respone));
  }

  fetchRecipes() {
    return this.http.get<Recipe[]>('https://angular-recipe-3a349.firebaseio.com/recipes.json')
      .pipe(map(recipes => {
        return recipes.map(recipe => {
          return {
            ...recipe,
            ingredients: recipe.ingredients ? recipe.ingredients : []
          };
        });
      }), tap(recipes => {
        this.recipesService.setRecipes(recipes);
      }));
  }
}
