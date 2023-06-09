import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
    token =`Bearer ${newToken}`
}

const getAll = async () => {
    const config = {
        headers: { Authorization: token },
    }
    const response = await axios.get(baseUrl, config)
    return response.data
}

const create = async (newBlog) => {
    const config = {
        headers: { Authorization: token },
    }
    const response = await axios.post(baseUrl, newBlog, config)
    return response.data
}

const update = async (updatedBlog) => {
    const config = {
        headers: { Authorization: token }
    }

    const blogUrl = baseUrl + '/' + updatedBlog.id
    const response = await axios.put(blogUrl, updatedBlog, config)
    return response.data
}

const remove = async (blogToRemove) => {
    const config = {
        headers: { Authorization: token }
    }

    const blogUrl = baseUrl + '/' + blogToRemove.id
    const response = await axios.delete(blogUrl, config)
    return response.status
}

export default { getAll, create, update, setToken, remove }