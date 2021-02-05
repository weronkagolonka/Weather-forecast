import axios from axios;

export default class Forecast {
    constructor(lat, long) {
        this.lat = lat;
        this.long = long;
    }
}