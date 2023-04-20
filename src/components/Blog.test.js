import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const blogUser = {
    username: 'admin',
    name: 'John Hopkins'
}

const blog = {
    title: 'How to write a blog with high traffic',
    author: 'Jeremy Higgins',
    url: 'https://www.blogposts.com/how-to-write-blog-high-traffic',
    likes: 0,
    user: blogUser
}

describe('<Blog />', () => {
    let container
    let updateBlog

    beforeEach(() => {
        updateBlog = jest.fn()
        container = render(<Blog
            blog={blog}
            loggedUser={blogUser}
            update={updateBlog}
        />).container
    })

    test('renders title and author', async () => {
        await screen.findAllByText('How to write a blog with high traffic Jeremy Higgins')
    })

    test('does not render likes or url', () => {
        const div = container.querySelector('.blogDetails')
        expect(div).toHaveStyle('display: none')

        const likesElement = screen.getByText('likes 0')
        expect(likesElement).not.toBeVisible()

        const urlElement = screen.getByText('https://www.blogposts.com/how-to-write-blog-high-traffic')
        expect(urlElement).not.toBeVisible()
    })

    test('renders url and likes when show details button is clicked', async () => {
        const user = userEvent.setup()
        const button = screen.getByText('show')
        await user.click(button)

        const div = container.querySelector('.blogDetails')
        expect(div).not.toHaveStyle('display: none')

        const likesElement = screen.getByText('likes 0')
        expect(likesElement).toBeVisible()

        const urlElement = screen.getByText('https://www.blogposts.com/how-to-write-blog-high-traffic')
        expect(urlElement).toBeVisible()
    })

    test('likes button event handler is called twice if clicked twice', async () => {
        const user = userEvent.setup()
        const showButton = screen.getByText('show')
        await user.click(showButton)

        const likesButton = screen.getByText('like')
        await user.click(likesButton)
        await user.click(likesButton)

        expect(updateBlog.mock.calls).toHaveLength(2)
    })
})
