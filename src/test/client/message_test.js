import io from 'socket.io-client'
import React from 'react'
import { render } from 'enzyme'
import { assert } from 'chai'
import { it, describe } from 'mocha'

import Message from '../../client/components/Message'

const should = require('should')

describe('MessageComponent', function () {
  // Create a message object
  it('Should be able to create message component', function () {
    const message = render(<Message text='Hello world' />)

    assert.equal(message.text(), 'Hello world')
  })
})

// Message is saved with correct text, user and lecture
describe('CreateMessageInstance', function () {
  // Create a message instance
  it('Should be able to create a message instance', function () {
    const message = render(<Message text='Hello world' />)

    assert.equal(message.text(), 'Hello world')
  })
})

