import { useState } from 'react'

const Blog = ({ blog, update, loggedUser, remove }) => {
    const [showDetails, setShowDetails] = useState(false)

    const showWhenDetails = { display: showDetails ? '' : 'none' }

    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5
    }

    const toggleDetails = () => {
        setShowDetails(!showDetails)
    }

    const handleLike = () => {
        const { id, title, author, url } = blog
        const likes = blog.likes + 1
        const user = blog.user.id
        update({
            id,
            title,
            author,
            url,
            likes,
            user
        })
    }

    const handleRemove = () => {
        if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
            remove(blog)
        }
    }

    return (
        <div className='blog' style={blogStyle}>
            <div>
                <p>{blog.title} {blog.author}
                    <button
                        onClick={toggleDetails}
                    >{showDetails ? 'hide' : 'show'}
                    </button>
                </p>
            </div>
            <div style={showWhenDetails} className='blogDetails'>
                <p>{blog.url}</p>
                <p>{`likes ${blog.likes}`}<button onClick={handleLike}>like</button></p>
                {blog.user !== undefined ?
                    <p>{blog.user.name}</p>
                    :
                    null
                }
                {loggedUser.username === blog.user.username ?
                    <button onClick={handleRemove}>remove</button>
                    :
                    null
                }
            </div>
        </div>
    )
}

export default Blog