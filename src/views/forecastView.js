import { elements } from './base';

//functions for rendering the data fetched in the Location object


//default state data
const averageForecast = {
    date: Date.now(),
    temperature: 0,
    wind: 0,
    windDirection: 0,
    pressure: 0,
    icon: 'clearsky_day',
}

const week = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
];

const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];

//reset the state to default data
const resetAverage = () => {
    averageForecast.date = Date.now();
    averageForecast.temperature = 0;
    averageForecast.wind = 0;
    averageForecast.windDirection = 0;
    averageForecast.pressure = 0;
    averageForecast.icon = 'clearsky_day';
}

export const clearResults = () => {
    elements.resultsList.innerHTML = '';
}

const renderResult = () => {
    const markup = `
    <li>
        <div class=result>
            <div class="date_time">
                <h3>${week[averageForecast.date.getDay()]}, ${averageForecast.date.getDate()} ${months[averageForecast.date.getMonth()]}</h3>
            </div>
            <div class="result_elements">
                <div class="element">
                    <img class="icon" src="img/${averageForecast.icon}.svg" width="80" height="80" />
                </div>
                <div class="element">
                    <i class="fas fa-thermometer-half"></i>
                    <div class="spacer"></div>
                    <p>${averageForecast.temperature} \u00B0C</p>
                </div>
                <div class="element">
                    <i class="fas fa-wind"></i>
                    <div class="spacer"></div>
                    <p>${averageForecast.wind} m/s</p>
                </div>
                <div class="element">
                    <i class="fas fa-sort-amount-down"></i>
                    <div class="spacer"></div>
                    <p>${averageForecast.pressure} hPa</p>
                </div>
            </div>
        </div>
    </li>   
    `;

    elements.resultsList.insertAdjacentHTML('beforeend', markup);
}

//data is being provided in timeseries every hour. 
//I decided to calculate the average for the whole day instead of showing extremely detailed overview
export const calculateAverage = (day, date) => {

    var count = 0;

    averageForecast.date = date;

    let symbol;

    //find the precipitation symbol code in order to assign proper icon. Not all the instances have the summary for 1, 6 and 12 hours
    if (day[0].data.hasOwnProperty('next_12_hours')) {
        symbol = day[0].data.next_12_hours.summary.symbol_code;
    } else if (day[0].data.hasOwnProperty('next_6_hours')) {
        symbol = day[0].data.next_6_hours.summary.symbol_code;
    } else {
        symbol = day[0].data.next_1_hours.summary.symbol_code;
    }

    averageForecast.icon = symbol;

    //sum up the data for every instance throughout the day
    day.forEach((e) => {
        averageForecast.temperature += e.data.instant.details.air_temperature;
        averageForecast.wind += e.data.instant.details.wind_speed;
        averageForecast.windDirection += e.data.instant.details.wind_from_direction;
        averageForecast.pressure += e.data.instant.details.air_pressure_at_sea_level;

        count++;
    });

    //calculate the average values
    averageForecast.temperature = (averageForecast.temperature / count).toFixed(2);
    averageForecast.wind = (averageForecast.wind / count).toFixed(2);
    averageForecast.windDirection = (averageForecast.windDirection / count).toFixed(2);
    averageForecast.pressure = (averageForecast.pressure / count).toFixed(2);

    renderResult();

    //reset the state before rendering another day
    resetAverage();
}