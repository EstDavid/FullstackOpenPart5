import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

const newBlog = {
    title: 'How to write a blog with high traffic',
    author: 'Jeremy Higgins',
    url: 'https://www.blogposts.com/how-to-write-blog-high-traffic',
}

test('form calls event handler with right details when new blog is created', async () => {
    const createBlog = jest.fn()
    const { container } = render(<BlogForm createBlog={createBlog} />)

    const user = userEvent.setup()

    const titleInput = container.querySelector('#title-field')
    const authorInput = container.querySelector('#author-field')
    const urlInput = container.querySelector('#url-field')
    const submitButton = screen.getByText('create')

    await user.type(titleInput, newBlog.title)
    await user.type(authorInput, newBlog.author)
    await user.type(urlInput, newBlog.url)

    await user.click(submitButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe('How to write a blog with high traffic')
    expect(createBlog.mock.calls[0][0].author).toBe('Jeremy Higgins')
    expect(createBlog.mock.calls[0][0].url).toBe('https://www.blogposts.com/how-to-write-blog-high-traffic')
})