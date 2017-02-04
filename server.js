
/////////////////////////////////////////////////////
// Server/Root File For The Viestinta Project
/////////////////////////////////////////////////////

/////////////////////////////////////////////////////
// Include Statments
/////////////////////////////////////////////////////

var express = require('express')
var passport = require('passport')
var bodyparser = require('body-parser')
var cookieparser = require('cookie-parser')
var session = require('express-session')
var morgan = require('morgan')
var nconf = require('nconf')

var PDStrategy = require('passport-openid-connect').Strategy
var User = require('passport-openid-connect').User

/////////////////////////////////////////////////////
// Initial Server Setup
/////////////////////////////////////////////////////

nconf.argv()
    .env('__')
    .file({ file: 'etc/config.json' })
    .defaults({
		"http": {
			"port": 8080,
			"enforceHTTPS": false
		},
		"session": {
			"secret": "SSSSEEEECCCCRRRREEEETTTTSECRET"
		},
		"dataporten": {
			"enableAuthentication": false
		}
    })

const app = express()
app.set('view options', { pretty: true })
app.set('json spaces', 2)
app.set('port', 8000)

app.use(cookieparser())
app.use(bodyparser.urlencoded({extended: true}))
app.use(bodyparser.json())
app.use(session({
	secret: "MagicSealsAndNarwalsDancingTogetherInRainbows",
	resave: false,
	saveUninitialized: false
}))


var pd = new PDStrategy(nconf.get("dataporten"))

passport.use(pd)
passport.serializeUser(PDStrategy.serializeUser)
passport.deserializeUser(PDStrategy.deserializeUser)

app.use(passport.initialize())
app.use(passport.session())

let router = express.Router()

/////////////////////////////////////////////////////
// Main App
/////////////////////////////////////////////////////

router.route('/')
    .get((req, res) => {
        res.json({
            "hello": "world",
            "user": req.user
        })
    })
app.get('/login', passport.authenticate('passport-openid-connect', {"successReturnToOrRedirect": "/"}))
app.get('/callback', passport.authenticate('passport-openid-connect', {"callback": true, "successReturnToOrRedirect": "/"}))

app.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'))
});