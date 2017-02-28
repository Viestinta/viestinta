
// ///////////////////////////////////////////////////
// Server/Root File For The Viestinta Project
// ///////////////////////////////////////////////////

// ///////////////////////////////////////////////////
// Include Statments
// ///////////////////////////////////////////////////

const express = require('express')
const passport = require('passport')
const bodyparser = require('body-parser')
const cookieparser = require('cookie-parser')
const session = require('express-session')
// const morgan = require('morgan')
const nconf = require('nconf')

const path = require('path')
const PDStrategy = require('passport-openid-connect').Strategy
// const User = require('passport-openid-connect').User

// ///////////////////////////////////////////////////
// Initial Server Setup
// ///////////////////////////////////////////////////

nconf.argv()
  .env('__')
  .file({ file: 'src/server/etc/config.json' })
  .defaults({
    'http': {
      'port': 8080,
      'enforceHTTPS': false
    },
    'session': {
      'secret': 'SSSSEEEECCCCRRRREEEETTTTSECRET'
    },
    'dataporten': {
      'enableAuthentication': false
    }
  })

const app = express()
const server = require('http').createServer(app)

app.set('view options', { pretty: true })
app.set('json spaces', 2)
app.set('port', 8000)

app.use(cookieparser())
app.use(bodyparser.urlencoded({extended: true}))
app.use(bodyparser.json())
app.use(session({
  secret: 'MagicSealsAndNarwalsDancingTogetherInRainbows',
  resave: false,
  saveUninitialized: false
}))

var pd = new PDStrategy(nconf.get('dataporten'))

passport.use(pd)
passport.serializeUser(PDStrategy.serializeUser)
passport.deserializeUser(PDStrategy.deserializeUser)

app.use(passport.initialize())
app.use(passport.session())

// ///////////////////////////////////////////////////
// Main App
// ///////////////////////////////////////////////////

// URL-specifications
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

server.listen(app.get('port'), (err) => {
  if (err) throw err
  console.log('Node app is running on port', app.get('port'))
})

// Create a connection
// var socket = io.connect('http://localhost::8000')
var io = require('socket.io')(server)

// Listen for connections
io.sockets.on('connection', function (socket) {
  // Reports when it finds a connection
  console.log('Client connected')

  // Wait for a message from the client for 'join'
  socket.on('join', function (data) {
    console.log('New client have joined')
    socket.emit('messages', 'Hello from server')
  })

  // Wait for a message from the client for 'join'
  socket.on('leave', function (data) {
    console.log('Client have left')
    socket.emit('messages', 'Goodbye from server')
  })

  // When a new message is sendt from somebody
  socket.on('new-message', function (msg) {
    console.log('Message in new-message in app.js: ' + msg.text)
    io.sockets.emit('receive-message', msg)
  })

  socket.on('test', function () {
    console.log('Mounted')
  })
})



app.use('/', express.static(path.resolve(__dirname, '../client/')))
app.use(express.static(path.resolve(__dirname, '../static/css/')))
app.use('/components', express.static(path.resolve(__dirname, '../client/components')))
app.use('/css', express.static(path.resolve(__dirname, '../static/css')))

// SETUP FOR DATABASE
// TODO: Flytt til annen fil, eller gjør som del av user login/creation. Må bare kjøres før user objektet skal brukes.

const db = require('./database/models/index')

const user = db['User']
user.sync({force: true}).then(function () {
  return user.create({
    name: 'Pekka Foreleser'
  })
})
