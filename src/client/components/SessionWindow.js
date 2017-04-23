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
import TextField from 'material-ui/TextField'
import {orange800} from 'material-ui/styles/colors'

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
    },
    stepContent: {
        display: 'flex',
        minHeight: '100%',
        maxWidth: '240px',
        width: '100%',
        padding: '10px',

        borderStyle: 'solid',
        borderWidth: '1px',
        borderColor: orange800
    },
    dialogFooter: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: '0px 16px'
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
            startDate: undefined,
            endDate: undefined
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

    createNewLecture () {
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
        
        socket.emit('create-lecture', lectureInfo)
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
            /* TextField for 'courseCode' og 'tema' */
            return (
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <TextField
                        style={{width: '150px'}}
                        floatingLabelText={'Emnekode:'}
                        floatingLabelFixed={true}
                        hintText="Eks. 'TDT4140'"
                        rows={1}
                        rowsMax={1}
                        onChange={this.handleCodeChange}
                        value={this.state.courseCode}
                    />
                    <TextField
                        style={{width: '150px'}}
                        disabled={(this.state.courseCode === undefined)}
                        floatingLabelText={'Tema:'}
                        floatingLabelFixed={true}
                        hintText="Eks. 'Introduksjon'"
                        rows={1}
                        rowsMax={1}
                        onChange={this.handleNameChange}
                        value={this.state.name}
                    />
                </div>
            )
        case 1:
            /* DatePicker og TimePicker for 'start' og 'slutt' */
            return (
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <div style={{display: 'flex', flexDirection: 'row'}}>
                        <DatePicker 
                            textFieldStyle={{width: '100px'}}
                            hintText={'Dato start'}
                            cancelLabel='Avbryt'
                            onChange={this.handleDateChangeStart}
                        />
                        <TimePicker 
                            textFieldStyle={{width: '100px'}}
                            format='24hr'
                            hintText={'Klokkeslett'} 
                            onChange={this.handleTimeChangeStart}
                            disabled={this.state.startDate == undefined}
                        />  
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row'}}>
                        <DatePicker 
                            textFieldStyle={{width: '100px'}}
                            hintText={'Dato slutt'}
                            cancelLabel='Avbryt'
                            onChange={this.handleDateChangeEnd}
                        />
                        <TimePicker 
                            textFieldStyle={{width: '100px'}}
                            format='24hr'
                            hintText={'Klokkeslett'} 
                            onChange={this.handleTimeChangeEnd}
                            disabled={this.state.endDate == undefined}
                        />  
                    </div>
                </div>
            )
        case 2:
            /* Vis hva som er i lectureInfo før det skal sendes */
            var start = this.state.startDate
            var end = this.state.endDate
            return (
                <div>
                    <p>{'Emnekode: ' + this.state.courseCode}</p>
                    <p>{'Tema: ' + this.state.name}</p>
                    <p>Start:</p>
                    <p>&emsp;{start ? (this.formatDate(start) + ', kl. ' + this.formatTime(start)) : 'Ikke valgt'}</p>
                    <p>Slutt:</p>
                    <p>&emsp;{end ? (this.formatDate(end) + ', kl. ' + this.formatTime(end)) : 'Ikke valgt'}</p>
                </div>
            )
        default:
            return ''
        }
    }

    render () {
        const dialogActions = (
            <div style={styles.dialogFooter}>
                <div>
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
                <FlatButton 
                    label="Avbryt" 
                    primary={true} 
                    onTouchTap={this.handleClose}
                />
            </div>

        )
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
                    contentStyle={{width: '95%', maxWidth: '500px'}}
                    title="Lag ny forelesning"
                    actions={dialogActions}
                    modal={false}
                    open={this.state.openDialog}
                    onRequestClose={this.handleClose}
                >
                    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'stretch', justifyContent: 'space-between'}}>
                        <Stepper activeStep={this.state.stepIndex} orientation='vertical'>
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
                        <div style={styles.stepContent}>
                            {this.getStepContent()}
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