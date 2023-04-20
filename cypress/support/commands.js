// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('login', ({ username, password }) => {
    cy.visit('')
    cy.get('button:visible').contains('log in').click()
    cy.get('#username').type(username)
    cy.get('#password').type(password)
    cy.get('#login-button').click()
})

Cypress.Commands.add('createBlog', ({ title, author, url }) => {
    cy.get('button:visible').contains('new blog').click()
    cy.get('#title-field').type(title)
    cy.get('#author-field').type(author)
    cy.get('#url-field').type(url)
    cy.get('#blog-submit').click()
})

Cypress.Commands.add('showDetails', (blogTitle) => {
    cy.get('.blog')
        .contains(blogTitle)
        .parent()
        .parent()
        .as('blog')

    cy.get('@blog').find('button').contains('show').click()
})

Cypress.Commands.add('likeBlog', (blogTitle, likes) => {
    for(let i = 0; i < likes; i += 1) {
        cy.get('.blog')
            .contains(blogTitle)
            .parent()
            .parent()
            .as('blog')

        cy.get('@blog').find('button').contains('like').click()
        cy.wait(500)
    }
})