describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')

    const user = {
      name: 'test name',
      username: 'testUser',
      password: 'testPass'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)

    cy.visit('http://localhost:5173')
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
    })
  })
})