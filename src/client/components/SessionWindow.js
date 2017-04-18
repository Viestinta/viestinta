import React, { Component } from 'react'
import socket from '../socket'
import axios from 'axios'

import Header from './Header'

import Paper from 'material-ui/Paper'
import Subheader from 'material-ui/Subheader'
import RaisedButton from 'material-ui/RaisedButton'
import LectureTable from './LectureTable'
import LectureWrapper from './LectureWrapper'

import DataTables from 'material-ui-datatables';    

const styles = {

    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',

        maxWidth: '600px',
        width: '100%',
        height: '100%'
    },
    session: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'baseline',
        justifyContent: 'space-between',

        maxWidth: '600px',
        width: '100%',

        marginTop: '10px',
        padding: '10px'
    }
}

export default class SessionWindow extends Component {

    constructor(props) {
        super(props)

        this.state = {
            selectedLecture: undefined,
        }

        this.setSelectedLecture = this.setSelectedLecture.bind(this)
        this.connectToLecture = this.connectToLecture.bind(this)
        this.createNewLecture = this.createNewLecture.bind(this)
        this.disconnectFromLecture = this.disconnectFromLecture.bind(this)
    }

    setSelectedLecture (lecture) {
        this.setState({
            selectedLecture: lecture
        }, function () {
            this.connectToLecture()
        })
    }

    connectToLecture () {
        console.log('[SessionWindow] Connect to lecture: ' + this.state.selectedLecture.room)
        socket.emit('join-lecture', {user:this.props.user, code:this.state.selectedLecture.course.code, id:this.state.selectedLecture.id, room:this.state.selectedLecture.room})
    }

    disconnectFromLecture () {
        console.log('[SessionWindow] Leave lecture: ' + this.state.selectedLecture.room)
        socket.emit('leave-lecture', {user:this.props.user, code: this.state.selectedLecture.course.code, id:this.state.selectedLecture.id, room:this.state.selectedLecture.room})
        this.setState({
            selectedLecture: undefined,
        })
    }

    createNewLecture (courseCode, lectureName) {
        //TODO: Håndteres av Socket?
        axios.post('/create-lecture', {courseCode: courseCode, lectureName: lectureName}).then(function () {
            console.log('[SessionWindow][Axios] Create new lecture, course: ' + courseCode + ' name: ' + lectureName)
        })
    }

    render () {
        return (
            <div style={styles.container}>
            <Header userName={this.props.user.name} isAdmin={this.props.isAdmin} toggleAdmin={this.props.toggleAdmin}/>
            <Paper zDepth={3} style={styles.session}>
                <Subheader style={{width: 'auto'}}>
                    {this.state.selectedLecture ? this.state.selectedLecture.course.code + ' : ' + this.state.selectedLecture.course.name : 'Velg forelesning fra listen under'}
                </Subheader>
                
                { (this.state.selectedLecture || this.props.isAdmin) ?
                    <RaisedButton
                        primary={true}
                        label= { this.state.selectedLecture ? "Forlat forelesning" : "Lag ny" }
                        onTouchTap={ this.state.selectedLecture ? this.disconnectFromLecture : this.createNewLecture }
                    /> : undefined
                }
            </Paper>
            { this.state.selectedLecture ? 
                <LectureWrapper
                    isAdmin={this.props.isAdmin} 
                    lecture={this.state.selectedLecture}
                /> 
                : 
                <LectureTable setSelectedLecture={this.setSelectedLecture}/> 
            }
            </div>
        )
    }
}