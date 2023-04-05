import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Toggable from './components/Toggable'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])

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

  const login = async (username, password) => {
    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      
      blogService.setToken(user.token)
      setUser(user)
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

  const logout = () => {
    setUser(null)
    window.localStorage.clear()
  }

  const blogFormRef = useRef()

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    const newBlog = await blogService.create(blogObject)
    newBlog.user = user

    setBlogs(blogs.concat(newBlog))

    setNotification(`A new blog ${newBlog.title} by ${newBlog.author} added`)
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const updateBlog = async (blogObject) => {
    const updatedBlog = await blogService.update(blogObject)
    setBlogs(blogs.map((blog) => {
      if (blog.id  === updatedBlog.id) {
        return updatedBlog
      }
      return blog
    })
    )
  }

  const removeBlog = async (blogObject) => {
    const response = await blogService.remove(blogObject)
    if (response === 204) {
      setBlogs(blogs.filter(blog => {
          return blog.id !== blogObject.id
        })
      )
    }
  }

  if (user === null) {
    return (
      <Toggable buttonLabel='log in'>
        <Notification message={notification} hasError={hasError}></Notification>
        <LoginForm createLogin={login} />
      </Toggable>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <div>
          <p>{user.name} logged in <button onClick={logout}>logout</button></p>
      </div>
      <Toggable buttonLabel='new blog' ref={blogFormRef}>
        <Notification message={notification} hasError={hasError}></Notification>
        <BlogForm createBlog={addBlog} />
      </Toggable>
      {blogs.sort((a, b) => b.likes - a.likes).map(blog =>
        <Blog 
          key={blog.id}
          blog={blog}
          update={updateBlog}
          loggedUser={user}
          remove={removeBlog}
        />
      )}
    </div>
  )
}

export default App