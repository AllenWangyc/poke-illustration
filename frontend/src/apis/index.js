import axios from "axios"

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/species`;

const request = axios.create({
  baseURL: BASE_URL,
  timeout: 5000
})

export function allSpeciesAPI() {
  return request({
    url: '/',
    method: 'GET',
  })
}