// 3rd Party Imports
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {  HttpClient, 
          HttpHeaders,
          HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
// import { BehaviorSubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

// 3rd party stuff injected into our project
import { environment } from '../environments/environment';

// MSSE 663 20S8W1 Imports
// import { RecipeModel } from '../../backend/models/recipe.model';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  API_URL: string = environment.apiUrl;
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  // private newRecipeSubject: BehaviorSubject<RecipeModel>;
  // private newRecipe$: Observable<RecipeModel>;

  constructor(private httpClient: HttpClient, public router: Router) {
    // this.newRecipeSubject: BehaviorSubject<RecipeModel>
  }

  // ToDo: type our return observable
  addRecipe(title: string, ingredients: string, steps: string): Observable<any> {
    return this.httpClient.post<any>(`${this.API_URL}/recipes/addRecipe`, {title, ingredients, steps})
      .pipe(map
        (res => {
        const recipe = res.recipe;
        
        // Do I need to be setting something, sending something?
        // Or does the register function just duplicate login code?

        // if (res.recipe) {
        //   localStorage.setItem('access_token', res.token);
        //   localStorage.setItem('currentUser', JSON.stringify(res.user));
        //   this.getUserProfile(res.user._id).subscribe((result) => {
        //     this.currentUser = res.user;
        //   });
        // }
        return recipe;
      }),
      catchError(this.handleError)
    );
  }

  // updateRecipe(title: string, ingredients: string, steps: string) {
  //   return this.httpClient.put<any>(`${this.API_URL}/recipes/updateRecipe`, {title, ingredients, steps}).pipe(
  //     map((res: any) => {
  //       this.getRecipe(res._id).subscribe((result) => {
  //         this.recipeToUpdate = result;
  //         localStorage.setItem('recipe', JSON.stringify(result));
  //         return result;
  //       });
  //     }),
  //     catchError(this.handleError));
  // }

  handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (!errorRes.error) {
      return throwError(errorMessage);
    }
    const errorCode = errorRes.error;
    switch (errorCode) {
      // case 'AUTH_USERNAME':
      //   errorMessage = 'This username exists already';
      //   break;
      // case 'AUTH_PASS_LENGTH':
      //   errorMessage = 'The password must be at least 6 characters long';
      //   break;
      case 'SERVER_ERROR':
        errorMessage = 'Something happened server-side and the recipe wasn\'t added.';
        break;
      case 'UPDATE_FAIL':
        errorMessage = 'Failed to update recipe. Please try again.';
        break;
      default: {
        errorMessage = 'An error occurred! Please try again or contact support.';
        break;
      }
    }
    return throwError(errorMessage);
  }
}
