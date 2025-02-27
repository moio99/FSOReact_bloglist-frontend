import axios from 'axios'
const baseUrl = '/api/blogs'

const getBaseURL = () => {
  const url = '/api/persons'
  const devUrl = 'http://localhost:3003'
  const mode = import.meta.env.MODE
  if (mode === 'development') {
    return devUrl + baseUrl
  }
  return url  
}

const getAll = () => {
  // const request = axios.get(baseUrl)
  const request = axios.get(getBaseURL())
  return request.then(response => response.data)
}

export default { getAll }