const usersController = require('./database/controllers/users')
const lecturesController = require('./database/controllers/lectures')
const messagesController = require('./database/controllers/messages')
const feedbacksController = require('./database/controllers/feedback')
const courseController = require('./database/controllers/courses')
const adminRoleController = require('./database/controllers/adminRoles')

// ///////////////////////////////////////////////////
// Setup for SocketIO
// ///////////////////////////////////////////////////

//io server is defined in the Redis/Express section in app.js
module.exports = (io) => {
  console.log("[sockets.js]")
  let initCourse = undefined

  setTimeout(function () {
    lecturesController.getByName("Enkle matriseoperasjoner").then(function (lecture) {
      if (!lecture) {
        initCourse = true
      }
    })
  }, 5000)

// When a new user connects
  io.sockets.on('connection', function (socket) {
    console.log("[sockets.js] user connected")

    /* istanbul ignore next */

    if (initCourse) {

      let testCourse1 = undefined
      let testCourseName1 = "Matematikk 3"
      let testCourseCode1 = "TMA4115"

      let testLecture1 = undefined
      let testLectureName1 = "Enkle matriseoperasjoner"

      courseController.findOrCreateCourse({
        name: testCourseName1,
        code: testCourseCode1
      }).spread(function (course, created) {
        testCourse1 = course
        lecturesController.createLecture({
          name: testLectureName1,
          CourseId: testCourse1.id
        }).then(function (lecture) {
          testLecture1 = lecture
        })
      })

      let testCourse2 = undefined
      let testCourseName2 = "Krets- og digitalteknikk"
      let testCourseCode2 = "TFE4101"

      let testLecture2 = undefined
      let testLectureName2 = "Ohms Lov"

      courseController.findOrCreateCourse({
        name: testCourseName2,
        code: testCourseCode2
      }).spread(function (course, created) {
        testCourse2 = course
        lecturesController.createLecture({
          name: testLectureName2,
          CourseId: testCourse2.id
        }).then(function (lecture) {
          testLecture2 = lecture
        })
      })

      let testCourse3 = undefined
      let testCourseName3 = "Objektorientert programmering"
      let testCourseCode3 = "TDT4100"

      let testLecture3 = undefined
      let testLectureName3 = "Intro til Java"

      courseController.findOrCreateCourse({
        name: testCourseName3,
        code: testCourseCode3
      }).spread(function (course, created) {
        testCourse3 = course
        lecturesController.createLecture({
          name: testLectureName3,
          CourseId: testCourse3.id
        }).then(function (lecture) {
          testLecture3 = lecture
        })
      })

      initCourse = false
    }
    // Reports when it finds a connection
    console.log('[sockets] connection')

    socket.on('login', function (data) {
      console.log('[sockets] login')
    })


    socket.on('create-lecture', function (socketLecture) {
      console.log('[app] create-lecture')
      courseController.getByCode(socketLecture.courseCode).then(function (course) {
        socketLecture.CourseId = course.id
        lecturesController.createLecture(socketLecture).then(function (lecture) {
          io.sockets.emit('new-lecture', lecture.get({plain: true}))
        })
      })
    })

    /**
     * @template socketLecture: {
      id: (int),
      code: (string),
      room: (string),
    }
     */
    socket.on('leave-lecture', function (socketLecture) {
      console.log('[sockets][socket] leave-lecture ' + socketLecture.room)
      socket.user = undefined
      socket.LectureId = undefined
      socket.CourseCode = undefined
      socket.room = undefined
      socket.leave(socketLecture.room)
    })

    /**
     * @template socketLecture: {
      id: (int),
      code: (string),
      room: (string),
    }
     */
    socket.on('join-lecture', function (socketLecture) {
      console.log('[sockets][socket] join-lecture ' + socketLecture.room)
      
      socket.user = socketLecture.user
      usersController.getByEmail(socket.user.email).then(function (user) {
        socket.UserId = user.id
      })
      socket.LectureId = socketLecture.id
      socket.CourseCode = socketLecture.code
      socket.room = socketLecture.room
      socket.join(socketLecture.room)

      console.log('[app][socket] Connected to lecture with ID: ' + socket.LectureId)
      console.log('[app][socket] For course with code: ' + socket.CourseCode)
      console.log('[app][socket] as user with username: ' + socket.user.name)
      console.log('[app][socket] Joined room identifier: ' + socket.room)

      // Get all feedback
      feedbacksController.getAllToLecture({
        id: socket.LectureId
      }).then(function (feedback) {
        socket.emit('all-feedback', feedback)
      })

      // Get all messages
      messagesController.getAllToLecture({
        id: socket.LectureId
      })
        .then(function (messages) {
          if (process.env.NODE_ENV !== 'test') {
            let counter = 0
            messages.map((message) => {
              usersController.getById(message.UserId).then(function (user) {
                message.userName = user.name
                counter++
                if (counter === messages.length) {
                  console.log('[app][socket] Sent all messages')
                  socket.emit('all-messages', messages.reverse())
                }
              })
            })
          } else {
              socket.emit('all-messages', messages.reverse())
          }
        })
    })


    /** TODO: lecture can be removed, because of the new socket variables
     * @deprecated
     * @template msg: {
      text: (string),
      lecture: {
        id: (int),
        code: (string),
        room: (string),
      }
    }
     */
    socket.on('new-message', function (msg) {
      console.log('[sockets] new-message: ' + msg.text)
      console.log('[sockets][socket] Message destined for Room: ' + socket.room)

      var timeNow = new Date()
      timeNow.setHours(timeNow.getHours() + 2)
      let databaseMsg = {
        time: timeNow,
        text: msg.text,
        LectureId: socket.LectureId,
        UserId: socket.UserId
      }

      if(process.env.NODE_ENV !== 'test') {
        usersController.getById(socket.UserId).then(function (user) {
          let userName = user.name

          messagesController.createMessage(databaseMsg).then(function (result) {
            io.sockets.in(socket.room).emit('receive-message', {
              id: result.id,
              text: result.text,
              time: result.time,
              votesUp: result.votesUp,
              votesDown: result.votesDown,
              userName: userName,
              UserId: result.UserId,
              LectureId: result.LectureId
            })
          })

        }).catch(function (error) {
          console.log("Error: ", error)
        })
      }
    })

    // When somebody votes on a message
    socket.on('new-vote-on-message', function (msgId, value) {
      console.log('[sockets] new-voting-message: ' + msgId + " with " + value)
      
      messagesController.vote({
        id: msgId,
        value: value
      }, function () {
        messagesController.getAllToLecture({
          id: socket.LectureId
        }).then(function (msgList) {
          io.sockets.in(socket.room).emit('update-message-order', msgList.reverse())
        })
      })
    })

    // When somebody gives feedback

    /** TODO: Remove lecture, it's defined in the socket itself now
     * @deprecated
     * @template feedback: {
      value: (int),
      lecture: {
        id: (int),
        code: (string),
        room: (string),
      }
    }
     */
    socket.on('new-feedback', function (feedback) {
      console.log('[sockets] new-feedback: ' + feedback.value + ' to room: ' + socket.room)
      feedbacksController.createFeedback({
        value: feedback.value,
        LectureId: socket.LectureId,
        UserId: socket.UserId
      }).then(function (result) {
        io.sockets.in(socket.room).emit('receive-feedback', {
          value: result.value,
          createdAt: result.createdAt
        })
      })
    })

    // Called every x minuts
    socket.on('update-feedback-interval', function (lecture) {
      // Get feedback from database for past x minuts

      feedbacksController.getLastIntervalNeg(lecture).then(function (resultNeg) {
        feedbacksController.getLastIntervalPos(lecture).then(function (resultPos) {
          io.sockets.in(socket.room).emit('update-feedback-interval', [resultNeg, resultPos])
        })
      })
    })

    socket.on('disconnect', function () {
      //TODO: Do something on disconnect?
    })
  })
}