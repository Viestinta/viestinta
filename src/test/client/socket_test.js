
import React from 'react'
import { render } from 'enzyme'
import { assert } from 'chai'
import { it, describe } from 'mocha'

//import socket from '../../client/socket'
//import clientOneSocket from '../../client/socket'


import Message from '../../client/components/Message'
const should = require('should')
const express = require('express')


const db = require('../../server/database/models/index')
const courseController = require('../../server/database/controllers/index').courses
const userController = require('../../server/database/controllers/index').users
const lectureController = require('../../server/database/controllers/index').lectures
const messageController = require('../../server/database/controllers/index').messages
const adminRoleController = require('../../server/database/controllers/index').adminRoles
const feedbackController = require('../../server/database/controllers/index').feedback


// Simulate the servercode in app.js
const server = require('http').createServer(express())
var ioServer = require('socket.io')(server)
server.listen(8000)
const sockets = require('../../server/sockets')
sockets(ioServer)


//var io = require('socket.io-client')(server)
//server.listen(8000)

var io = require('socket.io-client')



// Testing socket.io
describe('Testing socket.io:', function () {

  var socketURL = 'http://127.0.0.1:8000'

  var options = {
    transports: ['websocket'],
    'force new connection': true
  }

  let testCourseOne = undefined
  let testLectureOne = undefined
  let testUserOne = undefined
  let testCourseTwo = undefined
  let testLectureTwo = undefined
  let testUserTwo = undefined

  before(function (done) {
    var now = new Date()

    courseController.findOrCreateCourse({
      name: "Web Development",
      code: "TDT404"
    }).spread(function(course, created){
      testCourseOne = course
      lectureController.createLecture({
        name: "Intro to JS programming",
        CourseId: course.id
      }).then(function (lecture) {
        testLectureOne = lecture
        userController.findOrCreateUser({
          name: "TestUserForWebDevelopment"
        }).spread(function (user, created) {
          testUserOne = user
          messageController.createMessage({
            time: new Date(),
            text: "Message 1",
            LectureId: testLectureOne.id
          })
          messageController.createMessage({
            time: new Date(now.getMinutes()-3),
            text: "Message 2",
            LectureId: testLectureOne.id
          })
          feedbackController.createFeedback({
            time: new Date(now.getMinutes() -12),
            value: 1,
            LectureId: testLectureOne.id,
          })
          feedbackController.createFeedback({
            time: new Date(now.getMinutes() -2),
            value: 1,
            LectureId: testLectureOne.id,
          })
          feedbackController.createFeedback({
            time: new Date(now.getMinutes() -14),
            value: -1,
            LectureId: testLectureOne.id,
          })
        }).then(function (result) {
          console.log("Done with first")
          done()
        }).catch(function (err) {
          console.error(err)
        })
      })
    })
    
    /*
    function second(function (done) {
      courseController.findOrCreateCourse({
        name: "Operating Systems",
        code: "TDT4186"
      }).spread(function(course, created){
        testCourseTwo = course
        lectureController.createLecture({
          name: "Operating systems",
          CourseId: course.id
        }).then(function (lecture) {
          testLectureTwo = lecture
          userController.findOrCreateUser({
            name: "TestUserForOperatingSystems"
          }).spread(function (user, created) {
            testUserTwo = user
            messageController.createMessage({
              time: new Date(now.getMinutes() -3),
              text: "Message 3",
              LectureId: testLectureTwo.id
            })
            messageController.createMessage({
              time: new Date(now.getMinutes() -10),
              text: "Message 4",
              LectureId: testLectureTwo.id
            })
            feedbackController.createFeedback({
              time: new Date(now.getMinutes() -2),
              value: 1,
              LectureId: testLectureTwo.id,
            })
            feedbackController.createFeedback({
              time: new Date(now.getMinutes() -10),
              value: 1,
              LectureId: testLectureTwo.id,
            })
            feedbackController.createFeedback({
              time: new Date(),
              value: -1,
              LectureId: testLectureTwo.id,
            })
            console.log("Before is running")
          }).catch(function (err) {
           console.error(err)
         })
        })
      })
      console.log("Done with second")
      done()
    })
    */
  })

  describe('should be able to establish connection', function () {
     
    it('establishing connection', function (done) {

      //var clientOneSocket = socket.connect(socketURL, options)
      //const clientOneSocket = require('../../client/socket')
      var clientOneSocket = io.connect(socketURL, options)
      console.log("Is clientOnSocket connected: ", clientOneSocket.connected)

      clientOneSocket.on('connect', function (data) {
        console.log("trying to login")
        console.log(clientOneSocket.connected)
        clientOneSocket.connected.should.equal(true)
        done()
      })
    })

  })
  /*
  describe('Testing join-lecture:', function () {
    var clientOneSocket = socket
    console.log(clientOneSocket.connected)
    beforeEach(function (done) {
      console.log("trying to connect")
      clientOneSocket.on('connect', function (data) {
        console.log("trying to login")
        console.log(clientOneSocket.connected)
        clientOnesocket.emit('login')
        console.log("trying to join lecture")
        clientOneSocket.emit('join-lecture', {
          user: testUserOne,
          code: testCourseOne.code, 
          id: testLectureOne.id,
          room: testLectureOne.room
        })
        done()
      })
    })
    
    it('Saving correct values in socket', function (done) {
      clientOneSocket.user.should.equal(testUserOne)
      clientOneSocket.LectureId.should.equal(testLectureOne.id)
      clientOneSocket.CourseCode.should.equal(testCourseOne.code)
      clientOneSocket.room.should.equal(testLectureOne.room)
      done()
    })
    
    it('Getting last feedback for last interval', function (done) {
      feedbackController.getLastIntervalNeg({id: clientOneSocket.LectureId}).then(function (resultNeg) {
        feedbackController.getLastIntervalPos({id: clientOneSocket.LectureId}).then(function (resultPos) {
          console.log("Waiting for clientOneSocket.on")
          clientOneSocket.on('update-feedback-interval', function(results) {
            console.log("Feedback results: ", results)
            expect(results[0]).to.equal(resultNeg)
            expect(results[1]).to.equal(resultPos)
            done()
          })
        })
      })
    })
    it('Getting all message to lecture', function (done) {
      messageController.getAllToLecture({id: clientOneSocket.LectureId}).then(function (result) {
        clientOneSocket.on('all-messages', function (messageList) {
          expect(messageList).to.equal(result)
          done()
        })
      })
      
    })
  })
  
  describe('Testing new-message:', function () {
    it('Creating messageObject', function (done) {
      console.log("testCourseOne", typeof testCourseOne != undefined)
      console.log("testLectureOne", typeof testLectureOne != undefined)
      console.log("testUserOne", typeof testUserOne != undefined)
      console.log("testCourseTwo", typeof testCourseTwo != undefined)
      console.log("testLectureTwo", typeof testLectureTwo != undefined)
      console.log("testUserTwo", typeof testUserTwo != undefined)
    })
    it('Broadcasting message to all members of that room', function (done) {
    })
  })
  /*
  describe('Testing leave-lecture:', function () {
    it('Setting values to undefined', function (done) {
      
    })
  })
  describe('Testing new-vote-on-message:', function () {
    it('Increase vote-value', function (done) {
      
    })
    it('Decrease vote-value', function (done) {
      
    })
    it('Update message order', function (done) {
      
    })
  })
  describe('Testing new-feedback:', function () {
    it('Creating feedbackObject', function (done) {
      
    })
    it('Sending feedback', function (done) {
      
    })
  })
  describe('Testing update-feedback-interval:', function () {
    it('Being called every x min', function (done) {
      
    })
    it('Sending new feedbackvalues', function (done) {
      
    })
  })
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
  
  it('Messages sent in a lecture should be shown only in that lecture', function (done) {
    
  })
  it('Messages sent in a lecture should be shown only in that lecture', function (done) {
    
  })
  it('Messages sent in a lecture should be shown only in that lecture', function (done) {
    
  })
  */
})