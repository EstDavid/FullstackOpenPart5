describe('Blog app', function() {
    beforeEach(function() {
        cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
        const user = {
            username: 'admin',
            name: 'John Hopkins',
            password: 'ramen'
        }
        cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)

        const rootUser = {
            username: 'root',
            name: 'Matt Bigelow',
            password: 'rootaccess'
        }
        cy.request('POST', `${Cypress.env('BACKEND')}/users`, rootUser)

        cy.visit('')
    })

    describe('Login', function() {
        it('succeeds with correct credentials', function() {
            cy.login({ username: 'admin', password: 'ramen' })

            cy.contains('John Hopkins logged in')
        })

        it('fails with wrong credentials', function() {
            cy.login({ username: 'admin', password: 'wrongpassword' })

            cy.get('.error')
                .should('contain', 'Wrong credentials')
                .and('have.css', 'color', 'rgb(255, 0, 0)')
        })
    })

    describe('Blog app', function() {
        describe('when logged in', function() {
            beforeEach(function() {
                cy.login({ username: 'admin', password: 'ramen' })
            })

            it('A blog can be created', function() {
                const newBlog = {
                    title: 'How to create blog posts',
                    author: 'Thomas White',
                    url: 'http://www.blogposts.com/how-to-create-blog-posts'
                }
                cy.createBlog(newBlog)

                cy.get('.notification')
                    .should('contain', 'A new blog How to create blog posts by Thomas White added')
                    .and('have.css', 'color', 'rgb(0, 128, 0)')

                cy.contains('How to create blog posts by Thomas White')
            })

            describe('when blogs are created', function() {
                beforeEach(function() {
                    const blog = {
                        title: 'How to write a recipes blog',
                        author: 'Julia Saltyman',
                        url: 'http://www.blogposts.com/how-to-write-a-recipes-blog'
                    }

                    cy.createBlog(blog)
                })

                it('allows user to like', function() {
                    cy.contains('How to write a recipes blog')
                        .get('button')
                        .contains('show')
                        .click()

                    cy.contains('How to write a recipes blog')
                        .parent()
                        .parent()
                        .find('button')
                        .contains('like')
                        .click()

                    cy.contains('How to write a recipes blog')
                        .parent()
                        .parent()
                        .should('contain', 'likes 1')
                })

                it('allows user to delete their blog', function() {
                    cy.contains('How to write a recipes blog')
                        .get('button')
                        .contains('show')
                        .click()

                    cy.contains('How to write a recipes blog')
                        .parent()
                        .parent()
                        .find('button')
                        .contains('remove')
                        .click()

                    cy.should('not.contain', 'How to write a recipes blog')
                })

                it('does not allow user to delete the blog of another user', function() {
                    cy.get('button').contains('logout').click()
                    cy.login({ username: 'root', password: 'rootaccess' })

                    cy.showDetails('How to write a recipes blog')

                    cy.get('.blog')
                        .contains('How to write a recipes blog')
                        .parent()
                        .parent()
                        .as('blog')

                    cy.get('@blog').should('not.contain', 'remove')
                })

                it('orders blogs according to likes', function() {
                    const blog2 = {
                        title: 'Finding ideas for blog titles',
                        author: 'Jefferson James',
                        url: 'http://www.blogposts.com/finding-ideas-blog-titles'
                    }

                    const blog3 = {
                        title: 'Increasing the likes in your blog',
                        author: 'Thomas White',
                        url: 'http://www.blogposts.com/increasing-likes-in-your-blog'
                    }

                    cy.createBlog(blog2)
                    cy.createBlog(blog3)

                    cy.showDetails('How to write a recipes blog')
                    cy.likeBlog('How to write a recipes blog', 3)

                    cy.showDetails('Finding ideas for blog titles')
                    cy.likeBlog('Finding ideas for blog titles', 5)

                    cy.showDetails('Increasing the likes in your blog')
                    cy.likeBlog('Increasing the likes in your blog', 4)

                    cy.get('.blog').eq(0).should('contain', 'Finding ideas for blog titles')
                    cy.get('.blog').eq(1).should('contain', 'Increasing the likes in your blog')
                    cy.get('.blog').eq(2).should('contain', 'How to write a recipes blog')
                })
            })
        })
    })
})