import axios from 'axios';

export default class Recipe{
    constructor(id){
        this.id = id;
    }

    async getRecipe(){

        try{    
            const resRecipes = await axios (`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            this.title = resRecipes.data.recipe.title;
            this.author = resRecipes.data.recipe.publisher;
            this.img = resRecipes.data.recipe.image_url;
            this.url = resRecipes.data.recipe.psource_url;
            this.ingredients = resRecipes.data.recipe.ingredients;

        }catch(error){
            alert(error);
        } 
    };

    calcTime(){

        // Assuming that we need 15 min for each 3 ingredients
        const numImg = this.ingredients.length;
        const period = Math.ceil(numImg/3);
        this.time = period * 15;
    }

    calcServings() {
        this.serving = 4;
    }

    parseIngredients() {    
         const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoon', 'teaspoons', 'cups', 'pounds'];

         const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];

        const newIngredients = this.ingredients.map(el => {
            
            // 1) Uniform Units
                let ingredient = el.toLowerCase();
                unitsLong.forEach((unit, i) => {
                    ingredient = ingredient.replace(unit, unitsShort[i]);
                });

            // 2) Remove Parentheses
                ingredient = ingredient.replace(/[()]/g, '');

            // // 3) Parse ingredients into count, unit and ingrdients
                const arrImg = ingredient.split(' ');
                const unitIndex = arrImg.findIndex(el2 => unitsShort.includes(el2));

                let objIng;

                if(unitIndex > -1){  
                    // There is a unit
                    // slice method returns the selected elements in an array, as a new array obj
                    // 4 1/2 cups are arrCount is [4, 1/2]

                    const arrCount = arrImg.slice(0, unitIndex);
                    let count;
                    if(arrCount.length === 1){
                        count = eval(arrImg[0].replace('-', '+'));    
                    } else{
                        count = eval(arrImg.slice(0, unitIndex).join('+')); // eval method is used to evalute the string which is then parse by js engine as js code and converted into a near by number
                                                                            // like (4+1/2) will be evaluted as 4.5
                    }

                    objIng = {
                        count,
                        unit: arrImg[unitIndex],
                        ingredient: arrImg.slice(unitIndex + 1).join(' ')
                    };
                    
                } else if(parseInt(arrImg[0], 10)){
                    // There is no unit, but 1st element is the number
                    objIng = {
                        count: parseInt(arrImg[0], 10),
                        unit: '',
                        ingredient: arrImg.slice(1).join(' ')
                    }
                } else if(unitIndex === -1 ){
                    // There is no unit and no number in first position
                    objIng = {
                        count: 1,
                        unit: '',   
                        ingredient: ingredient
                    }
                }

                 return objIng;
        });

        this.ingredients = newIngredients;
        console.log(newIngredients);
    }

    updateServings(type){   
        //Servings
            const newServing = type === 'dec' ? this.serving - 1 : this.serving + 1;
        //Ingredients
            this.ingredients.forEach(ing => {
                ing.count *= (newServing / this.serving);
            });

            this.serving = newServing;

    }

};

