import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView.js';
import { elements, renderLoader, clearLoader } from './views/base';


/** Global state of the app
* - Search object
* - Current recipe object
* - Shopping list object
* - Liked recipes
*/

const state = {};


/**
 * Search Controller
 */

const controlSearch = async () => {
  //1. Get query from view
  const query = searchView.getInput(); // TODO

  if(query){
    //2) New Search object has added to state
    state.search = new Search(query);

    try{
          //3) Prepare UI for the results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        //4)  Search for recipes
        await state.search.getResults();
        //5) Render result on UI
        clearLoader();
        searchView.renderResults(state.search.result);
    }catch(error){
      alert(error);
      clearLoader();
    }
   
  }
};

elements.searchForm.addEventListener('submit', e => {
  e.preventDefault();
  controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
  const btn = e.target.closest('.btn-inline');
  if(btn){
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResults();
    searchView.renderResults(state.search.result, goToPage);
    //console.log(goToPage);
  }
});


/**
 * Recipe Controller
 */

 const controlRecipe = async () => {
   //Get ID from URL 
   const id = window.location.hash.replace('#', '');
   console.log(id);

   if (id){
      // Prepare the UI for changes
      recipeView.clearResultsRecipe();
      renderLoader(elements.searchRecipeList);
      //Hightlight the search item 
       if(state.search) searchView.highlightSelected(id);

      // Create new Recipe Object
      state.recipe = new Recipe(id);

      try{
        //Get recipe data
        await state.recipe.getRecipe();
        await state.recipe.parseIngredients();

        //Calculate servings and time 
            state.recipe.calcTime();
            state.recipe.calcServings();
  
        //Render recipe
        clearLoader();
        recipeView.renderRecipe(state.recipe);
      }catch(error){
        alert(error);
      }
   }
   

 };


 // Use this when two or more events are applied on same function for example controlRecipe

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

/**
 * List Controller
 */

const controlList = () =>{
  //Create a new list if there is none yet
  if(!state.list) state.list = new List();
  

  // Add each ingredient to the list 
  state.recipe.ingredients.forEach(el => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
      listView.renderItem(item);
  });
 };

// Handling Receipe button clicks

elements.searchRecipeList.addEventListener('click', e =>{
  if(e.target.matches('.btn-decrease, .btn-decrease *')){
    //Decrease button is clicked
    if(state.recipe.serving > 1){
      state.recipe.updateServings('dec');
      recipeView.updateServingsIngredients(state.recipe);
    }
    
  }else if(e.target.matches('.btn-Increase, .btn-Increase *')){
    //Increase button is clicked
    state.recipe.updateServings('inc');
    recipeView.updateServingsIngredients(state.recipe);
  }else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
    controlList();
  }

  console.log(state.recipe);
});



