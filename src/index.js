import { elements } from './views/base';
import Search from './models/Search';
import Location from './models/Location';
import * as searchView from './views/searchView';
import * as forecastView from './views/forecastView';

//https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=60.269596&lon=11.186613


const state = {};


const ctrlSearch = async (inputValue) => {
    const query = inputValue;

    state.search = new Search(query);

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

elements.searchBar.addEventListener('focusout', () => {
    elements.searchBar.setAttribute("style", "border: 0px");
})

/*
*/

const setLocation = async () => {
    const id = window.location.hash.replace('#', '');

    //prepare UI
    searchView.clearSuggestions();
    searchView.clearInput();
    forecastView.clearResults();

    elements.title.textContent = `Weather forecast for ${state.currentPlace}`;

    state.location = new Location(id);

    try {
        await state.location.getForecast();

        var day = [];
        var currDate = new Date(state.location.forecast.timeseries[0].time.substring(0, 10));
        var count = 0;
        const length = state.location.forecast.timeseries.length;

        for (var i = 0; i < length; i++) {
            const currTime = state.location.forecast.timeseries[i];

            const date = new Date(currTime.time.substring(0, 10));

            if (isTheSameDay(currDate, date)) {
                day.push(currTime);
            } else {

                //forecast for the whole day. Fetch icon with current weather



                forecastView.calculateAverage(day, currDate);
                currDate = date;
                day = [];
                count++;
            }
            if (count === 7) {
                break;
            }
        }

        /*
        state.location.forecast.timeseries.forEach((e) => {
            const date = new Date(e.time.substring(0, 10));

            if (isTheSameDay(currDate, date)) {
                day.push(e);
            } else {
                forecastView.calculateAverage(day, currDate);
                currDate = date;
                day = [];
                count++;
            }
        })
        */
    } catch (error) {
        console.log(error);
    }

}

const isTheSameDay = (date1, date2) =>
    date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDay() === date2.getDay();


window.addEventListener('hashchange', setLocation);

document.addEventListener('click', getSuggestionData);

function getSuggestionData(event) {
    var element = event.target;

    if (element.matches('.suggestion_link, .suggestion *')) {
        console.log(element);
        console.log(element.textContent);

        state.currentPlace = element.textContent;

    }
}
