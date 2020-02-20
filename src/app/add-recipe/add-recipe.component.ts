// 3rd Party
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

// MSSE 663 20S8W1
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-add-recipe',
  templateUrl: './add-recipe.component.html',
  styleUrls: ['./add-recipe.component.scss']
})
export class AddRecipeComponent implements OnInit {

  newRecipeForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error: string;

  constructor(
    public formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private recipeService: RecipeService,
  ) { 
    // if ( !this.authService.isLoggedIn() ) { 
    //    prevent user from creating new recipes 
    // }
  }

  ngOnInit() {
    this.newRecipeForm = this.formBuilder.group({
      title: ['', Validators.required],
      ingredients: ['', Validators.required], // Do some default Text here so you can create but don't have to finish
      steps: ['', Validators.required] // Same here
    });
    // Do we want to then take you to the recipe page?
    // Or let you enter a new recipe?
    /****** How often would a user create more than one recipe at a time? *********/
    
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/profile';
  }

  get field() { return this.newRecipeForm.controls; }

  // Maybe change this to submitRecipe
  addRecipe() {
    this.submitted = true;
    if (this.newRecipeForm.invalid) {
      return;
    }
    this.loading = true;
    // Change this to saveRecipe? Purely a readability thing
    // Also, putting this data into FormData and sending one 
    // thing might be a better direction.
    this.recipeService.addRecipe(
      this.field.title.value,
      this.field.ingredients.value,
      this.field.steps.value
    ).
      pipe(first())
      .subscribe(
        data => {
          window.alert('New recipe added!');
          this.router.navigate([this.returnUrl]);
        },
        error => {
          this.error = error;
          this.loading = false;
        }
      )
  }

}
