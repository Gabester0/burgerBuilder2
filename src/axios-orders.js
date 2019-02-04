import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://gabe-burger.firebaseio.com/'
});

export default instance;