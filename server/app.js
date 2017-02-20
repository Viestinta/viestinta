
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

// URL-specifications
// Go to index.html
app.get('/', (req, res) => {res.sendFile(path.resolve(__dirname, '../client/index.html'))})
app.get('/user', (req, res) => res.json({'hello': 'world', 'user': req.user}))
app.get('/login', passport.authenticate('passport-openid-connect', {'successReturnToOrRedirect': '/'}))
app.get('/callback', passport.authenticate('passport-openid-connect', {'callback': true, 'successReturnToOrRedirect': '/'}))

// Opens a port and listens on it
server.listen(app.get('port'), (err) => {
  if (err) throw err
  console.log('Node app is running on port', app.get('port'))
})

// Not sure what this does or if it is dupliacte
var io = require('socket.io')(server)

// Create a connection
//var socket = io.connect('http://localhost::8000')

var num_sockets = 0
// Listen for connections
io.sockets.on('connection', function(socket){
	// Reports when it finds a connection
	console.log('Client connected')
	num_sockets ++;
	console.log("Num clients: ", num_sockets)
	
	// Wait for a message from the client for 'join'
	socket.on('join', function(data) {
		console.log("New client have joined")
		socket.emit('messages', 'Hello from server')
		num_sockets ++
	})

	// Wait for a message from the client for 'join'
	socket.on('leave', function(data) {
		console.log("Client have left")
		socket.emit('messages', 'Goodbye from server')
		num_sockets --
	})



	// When a new message is sendt from somebody
	socket.on('new-message', function(msg){
		console.log("Message in new-message in app.js: " + msg.text)
		io.sockets.emit('receive-message', msg)

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