import axios from 'axios'

const $api = axios.create({ withCredentials: true, responseType: 'json' })

export default $api
