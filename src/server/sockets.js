const usersController = require('./database/controllers/users')
const lecturesController = require('./database/controllers/lectures')
const messagesController = require('./database/controllers/messages')
const feedbacksController = require('./database/controllers/feedback')
const courseController = require('./database/controllers/courses')

// Custom logger
const winston = require('winston')
winston.level = process.env.LOG_LEVEL

// ///////////////////////////////////////////////////
// Setup for SocketIO
// ///////////////////////////////////////////////////

// io server is defined in the Redis/Express section in app.js
module.exports = (io) => {
  winston.info('[sockets]')
  let initCourse // eslint-disable-line

  // When a new user connects
  io.sockets.on('connection', function (socket) {
    // Reports when it finds a connection
    winston.info('[sockets] Connection established')

    socket.on('login', function (data) {
      winston.info('[sockets][login]')
    })

    /**
     * @template socketLecture: {
      courseCode: (string),
      name: (string),
      startDate: (string),
      endDate: (string),
    }
     */
    socket.on('create-lecture', function (socketLecture) {
      courseController.getByCode(socketLecture.courseCode).then(function (course) {
        socketLecture.CourseId = course.id
        lecturesController.createLecture(socketLecture).then(function (lecture) {
          io.sockets.emit('new-lecture', lecture.get({plain: true}))
          winston.info('[sockets][create-lecture] Created lecture: ' + socketLecture.courseCode)
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
      socket.user = undefined
      socket.LectureId = undefined
      socket.CourseCode = undefined
      socket.room = undefined
      socket.leave(socketLecture.room)
      winston.info('[sockets][leave-lecture] Left room identifier:' + socketLecture.room)
    })

    /**
     * @template socketLecture: {
      id: (int),
      code: (string),
      room: (string),
    }
     */
    socket.on('join-lecture', function (socketLecture) {
      socket.user = socketLecture.user
      usersController.getByEmail(socket.user.email).then(function (user) {
        socket.UserId = user.id
      })
      socket.LectureId = socketLecture.id
      socket.CourseCode = socketLecture.code
      socket.room = socketLecture.room
      socket.join(socketLecture.room)

      winston.info('[sockets][join-lecture] Connected to lecture with ID: ' + socket.LectureId)
      winston.info('[sockets][join-lecture] For course with code: ' + socket.CourseCode)
      winston.info('[sockets][join-lecture] as user with username: ' + socket.user.name)
      winston.info('[sockets][join-lecture] Joined room identifier: ' + socket.room)

      // Get all feedback to lecture
      feedbacksController.getAllToLecture({
        id: socket.LectureId
      }).then(function (feedback) {
        socket.emit('all-feedback', feedback)
      })

      // Get all messages to lecture
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
                  socket.emit('all-messages', messages.reverse())
                }
              })
            })
          } else {
            socket.emit('all-messages', messages.reverse())
          }
        })
    })

    /**
     * @deprecated
     * @template msg: {
      text: (string),
    }
     **/
    socket.on('new-message', function (msg) {
      winston.info('[sockets][new-message] Message text: ' + msg.text)
      winston.info('[sockets][new-message] Message sent to: ' + socket.room)

      var timeNow = new Date()
      timeNow.setHours(timeNow.getHours() + 2)
      let databaseMsg = {
        time: timeNow,
        text: msg.text,
        LectureId: socket.LectureId,
        UserId: socket.UserId
      }

      let userId = socket.UserId
      if (process.env.NODE_ENV === 'test') {
        userId = socket.user.id
      }
      usersController.getById(userId).then(function (user) {
        let userName = user.name
        winston.info('[sockets][new-message] Message by user: ' + userName)

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
        console.error('[sockets][new-message] Error: ', error)
      })
    })

    // When someone votes on a message
    socket.on('new-vote-on-message', function (msgId, value) {
      winston.info('[sockets][new-vote-on-message] Vote value: ' + value + ', on messageID ' + msgId)

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

    /**
     * @template feedback: {
      value: (int),
    }
     */
    // When someone gives feedback
    socket.on('new-feedback', function (feedback) {
      winston.info('[sockets][new-feedback] Feedback value: ' + feedback.value + ', to room: ' + socket.room)
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

    /** @deprecated **/
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
      winston.info('[sockets][disconnect]')
    })
  })
}
