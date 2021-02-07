import axios from 'axios';
import { apiKey } from '../config';

//data model for fetching places with a given query. Extracted coordinates will be used for fetching the weather forecast
export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResult() {

        try {
            const result = await axios(`https://api.positionstack.com/v1/forward?access_key=${apiKey}&query=${this.query}`);

            this.places = result.data;

        } catch (error) {
            alert("Something went wrong...");
            console.log(error);
        }
    }
}   