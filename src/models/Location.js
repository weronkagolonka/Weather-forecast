import axios from "axios";

export default class Location {
    constructor(latlng) {
        this.latlng = latlng;
    }

    async getForecast() {
        try {
            const result = await axios(`https://api.met.no/weatherapi/locationforecast/2.0/compact?${this.latlng}`);

            this.forecast = result.data.properties;

        } catch (error) {
            alert("Something went wrong...");
            console.log(error);
        }
    }
}