// ///////////////////////////////////////////////////
// Setup for database
// ///////////////////////////////////////////////////

// TODO: Flytt til annen fil, eller gjør som del av user login/creation. Må bare kjøres før user objektet skal brukes.

const db = require('./database/models/index')

const user = db['User']
const message = db['Message']
const feedback = db['Feedback']

const userController = require('./database/controllers').user
const messageController = require('./database/controllers').message
const feedbackController = require('./database/controllers').feedback

user.sync({force: true}).then(function () {
  return user.create({
    name: 'Pekka Foreleser'
  })
})