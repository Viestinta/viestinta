
// Import controllers for putting into database
const courseController = require('./database/controllers/courses')
const userController = require('./database/controllers/users')
const adminRoleController = require('./database/controllers/adminRoles')

// import IME data
let imeDataArray = require('./ime-database.json')
// imeData = imeData.filter((data) => data.course.educationalRole)

// reduce the array to something a little smaller to that it can be debugged
// imeDataArray = [imeDataArray[0], imeDataArray[1], imeDataArray[2]]
// console.log(JSON.stringify(imeDataArray))

let number = 0
let imeLength = imeDataArray.length

console.log('[init] Data length: ' + imeLength)

imeDataArray

    // Filter the database to courses which include a lecturer
    .filter((imeData) => imeData.course.educationalRole)

    // Run trough every course in the IME Database
    .forEach((imeData, index) => {
      number++
      console.log('[init] Running number ' + number + ' of ' + imeLength)
        // Find user/lecturer data in database and filter based on if the user is HeadLecturer
      let userDataArray = imeData.course.educationalRole.filter((userData) => userData.code === 'HeadLecturer')

        // Fix array structure and run trough for every HeadLecturer (as there can be more than one)
        // userDataArray.map((userData) => userData = userData.person)
      console.log('[init] Filtered user dataArray length: ' + userDataArray.length)
      userDataArray.forEach((userData) => {
        if (userData.person) {
                // Find user corresponding to IME info of exists, create if not
          userController.findOrCreateUser({
            name: userData.person.displayName,
            email: userData.person.email
          })
                .spread(function (user, created) {
                  if (user) {
                    console.log('[init] Created user: ' + user.name)

                        // Use course data from IME and find corresponding course if exists or create if not
                    let courseData = imeData.course
                    courseController.findOrCreateCourse({
                      name: courseData.name,
                      code: courseData.code
                    })
                        .spread(function (course, created) {
                          if (course) {
                            console.log('[init] Created course: ', course.name)

                                // With IDs from created user and course, create adminRole with relations to user and course
                            adminRoleController.findOrCreateAdminRole({
                              UserId: user.id,
                              CourseId: course.id
                            })
                                .spread(function (adminRole, created) {
                                  if (adminRole) {
                                    console.log('[init] Created adminRole with CourseId: ' + adminRole.CourseId + ' UserId: ' + adminRole.UserId)
                                  }
                                })
                                .catch((err) => {
                                  console.error(err)
                                })
                          }
                        })
                        .catch((err) => {
                          console.error(err)
                        })
                  }
                })
                .catch((err) => {
                  console.error(err)
                })
        } else {
          console.log("[init] couldn't find person")
        }
      })
    })
