var should = require('should')
var io = require('socket.io-client')

import React from 'react'
var react = require('react')
// var render = require('enzyme')
import { render, shallow } from 'enzyme'
import { assert, expect } from 'chai'

var server = require('../../server/app')

import Message from '../client'

// Testing socket.io
describe('Socket.io', function() {
	var socketURL = 'http://127.0.0.1:8000'

	var options = {
		transports: ['websocket'],
		'force new connection': true
	}

	var user1 = {'name' : 'Tom'}
	var user2 = {'name' : 'Else'}
	var user3 = {'name' : 'Turid'}
	var user4 = {'name' : 'Hans'}

	
	// Create a message object
	it('Should be able to create message component', function()  {

		//const wrapper = render(<Message text="Hello world"/>)
		const message = render(<Message text='Hello world'/>)
		console.log("after rendering")

		assert.equal(message.text(), 'Hello world')
		console.log(assert.equal(message.text(), 'Hello world'))
		console.log("After equal")
	})

	/*
	it('Should be able to create message component', function(done) {

		wrapper = render(<Message text="Hello world"/>)
		
		if (assert.equal(wrapper.text(), 'Hello world')):
			console.log("Equal")
			done()
		else:
			console.log("Not equal")
	})
	*/
	// Test 1
	it('Should be able to broadcast messages', function(done) {
		var user1, user2, user3, user4
		//var message = render(<Message text='Hello world'/>)
		var message = 'Hello world'
		var messages = 0

		var checkMessages = function (client) {
			console.log("In checkMessages\n")
			client.on('message', function(msg) {
				console.log("------in client.on")
				message.should.equal(msg)
				//console.log("Text: ", message.text())
				// message.text.should.equal(msg.text)
				//client.disconnect()
				messages++
				console.log(messages)
				if (messages === 4) {
					done()
				}
			})
		}

		console.log("In test before first connect")
		
		user1 = io.connect(socketURL, options)
		console.log("Before first check")
		checkMessages(user1)

		user1.on('connect', function(data) {
			console.log("In user1.on")
			user2 = io.connect(socketURL, options)
			checkMessages(user2)

			user2.on('connect', function(data) {
				console.log("In user2.on")
				user3 = io.connect(socketURL, options)
				checkMessages(user3)

				user3.on('connect', function(data) {
					console.log("In user3.on")
					user4 = io.connect(socketURL, options)
					checkMessages(user4)
				
					user4.on('connect', function(data) {
						console.log("In user4.on")
						console.log("Messages: ", messages)
						user2.send(message)
					})	
				})		
			})		

		})
	})

})