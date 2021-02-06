import { elements } from './base';

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

export const calculateAverage = (day, date) => {
    //temp
    //wind
    //pressure

    /*
    0:
    data:
        instant:
            details:
                air_pressure_at_sea_level: 1009.7
                air_temperature: -14.3
                cloud_area_fraction: 83.6
                relative_humidity: 67.6
                wind_from_direction: 295.1
                wind_speed: 9.2
    __proto__: Object
    __proto__: Object
    next_1_hours: {summary: {…}, details: {…}}
    next_6_hours: {summary: {…}, details: {…}}
    next_12_hours: {summary: {…}}
    __proto__: Object
    time: "2021-02-05T19:00:00Z"
    __proto__: Object
    */
    var count = 0;

    averageForecast.date = date;

    let symbol;

    if (day[0].data.hasOwnProperty('next_12_hours')) {
        symbol = day[0].data.next_12_hours.summary.symbol_code;
    } else if (day[0].data.hasOwnProperty('next_6_hours')) {
        symbol = day[0].data.next_6_hours.summary.symbol_code;
    } else {
        symbol = day[0].data.next_1_hours.summary.symbol_code;
    }

    averageForecast.icon = symbol;

    day.forEach((e) => {
        averageForecast.temperature += e.data.instant.details.air_temperature;
        averageForecast.wind += e.data.instant.details.wind_speed;
        averageForecast.windDirection += e.data.instant.details.wind_from_direction;
        averageForecast.pressure += e.data.instant.details.air_pressure_at_sea_level;

        count++;
    });


    averageForecast.temperature = (averageForecast.temperature / count).toFixed(2);
    averageForecast.wind = (averageForecast.wind / count).toFixed(2);
    averageForecast.windDirection = (averageForecast.windDirection / count).toFixed(2);
    averageForecast.pressure = (averageForecast.pressure / count).toFixed(2);

    renderResult();

    resetAverage();
}