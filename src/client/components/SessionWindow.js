import React, { Component } from 'react'
import socket from '../socket'
import axios from 'axios'

import Header from './Header'

import Paper from 'material-ui/Paper'
import Subheader from 'material-ui/Subheader'
import RaisedButton from 'material-ui/RaisedButton'
import LectureTable from './LectureTable'
import LectureWrapper from './LectureWrapper'

import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import {Step, Stepper, StepLabel} from 'material-ui/Stepper'
import DatePicker from 'material-ui/DatePicker'
import TimePicker from 'material-ui/TimePicker'  

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

            openDialog: false,
            stepIndex: 0,

            courseCode: undefined,
            name: undefined,
            description: undefined,
            startTime: undefined,
            endTime: undefined
        }

        this.setSelectedLecture = this.setSelectedLecture.bind(this)
        this.connectToLecture = this.connectToLecture.bind(this)
        this.disconnectFromLecture = this.disconnectFromLecture.bind(this)
        /* New lecture */
        this.createNewLecture = this.createNewLecture.bind(this)
        this.handleOpen = this.handleOpen.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.handleNext = this.handleNext.bind(this)
        this.handlePrev = this.handlePrev.bind(this)
        this.getStepContent = this.getStepContent.bind(this)
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
        const lectureInfo = {
            courseCode: this.state.courseCode, 
            name: this.state.name, 
            /*optional*/
            description: this.state.description,
            startTime: this.state.startTime,
            endTime: this.state.endTime,
            isActive: true
        }
        console.log('[SessionWindow] createNewLecture(), lectureInfo:')
        console.log('- courseCode:  ' + lectureInfo.courseCode)
        console.log('- name:        ' + lectureInfo.name)
        console.log('- description: ' + lectureInfo.description)
        console.log('- startTime:   ' + lectureInfo.startTime)
        console.log('- endTime:     ' + lectureInfo.endTime)
        //socket.emit('create-lecture', lectureInfo)
        this.handleClose()
    }

    handleOpen () {
        this.setState({openDialog: true})
    }

    handleClose () {
        this.setState({
            openDialog: false,
            stepIndex: 0,

            courseCode: undefined,
            name: undefined,
            description: undefined,
            startTime: undefined,
            endTime: undefined
        })
    }

    handleNext () {
        const stepIndex = this.state.stepIndex
        this.setState({
            stepIndex: stepIndex + 1,
        })
    }

    handlePrev () {
        const stepIndex = this.state.stepIndex
        if (stepIndex > 0) {
            this.setState({stepIndex: stepIndex - 1});
        }
    }

    getStepContent () {
        switch (this.state.stepIndex) {
        case 0:
            return (<DatePicker hintText="Portrait Dialog" />)
        case 1:
            return (<TimePicker format="24hr" hintText="24hr Format"/>)
        case 2:
            return 'Dette er det du har valgt.'
        default:
            return ''
        }
    }

    render () {
        return (
            <div style={styles.container}>
                {/* App header */}
                <Header userName={this.props.user.name} isAdmin={this.props.isAdmin} toggleAdmin={this.props.toggleAdmin}/>
                {/* Session header */}
                <Paper zDepth={3} style={styles.session}>
                    <Subheader style={{width: 'auto'}}>
                        {this.state.selectedLecture ? this.state.selectedLecture.course.code + ' : ' + this.state.selectedLecture.course.name : 'Velg forelesning fra listen under'}
                    </Subheader>
                    
                    { (this.state.selectedLecture || this.props.isAdmin) ?
                        <RaisedButton
                            primary={true}
                            label= { this.state.selectedLecture ? "Forlat forelesning" : "Lag ny" }
                            onTouchTap={ this.state.selectedLecture ? this.disconnectFromLecture : this.handleOpen }
                        /> : undefined
                    }
                </Paper>
                {/* Dialog on 'create lecture' */}
                <Dialog
                    title="Lag ny forelesning"
                    actions={<FlatButton label="Avbryt" primary={true} onTouchTap={this.handleClose}/>}
                    modal={false}
                    open={this.state.openDialog}
                    onRequestClose={this.handleClose}
                >
                    <Stepper activeStep={this.state.stepIndex}>
                        <Step>
                            <StepLabel>Påkrevd info</StepLabel>
                        </Step>
                        <Step>
                            <StepLabel>Valgfri info</StepLabel>
                        </Step>
                        <Step>
                            <StepLabel>Fullfør</StepLabel>
                        </Step>
                    </Stepper>
                    <div style={{margin: '0 16px'}}>
                        <div>
                            {this.getStepContent()}
                            <div style={{marginTop: 12}}>
                                <FlatButton
                                label="Tilbake"
                                disabled={this.state.stepIndex === 0}
                                onTouchTap={this.handlePrev}
                                style={{marginRight: 12}}
                                />
                                <RaisedButton
                                label={this.state.stepIndex === 2 ? 'Fullfør' : 'Neste'}
                                primary={true}
                                onTouchTap={this.state.stepIndex === 2 ? this.createNewLecture : this.handleNext}
                                />
                            </div>
                        </div>
                    </div>
                </Dialog>
                {/* Display session or table of sessions */}
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