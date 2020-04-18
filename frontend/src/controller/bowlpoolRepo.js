import axios from 'axios/index';

export class bowlpoolRepo {
    url = "http://localhost:3000";

    getData () {
        return new Promise((resolve, reject) => {
            axios.get(`${this.url}/`, this.config)
                .then(resp => resolve(resp.data))
                .catch(resp => alert(resp));
        });
    }
}