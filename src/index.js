import { elements } from './views/base';
import Search from './models/Search';
import * as searchView from './views/searchView';


//https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=60.10&lon=9.58

const state = {};


const ctrlSearch = async (inputValue) => {
    const query = inputValue;

    state.search = new Search(query);

    searchView.clearSuggestions();

    try {

        await state.search.getResult();

        if (state.search != undefined) {
            searchView.renderSuggestionList(state.search.places.data);

        }


    } catch (error) {
        console.log(error);
    }
}

elements.searchInput.addEventListener('input', () => {
    if (elements.searchInput.value.length > 3) {

        ctrlSearch(elements.searchInput.value);
    } else if (elements.searchInput.value.length === 0) {
        searchView.clearSuggestions();
    }
});

elements.searchBar.addEventListener('click', () => {
    elements.searchBar.setAttribute("style", "border: 2px solid #1479de");
})

