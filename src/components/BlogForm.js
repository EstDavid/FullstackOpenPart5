import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')

    const handleSubmit = async (event) => {
        event.preventDefault()
        await createBlog({
            title,
            author,
            url
        })

        setTitle('')
        setAuthor('')
        setUrl('')
    }
  
    return (
        <div>
            <h2>create new</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor='title-field'>title:</label>
                    <input
                        id='title-field'
                        value={title}
                        onChange={({ target }) => setTitle(target.value)}
                    />
                </div>
                <div>
                    <label htmlFor='author-field'>author:</label>
                    <input
                        id='author-field'
                        value={author}
                        onChange={({ target }) => setAuthor(target.value)}
                    />
                </div>
                <div>
                    <label htmlFor='url-field'>url:</label>
                    <input
                        id='url-field'
                        value={url}
                        onChange={({ target }) => setUrl(target.value)}
                    />
                </div>
                <button type="submit">create</button>
            </form>  
        </div>
    )
}

export default BlogForm