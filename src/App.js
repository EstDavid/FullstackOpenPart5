import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [notification, setNotification] = useState(null)
  const [hasError, setHasError] = useState(false)

  const getBlogs = async () => {
    const blogs = await blogService.getAll()
    setBlogs(blogs)
  }

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
      getBlogs()
    }
  }, [])

  const handleFormChange = (event, callback) => {
    callback(event.target.value)
  }

  const handleLogin = async(event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')

      getBlogs()
    } catch(exception) {
      setNotification('Wrong credentials')
      setHasError(true)
      setTimeout(() => {
        setNotification(null)
        setHasError(false)
      }, 5000)
    }
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.clear()
  }

  const addBlog = async (event) => {
    event.preventDefault()

    const newBlog = await blogService.create({
      title,
      author,
      url
    })

    setBlogs(blogs.concat(newBlog))
    setTitle('')
    setAuthor('')
    setUrl('')

    setNotification(`A new blog ${newBlog.title} by ${newBlog.author} added`)
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const blogForm = () => (
    <form onSubmit={addBlog}>
      <div>
        <label htmlFor='title-field'>title:</label>
        <input
          id='title-field'
          value={title}
          onChange={(event) => handleFormChange(event, setTitle)}
        />
      </div>
      <div>
      <label htmlFor='author-field'>author:</label>
        <input
          id='author-field'
          value={author}
          onChange={(event) => handleFormChange(event, setAuthor)}
        />
      </div>
      <div>
        <label htmlFor='url-field'>url:</label>
        <input
          id='url-field'
          value={url}
          onChange={(event) => handleFormChange(event, setUrl)}
        />
      </div>
      <button type="submit">create</button>
    </form>  
  )

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={notification} hasError={hasError}></Notification>
        <form onSubmit={handleLogin}>
          <div>
            username
              <input
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
              <input
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>      
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notification} hasError={hasError}></Notification>
      <div>
        <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
      </div>
      {blogForm()}
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App