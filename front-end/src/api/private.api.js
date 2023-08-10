import axios from 'axios'

const baseURL = "http://localhost:5000"

const instance = axios.create({
    baseURL
})

instance.interceptors.request.use(async config => {
    return {
        ...config,
        headers: {
            "Content-Type": "application/json",
            'Access-Control-Allow-Origin': '*'
        }
    }
})

instance.interceptors.response.use((response) => {
    if (response && response.data) return response.data;
    return response;
}, (err) => {
    throw err.response.data;
});

export default instance;
