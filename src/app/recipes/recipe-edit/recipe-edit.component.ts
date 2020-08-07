import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { RecipeService } from '../recipe.service';
import { Recipe } from '../recipe';


@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styles: []
})
export class RecipeEditComponent implements OnInit, OnDestroy {
  recipeForm: FormGroup;
  private recipeIndex: number;
  private isNew = true;
  private subscription: Subscription;
  private recipe: Recipe;


  constructor(private route: ActivatedRoute,private recipeSrevice: RecipeService, 
              private formBuilder: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.subscription = this.route.params.subscribe(
      (params : any) => {
        if(params.hasOwnProperty('id')) {
          this.isNew = false;
          this.recipeIndex = +params['id'];  // plus for typecasting to number from string
          this.recipe = this.recipeSrevice.getRecipe(this.recipeIndex);
        } else {
          this.isNew = true;
          this.recipe = null;
        } //console.log(isNew);
        this.initForm();
      } 
    );
  }

  onSubmit() {
    const newRecipe = this.recipeForm.value;
    if(this.isNew) {
      this.recipeSrevice.addRecipe(newRecipe);
    } else {
      this.recipeSrevice.editRecipe(this.recipe, newRecipe);
    }
    this.navigateBack();
  }

  onCancel() {
    this.navigateBack();
  }
onAddItem(name: String, amount: String) {
(<FormArray>this.recipeForm.get('ingredients')).push(
  new FormGroup({
    name: new FormControl(name, Validators.required),
    amount: new FormControl(amount, [
    Validators.required,
    Validators.pattern("\\d+")  //only digits are accepted
  ])
})
);
}

onRemoveItem(index: number) {
 (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
}

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private navigateBack() {
    this.router.navigate(["../"]);
  }
private initForm() {
  let recipeName = '';
  let recipeImageUrl = '';
  let recipeContent = ''; 
  let recipeIngredients: FormArray = new FormArray([]);

  if (!this.isNew) {
    if(this.recipe.hasOwnProperty('ingredients'))
    {
      for(let i = 0;i < this.recipe.ingredients.length; i++) {
        recipeIngredients.push(
          new FormGroup({
            name: new FormControl(this.recipe.ingredients[i].name, Validators.required),
            amount: new FormControl(this.recipe.ingredients[i].amount, [
              Validators.required,
              Validators.pattern("\\d+")  //only digits are accepted
            ])
          })
        ); 
       }
    }
    
      recipeName = this.recipe.name;
      recipeImageUrl = this.recipe.imagePath;
      recipeContent = this.recipe.description;
      
    }
    this.recipeForm = this.formBuilder.group({
      name: [recipeName, Validators.required],
      imagePath: [recipeImageUrl, Validators.required],
      description: [recipeContent, Validators.required],
      ingredients: recipeIngredients
    });
  }


}
