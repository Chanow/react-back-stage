
import axios from 'axios';
axios.defaults.withCredentials = true


const config = {
    url: 'http://39.104.206.71:80/api/'
}

export function post(url, data, options) {
    return (
        axios.post(config.url + url, data).then(res => {
            return res
        }).catch(error => {
            return error
        })
    )

}

export function get(url) {
    return (
        axios.get(config.url + url).then(res => {
            return res
        }).catch(error => {
            return error
        })
    )

}


