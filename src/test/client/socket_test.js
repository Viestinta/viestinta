
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

      // Done is not called       
      return Promise.all([userOne(), userTwo(), userThree()])
        .then(function () {
          /*
          console.log("Done with making users")
          console.log(typeof testUserOne != undefined)
          console.log(typeof testUserTwo != undefined)
          console.log(typeof testUserThree != undefined)
          */
        }).catch(function(err) {
          console.log("Failed:", err);
        })
        
    }

    // Create messages
    function createMessages () {
      console.log("In createMessages()")

      function messageOne() {
        return new Promise(function (resolve) {
          console.log("Message one")
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
      
      console.log("Before returning Promise.all in createMessages()")
      console.log(messageOne())
      return Promise.all([messageOne(), messageTwo(), messageThree(), messageFour()])
       .then(function() {
        /*
          console.log("Done with making messages")
          console.log(typeof messageOne !== undefined)
          console.log(typeof messageTwo !== undefined)
          console.log(typeof messageThree !== undefined)
          console.log(typeof messageFour !== undefined)
          */
        }).catch( function(error){
          console.log(error)
        })
      
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

      return Promise.all([feedbackOne(), feedbackTwo(), feedbackThree(), feedbackFour(), feedbackFive(), feedbackSix()])
        .then( function () {
          console.log("Done with creating feedback")
        
        })
    }


    // Create course and lecture 
    function createCourseAndLecture() {
      console.log("In createCourseAndLecture")

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
        }).then(function () {
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
      return Promise.all([courseAndLectureOne(), courseAndLectureTwo()])
        .then(function() {
          /*
          console.log("Done with making courses")
          console.log(typeof testCourseOne !== undefined)
          console.log(typeof testCourseTwo !== undefined)    
          */

        }).catch( function(error){
          console.log(error)
        })

    }
    

    Promise.all([createCourseAndLecture(), createUsers()])
      .then(function () {
        console.log("Calling EARLY done in promise.all")
      
        Promise.all([createMessages()])
          .then(function () {
            console.log("Calling done in promise.all")
            done()
        })   
      }).catch(function(err) {
          console.log("Failed:", err);
        })
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
    beforeEach(function (done) {
      clientOneSocket = io.connect(socketURL, options)
      
      clientOneSocket.on('connect', function (data) {
        clientOneSocket.emit('login')
        //onsole.log("testLectureOne is not undefined: ", typeof testLectureOne != undefined, " - ", testLectureOne)
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
      //console.log("testLectureOne: ", testLectureOne)
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
          room: testLectureOne.room
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
              // TODO
              room: roomOne,
            }
          }

      clientOneSocket.emit('new-message', msg)

      clientOneSocket.on('new-message', function (message) {
        message.should.eql(msg)
      })

      clientTwoSocket.on('new-message', function (message) {
        message.should.eql(msg)
      })

      // TODO: more correct - should not be called
      clientThreeSocket.on('new-message', function (message) {
        message.should.not.eql(msg)
      })

      done()
    })

  })
  
  /*
  describe('Testing leave-lecture:', function () {
    it('Setting values to undefined', function (done) {
      
    })
  })
  */

  describe('Testing new-vote-on-message:', function () {

    // Must test with receivein update-message-order since the database otherwise isn't updated yet
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
      clientOneSocket.emit('new-vote-on-message', testMessageOne.id, -1)

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

    it('Update message order', function (done) {
      clientOneSocket.emit('new-vote-on-message', testMessageOne.id, 1)

      messageController.getAllToLecture({
        id: testLectureOne.id
      }).then(function (msgList) {
        
        clientOneSocket.on('update-message-order', function (list) {
          list.should.eql(msgList.reverse())
        })

        clientTwoSocket.on('update-message-order', function (list) {
          list.should.eql(msgList.reverse())
        })

        clientThreeSocket.on('update-message-order', function (list) {
          list.should.not.eql(msgList.reverse())
        })

        done()
      })
    })
  })

  describe('Testing new-feedback:', function () {

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

      clientOneSocket.on('receive-feedback', function (value) {
          feedback.value.should.eql(value)
        })

        clientTwoSocket.on('receive-feedback', function (value) {
          feedback.value.should.eql(value)
        })

        clientThreeSocket.on('receive-feedback', function (value) {
          feedback.value.should.not.eql(value)
        })

        done()
    })
  })
  
  
  describe('Testing update-feedback-interval:', function () {

    it('Sending new feedbackvalues', function (done) {
      clientOneSocket.emit('update-feedback-interval')

      feedbackController.getLastIntervalNeg({id: testLectureOne.id}).then(function (resultNeg) {
        feedbackController.getLastIntervalPos({id: testLectureOne.id}).then(function (resultPos) {
          clientOneSocket.on('update-feedback-interval', function(results) {
            expect(results[0]).to.equal(resultNeg)
            expect(results[1]).to.equal(resultPos)
            
          })

          clientTwoSocket.on('update-feedback-interval', function(results) {
            expect(results[0]).to.equal(resultNeg)
            expect(results[1]).to.equal(resultPos)

          })
        })
      })
    
      feedbackController.getLastIntervalNeg({id: testLectureTwo.id}).then(function (resultNeg) {
          feedbackController.getLastIntervalPos({id: testLectureTwo.id}).then(function (resultPos) {
            clientThreeSocket.on('update-feedback-interval', function(results) {
              console.log("Feedback results: ", results)
              expect(results[0]).to.equal(resultNeg)
              expect(results[1]).to.equal(resultPos)
            })
          })
        })
      done()
    })
  })

})