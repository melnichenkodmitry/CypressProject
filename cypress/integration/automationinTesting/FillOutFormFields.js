import {mockRequests} from './mock'

context('FillOutFormFields', function () {

    beforeEach(function () {
        mockRequests()
        cy.intercept('GET', '**/branding', {fixture: 'automationinTesting/branding.json'}).as('branding')
        cy.intercept('GET', '**/room', {fixture: 'automationinTesting/room.json'}).as('room')
        cy.intercept('POST', '**/message', {statusCode: 201, fixture: 'automationinTesting/message.json'}).as('message')
        cy.visit('/')

    })

    function fillForm() {
        cy.wait(['@branding', '@room'])
        cy.get('input[data-testid="ContactName"]').type('Dmitry Melnichenko')
        cy.get('input[data-testid="ContactEmail"]').type('qube.mel99@gmail.com')
        cy.get('input[data-testid="ContactPhone"]').type('89143913525')
        cy.get('input[data-testid="ContactSubject"]').type('big room')
        cy.get('textarea[data-testid="ContactDescription"]').type('Call me, call me, call me')
    }

    it('checkRequest', () => {
        fillForm()
        cy.get('button[id="submitContact"]').click()

        //проверка параметров запроса, которые отправляются как объект
        cy.wait('@message').should(xhr => {
            expect(xhr.request.body).have.property('description', 'Call me, call me, call me')
            expect(xhr.request.body).have.property('email', 'qube.mel99@gmail.com')
            expect(xhr.request.body).have.property('name', 'Dmitry Melnichenko')
            expect(xhr.request.body).have.property('phone', '89143913525')
            expect(xhr.request.body).have.property('subject', 'big room')
        })

        cy.get('div[class="row contact"]').should('contain', 'Thanks for getting in touch Dmitry Melnichenko!').and('contain', 'big room')
    })
})