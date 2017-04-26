import React, { Component } from 'react'
import socket from '../socket'
import axios from 'axios'

import Paper from 'material-ui/Paper'
import DataTables from 'material-ui-datatables'   
import {orange800} from 'material-ui/styles/colors'

const styles = {
    container: {
        width: '100%',
        height: '100%',

        maxWidth: '960px',

        marginTop: '10px'
    },
    tableText: {
        cursor: 'pointer',

        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis'
    }
};

const TABLE_COLUMNS = [
  {
    key: 'course',
    label: <span style={{color: orange800}}>Emnekode</span>,
    sortable: true,
  },
  {
    key: 'courseName',
    label: <span style={{color: orange800}}>Navn</span>,
    sortable: true,
  }, 
  {
    key: 'lectureName',
    label: <span style={{color: orange800}}>Tema</span>,
    sortable: true,
  }
]

export default class LectureTable extends Component {

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
    }

    componentDidMount() {
        /* This method is called after first render */
        socket.on('new-lecture', this.getAvailableLectures)
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
            lectureList: data,
            filteredLectureList: data,
          })
          //console.log("Returning list of lectures: " + lectureList)
        })
        .catch(err => {
          console.log(err)
        })
    }

    handleCellClick (row, col, event) {
        console.log('[LectureTable] handleCellClick')
        console.log('[LectureTable] row: ' + row + ' col: ' + col + ' event: ' + event)
        let ll = this.state.filteredLectureList
        console.log('[LectureTable] ll: ' + JSON.stringify(ll) + ' row: ' +  row + ' ll[row]: ' + ll[row])
        this.props.setSelectedLecture(ll[row])
    }

    handleFilterValueChange (value) {
        console.log('[SessionWindow][DataTables] Filter by value: ' + value)
        if (value === '' || value === undefined) {
            console.log('[SessionWindow][DataTables] set original value')
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
                            course:<div style={styles.tableText}>{lecture.course.code}</div>,
                            courseName:<div style={styles.tableText}>{lecture.course.name}</div>,
                            lectureName:<div style={styles.tableText}>{lecture.name}</div>
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
