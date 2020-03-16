import { elements } from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
  elements.searchInput.value = '';
}

export const clearResults = () => {
  elements.searchResultList.innerHTML = '';
  elements.searchResPages.innerHTML = '';
}


// algorithm for specifing limit to the recipes title
// TODO Later
const limitRecipeTitle = (title, limit = 17) => {
  const newTitle = [];
  if(title.length > limit){
    title.split(' ').reduce((acc, cur) => {
      if(acc + cur.length <= limit){
        newTitle.push(cur);
      }
      return acc + cur.length;
    }, 0);

    return `${newTitle.join(' ')} ...`
  }
  return title;
}

//functions to render UI in index.html
const renderRecipe = recipe => {
  const markup = `
      <li>
          <a class="results__link" href="#${recipe.recipe_id}">
              <figure class="results__fig">
                  <img src="${recipe.image_url}" alt="${recipe.title}">
              </figure>
              <div class="results__data">
                  <h4 class="results__name">
                  ${limitRecipeTitle(recipe.title)}</h4>
                  <p class="results__author">${recipe.publisher}</p>
              </div>
          </a>
      </li>
    `;
    elements.searchResultList.insertAdjacentHTML('beforeend', markup);
};

// if type is 'prev' or 'next'
const createButton = (renPage, type) => `
  <button class="btn-inline results__btn--${type}" data-goto = ${type === 'prev' ? renPage -1 : renPage +1 }>
      <svg class="search__icon">
          <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right' }"></use>
      </svg>
      <span>Page ${type === 'prev' ? renPage -1 : renPage +1 }</span>
  </button>
`;

const renderButtons = (renPage, numResults, resPerPage) => {
  const pages = Math.ceil(numResults / resPerPage);

  let button;
  if(renPage === 1 && pages > 1){
    //Only Button to go next page
    button = createButton(renPage, 'next');
  }else if(renPage < pages){
    //Both button to go next page
    button = `
    ${createButton(renPage, 'prev')}
    ${createButton(renPage, 'next')}
    `;
  }else if (renPage === pages && pages > 1) {
    //Only Button to go previous page
    button = createButton(renPage, 'prev');
  }
  elements.searchResPages.insertAdjacentHTML('afterbegin', button);
};


//recipes will have an array of recipes
export const renderResults = (recipes, renPage = 1, resPerPage = 10) => {

  // Render Results of current page
  const start = (renPage - 1) * resPerPage;
  const end =  renPage * resPerPage;
  recipes.slice(start, end).forEach(renderRecipe);

  //render pagination renderButtons
  renderButtons(renPage, recipes.length, resPerPage);
};


//[href*="${id}"] this is css selector use din Javascript '[attribute*=value]'

export const highlightSelected = id => {
  const resultsArr = Array.from(document.querySelectorAll('.results__link'));
  resultsArr.forEach(el => {
      el.classList.remove('results__link--active');
  });
  document.querySelector(`.results__link[href*="${id}"]`).classList.add('results__link--active');
};