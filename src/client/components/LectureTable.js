import React, { Component } from 'react'
import axios from 'axios'

import Paper from 'material-ui/Paper'
import DataTables from 'material-ui-datatables'   

const styles = {
  container: {
    width: '100%',
    height: '100%',

    marginTop: '10px'
  }
};

const TABLE_COLUMNS = [
  {
    key: 'course',
    label: 'Emnekode',
    sortable: true,
  },
  {
    key: 'courseName',
    label: 'Navn',
    sortable: true,
  }, 
  {
    key: 'lectureName',
    label: 'Tema',
    sortable: true,
  }
]

export default class LectureTable extends Component {

    /**
     * @summary Save state and bind functions.
     * @param {props} props - setSelectedLecture from SessionWindow.
     */
    constructor(props) {
        super(props)

        this.state = {
            lectureList: [],
            filteredLectureList: [],
            disable: false
        }

        this.getAvailableLectures = this.getAvailableLectures.bind(this)
        this.handleCellClick = this.handleCellClick.bind(this)
        this.handleFilterValueChange = this.handleFilterValueChange.bind(this)
        this.getLectures = this.getLectures.bind(this)
    }

    /**
     * @summary Call getAvailableLectures when LectureTable mounts.
     */
    componentDidMount() {
        /* This method is called after first render */
        this.getAvailableLectures()
    }

    /**
     * @summary Get available lectures.
    */
    getAvailableLectures () {
      axios
        .get("/lectures")
        .then(request => {
          let data = request.data
          // Add the room to the data to make it more easily accessible
          data.map((data) => data.room = data.course.code + '-' + JSON.stringify(data.id))
          this.setState({
            lectureList: data,
            filteredLectureList: data,
          })
        })
        .catch(err => {
          console.log(err)
        })
    }
    /**
     * @summary Get lectures
     * @return {course} The course that was searched on
     */
    getLectures () {
        if (this.state.filteredLectureList) {
            return this.state.filteredLectureList.map((a) => {
              return {
                course: a
              }
            })
        } else {
            return this.state.lectureList.map((a) => {
              return {
                course: a
              }
            })
        } 
    }

    /**
     * @summary Call setSelectedLecture from props when lecture is clicked on.
     */
    handleCellClick (row, col, event) {
        let ll = this.state.filteredLectureList
        this.props.setSelectedLecture(ll[row])
    }

    /**
     * @summary Set state filteredLectureList when user search.
     * @param {string} value - The value the user search on.
     */
    handleFilterValueChange (value) {
        if (value === '' || value === undefined) {
          this.setState({
              filteredLectureList: this.state.lectureList
          })
        } else {
          // Create a new list based on this.state.lectureList
          let list = this.state.lectureList.slice()

          // Create a single string to search for the information in and filter it by the value in the search field
          list.map((lecture) => lecture.filterString = lecture.course.code + ' ' + lecture.course.name + ' ' + lecture.name)
          list = list.filter((lecture) => lecture.filterString.toLowerCase().includes(value.toLowerCase()))
          
          // Set the filtered list
          this.setState({
              filteredLectureList: list 
          })
        }
    }

    render () {
      return (
        <Paper zDepth={3} style={styles.container}>
          <DataTables
            height = { 'auto' }
            selectable = { false }
            showRowHover = { true }
            columns = {TABLE_COLUMNS}
            data = { this.state.filteredLectureList.map(lecture => {
                return {
                    course:lecture.course.code,
                    courseName:lecture.course.name,
                    lectureName:lecture.name
                }
            })}
            showCheckboxes = { false }
            showHeaderToolbar = { true }
            onCellClick = { this.handleCellClick }
            onCellDoubleClick= { this.handleCellDoubleClick }
            onFilterValueChange = { this.handleFilterValueChange }
            onSortOrderChange = { this.handleSortOrderChange }
            page = { 1 }
            count = { this.state.filteredLectureList.length }
          />
        </Paper> 
        )
    }
}
