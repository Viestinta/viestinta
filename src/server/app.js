
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
const redisAdapter = require('socket.io-redis')
const session = require('express-session')
const nconf = require('nconf')
const path = require('path')

const PDStrategy = require('passport-openid-connect').Strategy
const router = require('./routes')
const sockets = require('./sockets')

// ///////////////////////////////////////////////////
// Initial Server Setup
// ///////////////////////////////////////////////////

nconf.argv()
  .env('__')
  .file({ file: path.resolve(__dirname, './etc/config.json') })
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

// ///////////////////////////////////////////////////
// Redis and ExpressJS session setup
// ///////////////////////////////////////////////////

const RedisStore = require('connect-redis')(session)

// Create SocketIO server
var io = require('socket.io')(server)

// 'redis' is a relative Docker IP, supply URL in env if it's not Docker
var redisHost = process.env['REDIS_URL'] || 'redis'
if (process.env.NODE_ENV !== 'test') {
  // Create redis client
  const redis = require('redis').createClient('6379', redisHost)

  // Creating Redis SessionStore
  const sessionStore = new RedisStore({host: redisHost, port: 6379, client: redis})

  io.adapter(redisAdapter({ host: redisHost, port: 6379, client: redis })) // Faulty warning for client: redis

  // Connects to Redis server
  redis.on('connect', function () {
    console.log('Redis connected')
  })

  // Declaring session options
  let sess = {
    secret: process.env.VIESTINTA_SESSION_SECRET || 'MagicSealsAndNarwalsDancingTogetherInRainbows',
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {}
  }

  // Enable secure cookies for production env, using HTTPS
  if (app.get('env') === 'production') {
    sess.cookie.secure = true
  }

  // Sends the session object to Express,
  // containing the sess options and references to the Redis SessionStorage
  app.use(session(sess))

  // Session handling for disconnects
  app.use(function (req, res, next) {
    if (!req.session) {
      return next(new Error('oh no')) // handle error
    }
    next() // otherwise continue
  })
}

// ///////////////////////////////////////////////////
// Passport/Dataporten setup
// ///////////////////////////////////////////////////

// Get all the config items from nconf in one request
let pdConfigNconf = nconf.get('dataporten')

// Set OAUTH2 config with either environment variables
// or if they are not available, get them from nconf (./etc/config.json)
let pdConfig = {
  'issuerHost': process.env.VIESTINTA_OAUTH2_HOST_URL || pdConfigNconf.issuerHost,
  'client_id': process.env.VIESTINTA_OAUTH2_CLIENT_ID || pdConfigNconf.client_id,
  'client_secret': process.env.VIESTINTA_OAUTH2_CLIENT_SECRET || pdConfigNconf.client_secret,
  'redirect_uri': process.env.VIESTINTA_OAUTH2_REDIRECT_URI || pdConfigNconf.redirect_uri,
  'scope': process.env.VIESTINTA_OAUTH2_SCOPE || pdConfigNconf.scope
}

// Initialize a PassportDataportenStrategy with the OAUTH2 config
var pd = new PDStrategy(pdConfig)

passport.use(pd)
passport.serializeUser(PDStrategy.serializeUser)
passport.deserializeUser(PDStrategy.deserializeUser)

app.use(passport.initialize())
app.use(passport.session())

// ///////////////////////////////////////////////////
// Routing and SocketIO
// ///////////////////////////////////////////////////

router(app)
sockets(io)

// ///////////////////////////////////////////////////
// End of file
// ///////////////////////////////////////////////////

// Prevent NodeJS container from locking into listen when running in test env
const port = process.env.VIESTINTA_OVERWRITE_PORT || app.get('port')

if (process.env.NODE_ENV !== 'test') {
  server.listen(port, (err) => {
    if (err) throw err
    console.log('Node app is running on port', port)
  })
}

// For fake module export in test env
if (process.env.NODE_ENV !== 'test') {
  var redis = 10
}

module.exports = {
  redis,
  app,
  server
}

const viestinta = [
  '       _           _   _       _        ',
  '__   _(_) ___  ___| |_(_)_ __ | |_ __ _ ',
  "\\ \\ / / |/ _ \\/ __| __| | '_ \\| __/ _` |",
  ' \\ V /| |  __/\\__ \\ |_| | | | | || (_| |',
  '  \\_/ |_|\\___||___/\\__|_|_| |_|\\__\\__,_|',
  '                                        '
]

console.log(viestinta.join('\n'))
