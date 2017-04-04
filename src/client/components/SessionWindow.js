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
    label: 'course',
    sortable: true,
  },
]

export default class SessionWindow extends Component {

    constructor(props) {
        super(props)

        this.state = {
            currentSessionID: undefined,
            /* Set default values for develop
               Set empty [] when done
               When 'getAvailableLectures()' works */
            lectureList: ['TDT0000', 'TTK0000', 'TIØ0000'],
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
      axios
        .get("/lectures")
        .then(lectureList => {
          this.setState({
            lectureList: lectureList
          }, function () {
              this.handleFilterValueChange("")
          })
          console.log("Returning list of lectures: " + lectureList)
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
        console.log('[SessionWindow] Connect to lecture: ' + this.state.selectedLecture)
        socket.emit('join-lecture', this.state.selectedLecture)
    }

    disconnectFromLecture () {
        console.log('[SessionWindow] Leave lecture: ' + this.state.selectedLecture)
        socket.emit('leave-lecture', this.state.selectedLecture)
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
        var menuItems = this.state.lectureList.map((lecture, i) => {
            return (
                <MenuItem
                    value={i+2}
                    key={i} /* All menu items need unique key */
                    primaryText={lecture}
                />
            )
        })

        return (
            <div>
            <Paper zDepth={3} style={styles.container}>
                <Subheader style={{width: 'auto'}}>
                    FORELESNING: {this.state.selectedLecture}
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
                    courseCode={this.state.selectedLecture}
                /> 
                : 
                <DataTables
                    height = { 'auto' }
                    selectable = { false }
                    showRowHover = { true }
                    columns = {TABLE_COLUMNS}
                    data = { this.state.lectureList.map((a) => {
                        return {
                            course:a
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