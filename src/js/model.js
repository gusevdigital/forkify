import { API_URL, RESULTS_PER_PAGE, API_KEY } from './config';
import { AJAX } from './helpers';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    results_per_page: RESULTS_PER_PAGE,
  },
  bookmarks: [],
};

const getLocalBookmarks = function () {
  try {
    return JSON.parse(localStorage.getItem('bookmarks'));
  } catch (err) {
    console.log(err);
  }
};

const saveLocalBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

const deleteLocalBookmarks = function () {
  localStorage.clear('bookmarks');
};

const _createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${API_KEY}`);

    state.recipe = _createRecipeObject(data);

    state.recipe.bookmarked = state.bookmarks.some(
      bookmark => bookmark.id === id
    )
      ? true
      : false;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;

    const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getSearchResultsPage = function (page = 1) {
  state.search.page = page;
  const start = (page - 1) * RESULTS_PER_PAGE;
  const end = page * RESULTS_PER_PAGE;
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });
  state.recipe.servings = newServings;
};

export const addBookmark = function (recipe) {
  // Add bookmark
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  saveLocalBookmarks();
};

export const deleteBookmark = function (id) {
  state.bookmarks = state.bookmarks.filter(b => b.id !== id);

  state.recipe.bookmarked = false;

  saveLocalBookmarks();
};

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(el => el[0].startsWith('ingredient-') && el[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').forEach(i => i.trim());
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format! please use the corrent format :)'
          );
        const [quantity, unit, description] = ingArr;
        return {
          quantity: quantity ? +quantity : null,
          unit: unit ? unit : '',
          description: description ? description : '',
        };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    console.log(recipe);
    const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);

    state.recipe = _createRecipeObject(data);

    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};

const init = function () {
  state.bookmarks = getLocalBookmarks() || [];
};

init();
