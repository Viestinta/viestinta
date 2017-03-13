import io from 'socket.io-client'
import React from 'react'
import { render } from 'enzyme'
import { assert } from 'chai'
import { it, describe } from 'mocha'

import Message from '../../client/components/Message'

import ChatBox from '../../client/components/ChatBox'

const should = require('should')


// Create Message component
describe('MessageComponent', function () {
  // Create a message object
  it('Should be able to create message component', function () {
    const message = render(<Message text='Hello world' />)

    assert.equal(message.text(), 'Hello world')
  })
})

// Send message
describe('SendMessage', function () {

  // Create a message instance
  const chatBox = render(<ChatBox text='Hello world' />)

  // Send to app.js trought 
  chatBox.sendMessage()

  // Receive message in app.js

  //
  
})

// Receive message

