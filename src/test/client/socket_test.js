
import React from 'react'
import { render } from 'enzyme'
import { assert } from 'chai'
import { it, describe } from 'mocha'

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

// Client connection
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
  let testUserThree = undefined

  let clientOneSocket = undefined
  let clientTwoSocket = undefined
  let clientThreeSocket = undefined

  before(function (done) {
    var now = new Date()
    var min = now.getMinutes()


  

    // Create user 
    function createUsers() {
      new Promise(function () {
        userController.findOrCreateUser({
          name: "TestUserOne",
          email: 'one@test.com'
        }).spread(function (user, created) {
          testUserOne = user
        }).then(function () {
          userController.findOrCreateUser({
            name: 'TestUserTwo',
            email: 'two@test.com'
          }).spread(function (user, created) {
            testUserTwo = user
          }).then(function () {
            userController.findOrCreateUser({
              name: 'TestUserThree',
              email: 'three@test.com'
            }).spread(function (user, created) {
              testUserThree = user
              console.log("After created testUserThree")
            })
          })
        })
      }).then(function () {
          createFeedback()
      })
      console.log("At end of createUser")
      
    }

    // Create messages
    function createMessages () {
      new Promise(function () {
        messageController.createMessage({
          time: now,
          text: "Message 1",
          LectureId: testLectureOne.id
        }).then(function () {
          messageController.createMessage({
            time: now.setMinutes(min - 3),
            text: "Message 2",
            LectureId: testLectureOne.id
          }).then(function () {
            messageController.createMessage({
              time: now.setMinutes(min -3),
              text: "Message 3",
              LectureId: testLectureTwo.id
            }).then(function () {
              messageController.createMessage({
                time: now.setMinutes(min -10),
                text: "Message 4",
                LectureId: testLectureTwo.id
              })
              console.log("After created message 4")
            })
          })
        })
      })
      console.log("At end of createMessage")
    }

    // Create feedback
    function createFeedback () {
      new Promise(function () {
        feedbackController.createFeedback({
          time: now.setMinutes(min - 9),
          value: 1,
          LectureId: testLectureOne.id,
        }).then( function () {
          feedbackController.createFeedback({
            time: now.setMinutes(min -15),
            value: 1,
            LectureId: testLectureOne.id,
          }).then(function () {
            feedbackController.createFeedback({
              time:now.setMinutes(min - 3),
              value: -1,
              LectureId: testLectureOne.id,
            }).then(function () {
              feedbackController.createFeedback({
                time: now.setMinutes(min -2),
                value: 1,
                LectureId: testLectureTwo.id,
              }).then(function () {
                feedbackController.createFeedback({
                  time: now.setMinutes(min -10),
                  value: 1,
                  LectureId: testLectureTwo.id,
                })
              }).then(function () {
                feedbackController.createFeedback({
                  time: now.setMinutes(min - 1),
                  value: -1,
                  LectureId: testLectureTwo.id,
                })
                console.log("After creating feedbacks")
              })
            })
          })
        }).then(function () {
          createMessages()
        })
      })
    }


    // Create course and lecture 
    function createCourseAndLecture (done) {
      new Promise(function () {
        console.log("In createCourseAndLecture")
        courseController.findOrCreateCourse({
          name: "Web Development",
          code: "IT2810"
        }).spread(function(courseOne, created){
          console.log("First spread")
          testCourseOne = courseOne
          lectureController.createLecture({
            name: "Intro to web development",
            CourseId: courseOne.id
          }).then(function (lecture) {
            console.log("first then")
            testLectureOne = lecture
          }).then(function () {
            courseController.findOrCreateCourse({
              name: "Operating Systems",
              code: "TDT4186"
            }).spread(function (courseTwo, created) {
              testCourseTwo = courseTwo
              lectureController.createLecture({
                name: "Operating systems",
                CourseId: courseTwo.id
              }).then(function (lecture) {
                testLectureTwo = lecture
              })
            })
          })
        }).then(function () {
          createUsers()
        }).then(function () {
          
          console.log(typeof testCourseOne != undefined)
          console.log(typeof testLectureOne != undefined)
          console.log(typeof testUserOne != undefined)
          console.log(typeof testCourseTwo != undefined)
          console.log(typeof testLectureTwo != undefined)
          console.log(typeof testUserTwo != undefined)
          console.log(typeof testUserThree != undefined)
          
          console.log("Calling done")
          return done()
        })
      })
    }

    createCourseAndLecture(done)
    
  })

  describe('should be able to establish connection', function () {
     
    it('establishing connection', function (done) {
      clientOneSocket = io.connect(socketURL, options)
      // console.log("Clientsocket id: ", clientOneSocket.id)
      clientOneSocket.on('connect', function (data) {
       clientOneSocket.connected.should.equal(true)
        done()
      })
    })
  })
  
  describe('Testing join-lecture:', function () {
    before(function (done) {
      clientOneSocket = io.connect(socketURL, options)
      
      clientOneSocket.on('connect', function (data) {
        clientOneSocket.emit('login')
       // console.log("testCourseOne is not undefined: ", typeof testCourseOne != undefined, " - ", testCourseOne)
        clientOneSocket.emit('join-lecture', {
          user: testUserOne,
          code: testCourseOne.course,
          id: testLectureOne.id,
          room: testLectureOne.room
        })
        //console.log("testCourseOne is not undefined: ", typeof testCourseOne != undefined, " - ", testCourseOne)
        
        done()
      })
    })

    /*
    it('Saving correct values in socket', function (done) {
      //console.log("clientOneSocketId: ", clientOneSocket)

      //console.log("serverSocket: ", ioServer)
      clientOneSocket.user.should.equal(testUserOne)
      clientOneSocket.userId = testUserOne.id
      clientOneSocket.LectureId.should.equal(testLectureOne.id)
      clientOneSocket.CourseCode.should.equal(testCourseOne.code)
      //clientOneSocket.room.should.equal(testLectureOne.room)
      done()
    })
   */
   
    it('Getting last feedback for last interval', function (done) {
      feedbackController.getLastIntervalNeg({id: testLectureOne.id}).then(function (resultNeg) {
        feedbackController.getLastIntervalPos({id: testLectureOne.id}).then(function (resultPos) {
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
    /*
    it('Getting all message to lecture', function (done) {
      messageController.getAllToLecture({id: testLectureOne.id}).then(function (result) {
        clientOneSocket.on('all-messages', function (messageList) {

          // PROBLEM: in messageList the dates are string, in result they are dates
          console.log("messageList: ", messageList)
          console.log("result.reverse(): ", result)
          expect(messageList).to.eql(result.reverse())
          done()
        })
      })
      
    })
    */    
  })
  
  /*
  describe('Testing new-message:', function () {

    before(function (done) {
      clientOneSocket = io.connect(socketURL, options)
      clientTwoSocket = io.connect(socketURL, options)
      clientThreeSocket = io.connect(socketURL, options)
            
      clientOneSocket.on('connect', function (data) {
        clientOneSocket.emit('login')
        clientOneSocket.emit('join-lecture', {
          user: testUserOne,
          code: testCourseOne.code, 
          id: testLectureOne.id,
          room: testLectureOne.room
        })
      })

      console.log("After clientOneSocket")
      clientTwoSocket.on('connect', function (data) {
        clientTwoSocket.emit('login')
        clientTwoSocket.emit('join-lecture', {
          user: testUserOne,
          code: testCourseOne.code, 
          id: testLectureOne.id,
          room: testLectureOne.room
        })
      })
      
      console.log("After clientTwoSocket")
      clientThreeSocket.on('connect', function (data) {
        clientThreeSocket.emit('login')
        clientThreeSocket.emit('join-lecture', {
          user: testUserThree,
          code: testCourseTwo.code, 
          id: testLectureTwo.id,
          room: testLectureTwo.room
        })
      })

      console.log("After clientThreeSocket")
      done()
    })

    it('Broadcasting message to all members of that room', function (done) {
      var msg = {
            text: "Hello world",
            lecture: {
              id: testLectureOne.id,
              code: testCourseOne.code,
              // TODO
              // room: this.props.lecture.room,
            }
          }

      clientOneSocket.emit('new-message', msg)

      clientOneSocket.on('new-message', function (message) {
        message.should.eql(msg)
      })

      clientTwoSocket.on('new-message', function (message) {
        message.should.eql(msg)
      })

      clientThreeSocket.on('new-message', function (message) {
        message.should.not.eql(msg)
      })
    })

  })
  */
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