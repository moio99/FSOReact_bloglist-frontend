import axios from 'axios'
const baseUrl = '/api/login'

const getBaseURL = () => {
  const devUrl = 'http://localhost:3003'
  const mode = import.meta.env.MODE
  if (mode === 'development') {
    return devUrl + baseUrl
  }
  return baseUrl
}

const login = async credentials => {
  const response = await axios.post(getBaseURL(), credentials)
  return response.data
}

export default { login }