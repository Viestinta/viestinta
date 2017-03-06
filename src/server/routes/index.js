  // URL-specifications

const path = require('path')
const passport = require('passport')

const userController = require('./controllers').user
const messagesController = require('./controllers').messages
const feedbacskCOntroller = require('./controllers').feedbacks

module.exports = (app) => {
  // Go to index.html
  app.get('/', (req, res) => { res.sendFile(path.resolve(__dirname, '../client/index.html')) })
  app.get('/user', (req, res) => {
    if (req.user) {
      res.json({user: req.user})
    } else {
      res.status(404)
    }
  })

  app.get('/connect', (req, res) => {
    if (req.user) {
      let userinfo = req.user.data
      db['User'].findOrCreate({
        where: {name: userinfo.name, sub: userinfo.sub, email: userinfo.email, email_verified: userinfo.email_verified}
      })
            .spread(function (user, created) {
              console.log(user)
            })
          .catch((err) => {
            console.error(err)
          })
    } else {
      res.status(403)
    }
  })

  app.get('/login', passport.authenticate('passport-openid-connect', {'successReturnToOrRedirect': '/'}))
  app.get('/callback', passport.authenticate('passport-openid-connect', {'callback': true, 'successReturnToOrRedirect': '/'}))


  // Related to database
  app.post('/', messages)


  /**
  app.post('/api/todos', todosController.create)
  app.get('/api/todos', todosController.list)
  app.get('/api/todos/:todoId', todosController.retrieve)
  app.put('/api/todos/:todoId', todosController.update)
  app.delete('/api/todos/:todoId', todosController.destroy)

  app.post('/api/todos/:todoId/items', todoItemsController.create)
  app.put('/api/todos/:todoId/items/:todoItemId', todoItemsController.update)
  app.delete(
    '/api/todos/:todoId/items/:todoItemId', todoItemsController.destroy
  )
  app.all('/api/todos/:todoId/items', (req, res) => res.status(405).send({
    message: 'Method Not Allowed'
  }))
  **/
}
