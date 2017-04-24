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
        this.handleCodeChange = this.handleCodeChange.bind(this)
        this.handleNameChange = this.handleNameChange.bind(this)
        this.getStepContent = this.getStepContent.bind(this)
        this.handleDateChangeStart = this.handleDateChangeStart.bind(this)
        this.handleTimeChangeStart = this.handleTimeChangeStart.bind(this)
        this.handleDateChangeEnd = this.handleDateChangeEnd.bind(this)
        this.handleTimeChangeEnd = this.handleTimeChangeEnd.bind(this)
        this.formatDate = this.formatDate.bind(this)
        this.formatTime = this.formatTime.bind(this)
        this.disableDateStart = this.disableDateStart.bind(this)
        this.disableDateEnd = this.disableDateEnd.bind(this)
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
            startDate: this.state.startDate,
            endDate: this.state.endDate,
            isActive: true
        }
        console.log('[SessionWindow] createNewLecture(), lectureInfo:')
        console.log('- courseCode:  ' + lectureInfo.courseCode)
        console.log('- name:        ' + lectureInfo.name)
        console.log('- startDate:   ' + lectureInfo.startDate)
        console.log('- endDate:     ' + lectureInfo.endDate)
        
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
            startDate: undefined,
            endDate: undefined
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

    handleCodeChange (e) {
        var text = e.target.value
        if (text.length > 7) {
            text = e.target.value.substring(0, 7)
        }
        this.setState({
            courseCode: text
        })
    }

    handleNameChange (e) {
        var text = e.target.value
        if (text.length < 0){
            text = undefined
        }
        this.setState({
            name: text
        })
    }

    handleDateChangeStart (event, date) {
        var startDate = this.state.startDate
        if (startDate != undefined){
            startDate.setDate(date.getDate())
            startDate.setMonth(date.getMonth())
            this.setState({
                startDate: startDate
            })
        } else {
            // Undefined -> new Date()
            this.setState({
                startDate: date
            })
        }
    }

    handleTimeChangeStart (event, date) {
        var startDate = this.state.startDate
        startDate.setHours(date.getHours())
        startDate.setMinutes(date.getMinutes())
        startDate.setSeconds(0)
        this.setState({
            startDate: startDate
        })
    }

    handleDateChangeEnd (event, date) {
        var endDate = this.state.endDate
        if (endDate != undefined){
            endDate.setDate(date.getDate())
            endDate.setMonth(date.getMonth())
            this.setState({
                endDate: endDate
            })
        } else {
            // Undefined -> new Date()
            this.setState({
                endDate: date
            })
        }
    }

    handleTimeChangeEnd (event, date) {
        var endDate = this.state.endDate
        endDate.setHours(date.getHours())
        endDate.setMinutes(date.getMinutes())
        endDate.setSeconds(0)
        this.setState({
            endDate: endDate
        })
    }

    formatDate (date) {
        var day = date.getDate()
        var month = date.getMonth() + 1
        if (day < 10){day = '0' + day}
        if (month < 10){month = '0' + month}

        return (date.getFullYear() + '-' + month + '-' + day)
    }

    formatTime (date) {
        var hours = date.getHours()
        var minutes = date.getMinutes()
        if (hours < 10){hours = '0' + hours}
        if (minutes < 10){minutes = '0' + minutes}
        return (hours + ':' + minutes + ':00')
    }

    disableDateStart (date) {
        const now = new Date()
        if ( (date.getDate() == now.getDate()) && (date.getMonth() == now.getMonth()) ){
            // Don't disable current date (now)
            return false
        } else {
            return ( date < new Date() )
        }
    }

    disableDateEnd (date) {
        var limit = this.state.startDate
        if (limit === undefined){
            limit = new Date()
        }
        if ( (date.getDate() == limit.getDate()) && (date.getMonth() == limit.getMonth()) ){
            // Don't disable current date (limit)
            return false
        } else {
            return ( date < limit )
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
                            shouldDisableDate={this.disableDateStart}
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
                            shouldDisableDate={this.disableDateEnd}
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
                        disabled={this.state.name === undefined}
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