import io from 'socket.io-client'
import React from 'react'
import { render } from 'enzyme'
import { assert } from 'chai'
import { it, describe } from 'mocha'

import Message from '../components/Message'

// If removed, the test won't work
import server from '../../server/app'
import should from 'should'

describe('MessageComponent', function () {
  // Create a message object
  it('Should be able to create message component', function () {
    const message = render(<Message text='Hello world' />)

    assert.equal(message.text(), 'Hello world')
  })
})

// Testing socket.io
describe('Socket.io', function () {
  var socketURL = 'http://127.0.0.1:8000'

  var options = {
    transports: ['websocket'],
    'force new connection': true
  }

  it('Should be able to broadcast messages', function (done) {
    var user1, user2, user3, user4
    // const message = render(<Message text='Hello world' />)
    var message = 'Hello world'
    var messages = 0

    var checkMessages = function (client) {
      console.log('In checkMessages')
			// Working with message and not new-message since message emit back to message
      // Send new message
      client.emit('new-message', message)
      console.log('Emit message')

      client.on('receive-message', function (msg) {
        console.log('Msg in client.on receive-message')
        // assert.equal(msg.text(), 'Hello world')
        message.should.equal(msg)
        messages++
				// Received 1 time + 2 + 3 + 4 = 10
        if (messages === 10) {
          console.log('Done')
          done()
        }
      })
    }

    user1 = io.connect(socketURL, options)
    checkMessages(user1)

    user1.on('connect', function (data) {
      user2 = io.connect(socketURL, options)
      checkMessages(user2)

      user2.on('connect', function (data) {
        user3 = io.connect(socketURL, options)
        checkMessages(user3)

        user3.on('connect', function (data) {
          user4 = io.connect(socketURL, options)
          checkMessages(user4)

          user4.on('connect', function (data) {
            user2.send(message)
          })
        })
      })
    })
  })
})
