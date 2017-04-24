
import React from 'react'
import { render } from 'enzyme'
import { assert } from 'chai'
import { it, describe } from 'mocha'

import Message from '../../client/components/Message'

const should = require('should')
const expect = require('chai').expect
const express = require('express')

const courseController = require('../../server/database/controllers/index').courses
const userController = require('../../server/database/controllers/index').users
const lectureController = require('../../server/database/controllers/index').lectures
const messageController = require('../../server/database/controllers/index').messages
const adminRoleController = require('../../server/database/controllers/index').adminRoles
const feedbackController = require('../../server/database/controllers/index').feedback


// Simulate the servercode in app.js
/**
const server = require('http').createServer(express())
var ioServer = require('socket.io')(server)
server.listen(8000)
const sockets = require('../../server/sockets')
sockets(ioServer)
**/

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

  let testMessageOne = undefined
  let testMessageTwo = undefined
  let testMessageThree = undefined
  let testMessageFour = undefined

  let roomOne = undefined  
  let roomTwo = undefined


  before(function (done) {
    var now = new Date()
    var min = now.getMinutes()

    // Create user 
    function createUsers() {

      function userOne () {
        return new Promise(function (resolve) {
          userController.findOrCreateUser({
            name: "TestUserOne",
            email: 'one@test.com'
          }).spread(function (user, created) {
            testUserOne = user
            resolve()
          })
        })
      }

      function userTwo () {
        return new Promise(function (resolve) {
          userController.findOrCreateUser({
            name: 'TestUserTwo',
            email: 'two@test.com'
          }).spread(function (user, created) {
            testUserTwo = user
            resolve()
          })
        })
      }

      function userThree () {
        return new Promise(function (resolve) {
          userController.findOrCreateUser({
            name: 'TestUserThree',
            email: 'three@test.com'
          }).spread(function (user, created) {
            testUserThree = user
            resolve()
          })
        })
      }
    
      return Promise.all([
        userOne(),
        userTwo(),
        userThree()
      ])
        
    }

    // Create messages
    function createMessages () {

      function messageOne() {
        return new Promise(function (resolve) {
          messageController.createMessage({
            time: now,
            text: "Message 1",
            LectureId: testLectureOne.id
          }).then(function (msg) {
            testMessageOne = msg
            resolve()
          })
        })
      }

      function messageTwo() {
        return new Promise(function (resolve) {
          messageController.createMessage({
            time: now.setMinutes(min - 3),
            text: "Message 2",
            LectureId: testLectureOne.id
          }).then(function (msg) {
            testMessageTwo = msg
            resolve()
          })
        })
      }
      
      function messageThree() {
        return new Promise(function (resolve) {
          messageController.createMessage({
            time: now.setMinutes(min -3),
            text: "Message 3",
            LectureId: testLectureTwo.id
          }).then(function (msg) {
            testMessageThree = msg
            resolve()
          })
        })
      }
      
      function messageFour() {
        return new Promise(function (resolve) {
          messageController.createMessage({
            time: now.setMinutes(min -10),
            text: "Message 4",
            LectureId: testLectureTwo.id
          }).then(function (msg) {
            testMessageFour = msg
            resolve()
          })
        })
      }
      
      return Promise.all([
        messageOne(),
        messageTwo(),
        messageThree(),
        messageFour()
      ])
    }

    // Create feedback
    function createFeedback () {

      function feedbackOne() {
        return new Promise(function (resolve) {
          feedbackController.createFeedback({
            time: now.setMinutes(min - 9),
            value: 1,
            LectureId: testLectureOne.id,
          }).then(function (feedback) {
            resolve()
          })
        })
      }


      function feedbackTwo() {
        return new Promise(function (resolve) {
          feedbackController.createFeedback({
            time: now.setMinutes(min -15),
            value: 1,
            LectureId: testLectureOne.id,
          }).then(function (feedback) {
            resolve()
          })
        })
      }

      function feedbackThree() {
        return new Promise(function (resolve) {
          feedbackController.createFeedback({
            time:now.setMinutes(min - 3),
            value: -1,
            LectureId: testLectureOne.id,
          }).then(function (feedback) {
              resolve()
            })
        })
      }

      function feedbackFour() {
        return new Promise(function (resolve) {
          feedbackController.createFeedback({
            time: now.setMinutes(min -2),
            value: 1,
            LectureId: testLectureTwo.id,
          }).then(function (feedback) {
              resolve()
            })
        })
      }

      function feedbackFive() {
        return new Promise(function (resolve) {
          feedbackController.createFeedback({
            time: now.setMinutes(min -10),
            value: 1,
            LectureId: testLectureTwo.id,
          }).then(function (feedback) {
              resolve()
            })
        })
      }

      function feedbackSix() {
        return new Promise(function (resolve) {
          feedbackController.createFeedback({
            time: now.setMinutes(min - 1),
            value: -1,
            LectureId: testLectureTwo.id,
          }).then(function (feedback) {
              resolve()
            })
        })
      }
      return Promise.all([
        feedbackOne(),
        feedbackTwo(),
        feedbackThree(),
        feedbackFour(),
        feedbackFive(),
        feedbackSix()
      ])
    }

    // Create course and lecture 
    function createCourseAndLecture() {

      function courseAndLectureOne() {
        return new Promise(function (resolve) {
          courseController.findOrCreateCourse({
            name: "Web Development",
            code: "IT2810"
          }).spread(function(courseOne, created){
            testCourseOne = courseOne
            lectureController.createLecture({
              name: "Intro to web development",
              CourseId: courseOne.id
            }).then(function (lecture) {
              testLectureOne = lecture
              roomOne = testCourseOne.code+'-'+ testLectureOne.id
              resolve()
            })
          })
        })
      }

      function courseAndLectureTwo() {
        // Need return to make sure they finish correctly
        return new Promise(function (resolve) {
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
              roomTwo = testCourseTwo.code+'-'+testLectureTwo.id
              resolve()
            })
          })
        })
      }

      // With return, they are finishing in right order, but not calling done
      // If they aren't functions, they aren't called
      return Promise.all([
        courseAndLectureOne(),
        courseAndLectureTwo()
      ])
    }
    

    Promise.all([createCourseAndLecture(), createUsers()])
      .then(function () {
        Promise.all([createMessages(), createFeedback()])
          .then(function () {
            done()
        })   
      }).catch(function(err) {
        })
  })

  describe('should be able to establish connection', function () {
     
    it('establishing connection', function (done) {
      clientOneSocket = io.connect(socketURL, options)
      clientOneSocket.on('connect', function (data) {
       clientOneSocket.connected.should.equal(true)
        done()
      })
    })
  })
  
  describe('Testing join-lecture:', function () {

    beforeEach(function (done) {
      clientOneSocket = io.connect(socketURL, options)
      
      clientOneSocket.on('connect', function (data) {
        clientOneSocket.emit('login')
        clientOneSocket.emit('join-lecture', {
          user: testUserOne,
          code: testCourseOne.course,
          id: testLectureOne.id,
          room: testLectureOne.room
        })
        done()
      })
    })

    /*
    it('Saving correct values in socket', function (done) {
      clientOneSocket.user.should.equal(testUserOne)
      clientOneSocket.userId = testUserOne.id
      clientOneSocket.LectureId.should.equal(testLectureOne.id)
      clientOneSocket.CourseCode.should.equal(testCourseOne.code)
      clientOneSocket.room.should.equal(roomOne)
      done()
    })

  */

    it('Getting last feedback for last interval', function (done) {
      feedbackController.getLastIntervalNeg({id: testLectureOne.id}).then(function (resultNeg) {
        feedbackController.getLastIntervalPos({id: testLectureOne.id}).then(function (resultPos) {
          clientOneSocket.on('update-feedback-interval', function(results) {
            expect(results[0]).to.equal(resultNeg)
            expect(results[1]).to.equal(resultPos)
            done()
          })
        })
      })
    })

    it('Getting all message to lecture', function (done) {
      messageController.getAllToLecture({id: testLectureOne.id}).then(function (result) {
        clientOneSocket.on('all-messages', function (messageList) {

          result = result.reverse()
          for (var i = 0; i < result.length; i++) {
            messageList[i].text.should.eql(result[i].text)
            messageList[i].id.should.eql(result[i].id)
          }

          done()
        })
      })
    })
  })
  
  describe('Testing new-message:', function () {

    beforeEach(function (done) {
      clientOneSocket = io.connect(socketURL, options)
      clientTwoSocket = io.connect(socketURL, options)
      clientThreeSocket = io.connect(socketURL, options)
            
      clientOneSocket.on('connect', function (data) {
        clientOneSocket.emit('login')
        clientOneSocket.emit('join-lecture', {
          user: testUserOne,
          code: testCourseOne.code, 
          id: testLectureOne.id,
          room: roomOne
        })
      })

      clientTwoSocket.on('connect', function (data) {
        clientTwoSocket.emit('login')
        clientTwoSocket.emit('join-lecture', {
          user: testUserOne,
          code: testCourseOne.code, 
          id: testLectureOne.id,
          room: roomOne
        })
      })
      
      clientThreeSocket.on('connect', function (data) {
        clientThreeSocket.emit('login')
        clientThreeSocket.emit('join-lecture', {
          user: testUserThree,
          code: testCourseTwo.code, 
          id: testLectureTwo.id,
          room: roomTwo
        })
      })

      done()
    })

    it('Broadcasting message to all members of that room', function (done) {
      var msg = {
            text: "Hello world",
            lecture: {
              id: testLectureOne.id,
              code: testCourseOne.code,
              room: roomOne,
            }
          }

      clientOneSocket.emit('new-message', msg)
        function recClientOne() {
          return new Promise(function (resolve) {

            clientOneSocket.on('receive-message', function (message, done) {
              message.text.should.eql(msg.text)
              resolve()
            })
          })
        }

        function recClientTwo() {
          return new Promise(function (resolve) {
            clientTwoSocket.on('receive-message', function (message, done) {
              message.text.should.eql(msg.text)
              resolve()
            })
          })
        }

        Promise.all([recClientOne(), recClientTwo()])
          .then(function(){
             done()
          })

      })
  })

  
  describe('Testing new-vote-on-message:', function () {

    beforeEach(function (done) {
      clientOneSocket = io.connect(socketURL, options)
      clientTwoSocket = io.connect(socketURL, options)
      clientThreeSocket = io.connect(socketURL, options)

      clientOneSocket.on('connect', function (data) {
        clientOneSocket.emit('login')
        clientOneSocket.emit('join-lecture', {
          user: testUserOne,
          code: testCourseOne.course,
          id: testLectureOne.id,
          room: testLectureOne.room
        })
      })

      clientTwoSocket.on('connect', function (data) {
        clientTwoSocket.emit('login')
        clientTwoSocket.emit('join-lecture', {
          user: testUserTwo,
          code: testCourseOne.course,
          id: testLectureOne.id,
          room: testLectureOne.room
        })
      })

      clientThreeSocket.on('connect', function (data) {
        clientThreeSocket.emit('login')
        clientThreeSocket.emit('join-lecture', {
          user: testUserThree,
          code: testCourseTwo.course,
          id: testLectureTwo.id,
          room: testLectureTwo.room
        })
      })

      done()
    })

    it('Increase vote-value', function (done) {
      clientOneSocket.emit('new-vote-on-message', testMessageOne.id, 1)

      clientOneSocket.on('update-message-order', function (list) {
        for (var i = 0; i <= list.length; i++) {
          var message = list[i]
          if (message.id == testMessageOne.id) {
            message.votesUp.should.eql(1)
            done() 
          } 
        }
      })
    })

    it('Decrease vote-value', function (done) {
      clientOneSocket.emit('new-vote-on-message', testMessageTwo.id, -1)

      clientOneSocket.on('update-message-order', function (list) {
        for (var i = 0; i <= list.length; i++) {
          var message = list[i]
          if (message.id == testMessageTwo.id) {
            message.votesDown.should.eql(1)
            done() 
          } 
        }
      })
    })


    it('Update message order', function (done) {
      clientOneSocket.emit('new-vote-on-message', testMessageOne.id, 1)

      messageController.getAllToLecture({
        id: testLectureOne.id
      }).then(function (msgList) {
        msgList = msgList.reverse()
        
        function clientOne() {
          return new Promise(function(resolve) {
            clientOneSocket.on('update-message-order', function (list) {
              for (var i = 0; i < list.length; i++) {
                list[i].text.should.eql(msgList[i].text)
                list[i].id.should.eql(msgList[i].id)
              }
              resolve()
            })
          })
        }

        function clientTwo() {
          return new Promise(function (resolve) {
            clientTwoSocket.on('update-message-order', function (list) {
              for (var i = 0; i < list.length; i++) {
                list[i].text.should.eql(msgList[i].text)
                list[i].id.should.eql(msgList[i].id)
              }
              resolve()
            })
          })
        }
        
        Promise.all([clientOne(), clientTwo()])
          .then(function () {
            done()
          })
      })
    })
    
  })

  describe('Testing new-feedback:', function () {

    beforeEach(function (done) {
      clientOneSocket = io.connect(socketURL, options)
      clientTwoSocket = io.connect(socketURL, options)
      clientThreeSocket = io.connect(socketURL, options)

      clientOneSocket.on('connect', function (data) {
        clientOneSocket.emit('login')
        clientOneSocket.emit('join-lecture', {
          user: testUserOne,
          code: testCourseOne.course,
          id: testLectureOne.id,
          room: testLectureOne.room
        })
      })

      clientTwoSocket.on('connect', function (data) {
        clientTwoSocket.emit('login')
        clientTwoSocket.emit('join-lecture', {
          user: testUserTwo,
          code: testCourseOne.course,
          id: testLectureOne.id,
          room: testLectureOne.room
        })
      })

      clientThreeSocket.on('connect', function (data) {
        clientThreeSocket.emit('login')
        clientThreeSocket.emit('join-lecture', {
          user: testUserThree,
          code: testCourseTwo.course,
          id: testLectureTwo.id,
          room: testLectureTwo.room
        })
      })

      done()
    })
    
    it('Sending feedback', function (done) {
      let feedback =  {
        value: -1,
        lecture: {
          id:  testLectureOne.id,
          code: testCourseOne.id,
          room: roomOne,
        }
      }

      clientOneSocket.emit('new-feedback', feedback)

      function clientOne() {
        return new Promise(function(resolve) {
          clientOneSocket.on('receive-feedback', function (value) {
            feedback.value.should.eql(value)
          })
          resolve()
        })
      }

      function clientTwo() {
        return new Promise(function(resolve) {
          clientTwoSocket.on('receive-feedback', function (value) {
            feedback.value.should.eql(value)
          })
          resolve()
        })
      }

      Promise.all([clientOne(), clientTwo()])
        .then(function() {
          done()
        })
    })
    
  })
  
  
  
  describe('Testing update-feedback-interval:', function () {

    beforeEach(function (done) {
      clientOneSocket = io.connect(socketURL, options)
      clientTwoSocket = io.connect(socketURL, options)
      clientThreeSocket = io.connect(socketURL, options)

      clientOneSocket.on('connect', function (data) {
        clientOneSocket.emit('login')
        clientOneSocket.emit('join-lecture', {
          user: testUserOne,
          code: testCourseOne.course,
          id: testLectureOne.id,
          room: testLectureOne.room
        })
      })

      clientTwoSocket.on('connect', function (data) {
        clientTwoSocket.emit('login')
        clientTwoSocket.emit('join-lecture', {
          user: testUserTwo,
          code: testCourseOne.course,
          id: testLectureOne.id,
          room: testLectureOne.room
        })
      })

      clientThreeSocket.on('connect', function (data) {
        clientThreeSocket.emit('login')
        clientThreeSocket.emit('join-lecture', {
          user: testUserThree,
          code: testCourseTwo.course,
          id: testLectureTwo.id,
          room: testLectureTwo.room
        })
      })

      done()
    })
  
    it('Sending new feedbackvalues', function (done) {

      clientOneSocket.emit('update-feedback-interval', testLectureOne)

      feedbackController.getLastIntervalNeg({id: testLectureOne.id}).then(function (resultNeg) {
        feedbackController.getLastIntervalPos({id: testLectureOne.id}).then(function (resultPos) {

          function clientOne() {
            return new Promise(function(resolve) {
              clientOneSocket.on('update-feedback-interval', function(results) {
                expect(results[0]).to.equal(resultNeg)
                expect(results[1]).to.equal(resultPos)
                
                resolve()
              })
            })
          }

          function clientTwo() {
            return new Promise(function(resolve) {
              clientTwoSocket.on('update-feedback-interval', function(results) {
                expect(results[0]).to.equal(resultNeg)
                expect(results[1]).to.equal(resultPos)
                resolve()
              })
            })
          }
  
          Promise.all([clientOne(), clientTwo()])
            .then(function() {
              done()
            })
     
        })
      })
    })
    
  })

})