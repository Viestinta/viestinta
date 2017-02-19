
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
  .file({ file: 'server/etc/config.json' })
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

// Go to index.html
app.get('/', (req, res) => {res.sendFile(path.resolve(__dirname, '../client/index.html'))})

app.get('/user', (req, res) => res.json({'hello': 'world', 'user': req.user}))

app.get('/login', passport.authenticate('passport-openid-connect', {'successReturnToOrRedirect': '/'}))
app.get('/callback', passport.authenticate('passport-openid-connect', {'callback': true, 'successReturnToOrRedirect': '/'}))

server.listen(app.get('port'), (err) => {
  if (err) throw err
  console.log('Node app is running on port', app.get('port'))
})

const io = require('socket.io').listen(server)


io.on('connection', function(socket){
	console.log('Connection')
	var session = socket.handshake.session
	console.log("Session: " + session)
	socket.on('new-message', function(msg){
		console.log("Message: " + msg)
		io.emit('receive-message', msg)

	})
	socket.on('test', function(){
		console.log('Mounted')
	})
})

// To get static files. Need to ble cleaned up
app.use('/', express.static(path.resolve(__dirname, '../client/')))
app.use(express.static(path.resolve(__dirname, '../client/css/')))
app.use('/components', express.static(path.resolve(__dirname, '../client/components')))
app.use('/css', express.static(path.resolve(__dirname, '../client/css')))