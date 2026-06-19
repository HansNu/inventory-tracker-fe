import applyCaseMiddleware from "axios-case-converter";
import axios from 'axios'

const client = applyCaseMiddleware(axios.create({
    baseURL: 'http://localhost:5050'
}))

export default client