import should from 'should'
import io from 'socket.io-client'
import React from 'react'
import { render, shallow } from 'enzyme'
import { assert, expect } from 'chai'

import server from '../../server/app'

import Message from '../components/Message'


describe('MessageComponent', function() {
	// Create a message object
	it('Should be able to create message component', function()  {

		const message = render(<Message text='Hello world'/>)

		assert.equal(message.text(), 'Hello world')

	})
})

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

	it('Should be able to broadcast messages', function(done) {
		var user1, user2, user3, user4
		var message = render(<Message text='Hello world'/>)
		var message = 'Hello world'
		var messages = 0

		var checkMessages = function (client) {
			console.log("In checkMessages\n")
			// Working with message and not new-message since message emit back to message
	
			// Send new message
			client.emit('new-message', message)

			client.on('receive-message', function(msg) {
	
				message.should.equal(msg)
				messages++
				console.log("Received message")
				console.log(messages)
				// Received 1 time + 2 + 3 + 4 = 10
				if (messages === 10) {
					done()
				}
				
			})

		}

		user1 = io.connect(socketURL, options)
		checkMessages(user1)

		user1.on('connect', function(data) {
			user2 = io.connect(socketURL, options)
			checkMessages(user2)

			user2.on('connect', function(data) {
				user3 = io.connect(socketURL, options)
				checkMessages(user3)

				user3.on('connect', function(data) {
					user4 = io.connect(socketURL, options)
					checkMessages(user4)
				
					user4.on('connect', function(data) {
						user2.send(message)
					})	
				})		
			})		

		})
	})

})