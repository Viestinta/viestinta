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
    label: 'Course',
    sortable: true,
  },
  {
    key: 'courseName',
    label: 'Course Name',
    sortable: true,
  }, 
  {
    key: 'lectureName',
    label: 'Lecture Name',
    sortable: true,
  }
]

export default class LectureTable extends Component {

    constructor(props) {
        super(props)

        this.state = {
            lectureList: [],
            filteredLectureList: undefined,
            disable: false
        }

        this.getAvailableLectures = this.getAvailableLectures.bind(this)
        this.handleCellClick = this.handleCellClick.bind(this)
        this.handleFilterValueChange = this.handleFilterValueChange.bind(this)
        this.getLectures = this.getLectures.bind(this)
    }

    componentDidMount() {
        /* This method is called after first render */
        this.getAvailableLectures()
    }

    getAvailableLectures () {
      console.log('[SessionWindow][getAvailableLectures] Trying to get available lectures')
      axios
        .get("/lectures")
        .then(request => {
          console.log('[SessionWindow][getAvailableLectures][axios] got list of lectures: ' + JSON.stringify(request.data))
          let data = request.data
          // Add the room to the data to make it more easily accessible
          data.map((data) => data.room = data.course.code + '-' + JSON.stringify(data.id))
          this.setState({
            lectureList: data
          })
          //console.log("Returning list of lectures: " + lectureList)
        })
        .catch(err => {
          console.log(err)
        })
    }

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

    handleCellClick (row, col, event) {
        console.log('[LectureTable] handleCellClick')
        console.log('[LectureTable] row: ' + row + ' col: ' + col + ' event: ' + event)
        let ll = this.state.lectureList
        console.log('[LectureTable] ll: ' + JSON.stringify(ll) + ' row: ' +  row + ' ll[row]: ' + ll[row])
        this.props.setSelectedLecture(ll[row])
    }

    handleFilterValueChange (value) {
        console.log('[SessionWindow][DataTables] Filter by value: ' + value)
        if (value === '') {
            this.setState({
                filteredLectureList: this.state.lectureList
            })
        } else {
            this.setState({
                filteredLectureList: this.state.lectureList.filter((a) => a.indexOf(value) > -1)  
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
                    data = { this.state.lectureList.map(lecture => {
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
                    count = { 100 }
                />
            </Paper> 
        )
    }
}
