import React, { Component } from 'react'
import socket from '../socket'
import axios from 'axios'

import Paper from 'material-ui/Paper'
import Subheader from 'material-ui/Subheader'
import DropDownMenu from 'material-ui/DropDownMenu'
import MenuItem from 'material-ui/MenuItem'
import RaisedButton from 'material-ui/RaisedButton'
import LectureWrapper from './LectureWrapper'

import DataTables from 'material-ui-datatables';    

const styles = {

    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',

        maxWidth: '500px',
        width: '100%',
        height: '100%'
    },
    session: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'baseline',
        justifyContent: 'space-between',

        maxWidth: '500px',
        width: '100%',

        marginTop: '10px',
        padding: '10px'
    }
}

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

export default class SessionWindow extends Component {

    constructor(props) {
        super(props)

        this.state = {
            currentSessionID: undefined,
            /* Set default values for develop
               Set empty [] when done
               When 'getAvailableLectures()' works */
            lectureList: [],
            selectedLecture: undefined,
            filteredLectureList: undefined,
            value: 1,
            disable: false
        }

        this.connectToLecture = this.connectToLecture.bind(this)
        this.getAvailableLectures = this.getAvailableLectures.bind(this)
        this.createNewLecture = this.createNewLecture.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.connectToLectureButton = this.connectToLectureButton.bind(this)
        this.handleCellClick = this.handleCellClick.bind(this)
        this.disconnectFromLecture = this.disconnectFromLecture.bind(this)
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

    connectToLecture () {
        console.log('[SessionWindow] Connect to lecture: ' + this.state.selectedLecture.room)
        socket.emit('join-lecture', {code: this.state.selectedLecture.course.code, id:this.state.selectedLecture.id, room:this.state.selectedLecture.room})
    }

    disconnectFromLecture () {
        console.log('[SessionWindow] Leave lecture: ' + this.state.selectedLecture.room)
        socket.emit('leave-lecture', {code: this.state.selectedLecture.course.code, id:this.state.selectedLecture.id, room:this.state.selectedLecture.room})
        this.setState({
            disable:false,
            selectedLecture: undefined,
        })
    }

    createNewLecture (courseCode, lectureName) {
        //TODO: Håndteres av Socket?
        //TODO: Kan ikke være mulig for hvem som helst å lage via et API call
        axios.post('/create-lecture', {courseCode: courseCode, lectureName: lectureName}).then(function () {
            console.log('[SessionWindow][Axios] Create new lecture, course: ' + courseCode + ' name: ' + lectureName)
        })
    }

    handleChange (event, index, value) {
        this.setState({
            value: value
        })
        if (index > 0) {
            this.setState({
                disable: false,
                selectedLecture: this.state.lectureList[index-1]
            })
        } else {
            this.setState({
                disable: true,
                selectedLecture: undefined
            })
        }
    }

    connectToLectureButton () {
        // TODO: Funksjonalitet ved knappetrykk
        this.connectToLecture()

        // Only connect once -> disable button
        this.setState({disable: true})
    }

    handleCellClick (row, col, event) {
        console.log('[SessionWindow] handleCellClick')
        console.log('[SessionWindow] row: ' + row + ' col: ' + col + ' event: ' + event)
        let ll = this.state.lectureList
        console.log('[SessionWindow] ll: ' + JSON.stringify(ll) + ' row: ' +  row + ' ll[row]: ' + ll[row])
        this.setState({
            disable: true,
            selectedLecture: ll[row]
        }, function () {
            console.log('[SessionWindow] lectureList: '+ this.state.lectureList + 'selectedLecture: ' + this.state.selectedLecture)
            this.connectToLecture()
        })
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
            <div style={styles.container}>
            <Paper zDepth={3} style={styles.session}>
                <Subheader style={{width: 'auto'}}>
                    {this.state.selectedLecture ? this.state.selectedLecture.course.code + ' : ' + this.state.selectedLecture.course.name : 'Velg forelesning fra listen under'}
                </Subheader>
                {/*
                <DropDownMenu value={this.state.value} onChange={this.handleChange}>
                    <MenuItem value={1} primaryText="-Velg her-" />
                    {menuItems}
                </DropDownMenu>
                */}
                <RaisedButton
                    primary={true}
                    label= { !this.state.selectedLecture ? "Lag ny" : "Koble fra" }
                    onTouchTap={ !this.state.selectedLecture ? this.createNewLecture : this.disconnectFromLecture }
                />
            </Paper>
            { this.state.selectedLecture ? 
                <LectureWrapper
                    isAdmin={this.props.isAdmin} 
                    lecture={this.state.selectedLecture}
                /> 
                : 
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
            }
            </div>
        )
    }
}