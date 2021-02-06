import axios from 'axios';
import { apiKey } from '../config';

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