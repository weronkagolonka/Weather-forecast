import { elements } from './views/base';
import Search from './models/Search';
import Location from './models/Location';
import * as searchView from './views/searchView';
import * as forecastView from './views/forecastView';

//Global controller of the app

const state = {};


const ctrlSearch = async (inputValue) => {

    //receive the data and render the location suggestions depending on the query

    const query = inputValue;

    state.search = new Search(query);

    //prepare the UI
    searchView.clearSuggestions();

    try {

        await state.search.getResult();

        if (state.search.places.data != undefined) {
            searchView.renderSuggestionList(state.search.places.data);

        }


    } catch (error) {
        console.log(error);
    }
}

//start searching when input has at least 3 characters; clear the suggestion list when the input is empty
elements.searchInput.addEventListener('input', () => {
    if (elements.searchInput.value.length > 3) {

        ctrlSearch(elements.searchInput.value);
    } else if (elements.searchInput.value.length === 0) {
        searchView.clearSuggestions();
    }
});

//change styling of the search bar - indicate that the search is active
elements.searchBar.addEventListener('click', () => {
    elements.searchBar.setAttribute("style", "border: 2px solid #1479de");
})

//indicate that search bar doesn't have the focus anymore
elements.searchBar.addEventListener('focusout', () => {
    elements.searchBar.setAttribute("style", "border: 0px");
})


//get coordinates from the browser and find forecast for given location
const setLocation = async () => {
    const id = window.location.hash.replace('#', '');

    //prepare the UI
    searchView.clearSuggestions();
    searchView.clearInput();
    forecastView.clearResults();

    //update the title with current location
    elements.title.textContent = `Weather forecast for ${state.currentPlace}`;

    state.location = new Location(id);

    try {
        await state.location.getForecast();

        var day = [];

        //date of the first instance
        var currDate = new Date(state.location.forecast.timeseries[0].time.substring(0, 10));

        var count = 0;
        const length = state.location.forecast.timeseries.length;

        for (var i = 0; i < length; i++) {
            //check the date of the instance we are looping through; extract it to a Date object
            const currTime = state.location.forecast.timeseries[i];
            const date = new Date(currTime.time.substring(0, 10));

            if (isTheSameDay(currDate, date)) {
                //gather all the instances for a given day
                day.push(currTime);
            } else {
                //data represents another day; render the average forecast and empty the array
                forecastView.calculateAverage(day, currDate);
                currDate = date;
                day = [];

                //add the first instance of another day
                day.push(currTime);
                count++;
            }

            //limit the results to 7 upcoming days
            if (count === 7) {
                break;
            }
        }
    } catch (error) {
        console.log(error);
    }

}

//utility function for checking if two dates are on the same day, month and year
const isTheSameDay = (date1, date2) =>
    date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDay() === date2.getDay();


//fetch weather data after clicking on the link
window.addEventListener('hashchange', setLocation);

document.addEventListener('click', getSuggestionData);

//get info about current location in order to update the title; 
//extract text from the clicked target as weather API only stores coordinates for a given location
function getSuggestionData(event) {
    var element = event.target;

    //retrieve data stored inside suggestion elements in DOM
    if (element.matches('.suggestion_link, .suggestion *')) {
        state.currentPlace = element.textContent;

    }
}
