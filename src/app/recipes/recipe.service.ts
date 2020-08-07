import { Injectable, EventEmitter } from '@angular/core';
import { Recipe } from './recipe';
import { Ingredient } from '../Shared/ingredient';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, pipe } from 'rxjs';
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
recipesChanged = new EventEmitter<Recipe[]>();

  private  recipes: Recipe[]=[
    new Recipe('French Fries', 'Very Tasty','https://www.gstatic.com/webp/gallery3/1.sm.png', [
    new Ingredient('Berger',10),
    new Ingredient('Biryani',100)
  ]),
    new Recipe('Cow Meat', 'Okayish','https://cdn.britannica.com/68/143268-050-917048EA/Beef-loin.jpg', [new Ingredient('chicken', 300)])
  ];

  constructor(private http:HttpClient) { }
  getRecipes() {
    return this.recipes;
  }
  getRecipe(id: number) {
    return this.recipes[id];
  }
  deleteRecipe(recipe: Recipe) {
    this.recipes.splice(this.recipes.indexOf(recipe), 1)
  }

  addRecipe(newRecipe: Recipe) {
    this.recipes.push(newRecipe);
    console.log(newRecipe);
  }

  editRecipe(oldRecipe: Recipe, newRecipe: Recipe) {
    this.recipes[this.recipes.indexOf(oldRecipe)] = newRecipe;
    console.log(newRecipe);
  }

  storeData() {
    const body=JSON.stringify(this.recipes);
    const headers = new HttpHeaders({'Content-Type' : 'application/json' });
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.put('https://recipebook-fa507.firebaseio.com/recipes.json', body, {headers : headers});
  }

  fetchData() {
    return this.http.get('https://recipebook-fa507.firebaseio.com/recipes.json')
    .pipe(map(response => response))
    .subscribe(
      (data: any) => { 
        this.recipes = data;
        this.recipesChanged.emit(this.recipes);
      }
    );
  }
}
