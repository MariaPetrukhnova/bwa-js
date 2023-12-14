import callApi from '../helpers/apiHelper';

class FighterService {
    #endpoint = 'fighters.json';

    constructor() {
        this.fighterDetails = {};
    }

    async getFighters() {
        try {
            const apiResult = await callApi(this.#endpoint);
            return apiResult;
        } catch (error) {
            throw error;
        }
    }

    async getFighterDetails(id) {
        try {
            this.fighterDetails = await callApi(`details/fighter/${id}.json`);
            return this.fighterDetails;
        } catch (error) {
            throw error;
        }
    }
}

const fighterService = new FighterService();

export default fighterService;
