import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
//import { EventEmitter } from 'events';

import { Ingredient } from '../Shared/ingredient';
import { ShoppingListService } from './shopping-list.service';


@Component({
  selector: 'app-shopping-list-add',
  templateUrl: './shopping-list-add.component.html'
})
export class ShoppingListAddComponent implements OnChanges {
  isAdd = true;
  @Input() item: Ingredient;
  @Output() cleared = new EventEmitter();

  ngOnChanges(changes) {
    if(changes.item.currentValue === null) {
      this.isAdd = true;
      this.item = {name: null, amount: null};
    } else {
      this.isAdd = false;
    }
  }

  constructor(private sls:ShoppingListService) { }

 
  onSubmit(ingredient: Ingredient) {
    const newIngredient = new Ingredient(ingredient.name, ingredient.amount);
    if(!this.isAdd) {
      this.sls.editItem(this.item, newIngredient);
      this.onClear();
    } else {
      //console.log(ingredient);
      this.item = newIngredient; 
      this.sls.addItem(this.item);
    }
    
  }
  onDelete() {
      this.sls.deleteItem(this.item);
      this.onClear();
    }
    onClear() {
     // this.item = {name : null, amount : null}
      this.isAdd = true;
      this.cleared.emit(null);
    }

}
