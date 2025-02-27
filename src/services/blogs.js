import axios from 'axios'
const baseUrl = '/api/blogs'
let token = null

const getBaseURL = () => {
  const devUrl = 'http://localhost:3003'
  const mode = import.meta.env.MODE
  if (mode === 'development') {
    return devUrl + baseUrl
  }
  return baseUrl  
}

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(getBaseURL())
  return request.then(response => response.data)
}

const create = (blog) => {
  const config = {
    headers: { Authorization: token },
  }

  return axios.post(getBaseURL(), blog, config)
}

const update = (id, blog) => {
  const config = {
    headers: { Authorization: token },
  }

  return axios.put(`${getBaseURL()}/${id}`, blog, config)
}

export default { getAll, setToken, create, update }