describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)   // antes con http://localhost:3003/api

    const user = {
      name: 'test name',
      username: 'testUser',
      password: 'testPass'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users/`, user)  // antes con http://localhost:3003/api

    cy.visit('')  // antes http://localhost:5173
  })

  it('Login form is shown', function() {
    cy.contains('log in to application')
    cy.contains('username')
    cy.contains('login')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('testUser')
      cy.get('#password').type('testPass')
      cy.get('#login-button').click()
      cy.contains('test name logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('testUserWrong')
      cy.get('#password').type('testPass')
      cy.get('#login-button').click()
      
      cy.contains('Wrong username or password').should('have.css', 'color', 'rgb(255, 0, 0)')
      cy.get('html').should('not.contain', 'test name logged in')
      // igual ca o de cima
      cy.contains('test name logged in').should('not.exist')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'testUser', password: 'testPass' })
    })

    it('A blog can be created', function() {
      cy.get('#buttonNewBlog').click()
      cy.get('#title').type('test title')
      cy.get('#author').type('test author')
      cy.get('#url').type('test url')
      cy.get('#testCreate').click()
      cy.contains('Added blog title: "test title"!')
    })
    
    describe('Blogs Management', function() {
      beforeEach(function() {
        cy.createBlog({
          title: 'test title',
          author: 'test author',
          url: 'test url'
        })
      })

      it('it can be change likes count', function () {
        cy.contains('view').click()
        cy.contains('like').click()
        cy.contains('likes: 1')
        cy.contains('Updated likes blog: "test title" likes 1!').should('have.css', 'color', 'rgb(0, 128, 0)')
      })
    })
  })
})