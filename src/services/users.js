import axios from 'axios'
const baseUrl = '/api/users'

const getBaseURL = () => {
  const devUrl = 'http://localhost:3003'
  const mode = import.meta.env.MODE
  if (mode === 'development') {
    return devUrl + baseUrl
  }
  return baseUrl
}

const allUsers = async () => {
  const response = await axios.get(getBaseURL())
  return response.data
}

export default { allUsers }
