import React from 'react'
import { expect, assert } from 'chai'
import { sinon, spy } from 'sinon'
import { should } from 'should'
import { mount, render, shallow } from 'enzyme'
import { WebSocket, Server, SocketIO } from 'mock-socket'
import io from 'socket.io-client'

require('babel-core/register')()
/**
  Creating global variables
  so that they don't have to be importet in every file
**/

global.React = React
global.expect = expect
global.assert = assert
global.sinon = sinon
global.should = should
global.spy = spy

global.mount = mount
global.render = render
global.shallow = shallow

global.WebSocket = WebSocket
global.Server = Server
global.SocketIO = SocketIO

global.io = io('http://127.0.0.1::8080')

// Fail tests on any warning
// console.error = message => {
//   throw new Error(message);
// };

