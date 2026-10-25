const email = 'demo@smartsender.com'
const password = 'SmartSender123!'

function signIn() {
  cy.visit('/login')
  cy.get('#email').type(email)
  cy.get('#password').type(password)
  cy.contains('button', 'Sign in').click()
  cy.contains('h1', 'Webhooks').should('be.visible')
}

describe('Smart Sender webhooks', () => {
  it('shows server-side login validation', () => {
    cy.visit('/login')
    cy.get('#email').type(email)
    cy.get('#password').type('incorrect')
    cy.contains('button', 'Sign in').click()
    cy.contains('These credentials do not match our records.').should('be.visible')
  })

  it('filters by name and keeps the search in the URL', () => {
    signIn()
    cy.get('[aria-label="Search webhooks"]').type('Order paid')
    cy.location('search').should('contain', 'search=Order')
    cy.get('[data-testid="webhook-row"]').should('have.length.greaterThan', 0)
    cy.get('[data-testid="webhook-row"]').each(row => cy.wrap(row).contains('Order paid'))
  })

  it('edits a webhook and confirms the save with a toast', () => {
    signIn()
    cy.get('[data-testid="webhook-row"]')
      .first()
      .within(() => cy.contains('Edit').click())
    cy.get('[role="dialog"]').should('be.visible')
    cy.get('#webhook-name').clear().type('Lead created — updated')
    cy.get('#webhook-url').clear().type('https://hooks.example.com/lead-created')
    cy.contains('button', 'Save changes').click()
    cy.contains('Webhook updated').should('be.visible')
    cy.get('[data-testid="webhook-row"]').first().contains('Lead created — updated')
  })
})
