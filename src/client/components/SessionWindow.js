import React, { Component } from 'react'
import socket from '../socket'
import axios from 'axios'

import Paper from 'material-ui/Paper'
import Subheader from 'material-ui/Subheader'
import DropDownMenu from 'material-ui/DropDownMenu'
import MenuItem from 'material-ui/MenuItem'
import RaisedButton from 'material-ui/RaisedButton'

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'baseline',
        justifyContent: 'space-between',

        maxWidth: '500px',
        width: '100%',

        marginTop: '10px',
        padding: '10px'
    }
}

export default class SessionWindow extends Component {

    constructor(props) {
        super(props)

        this.state = {
            currentSessionID: undefined,
            /* Set default values for develop
               Set empty [] when done
               When 'getAvailableLectures()' works */
            lectureList: ['TDT0000', 'TTK0000', 'TIØ0000'],
            menuValue: 1,
            disable: true
        }

        this.connectToLecture = this.connectToLecture.bind(this)
        this.getAvailableLectures = this.getAvailableLectures.bind(this)
        this.createNewLecture = this.createNewLecture.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleOnTouchTap = this.handleOnTouchTap.bind(this)
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
          })
          console.log("Returning list of lectures: " + lectureList)
        })
        .catch(err => {
          console.log(err)
        })
    }

    connectToLecture () {
        //TODO: Håndteres av Socket? Som del av Rooms
    }

    createNewLecture () {
        //TODO: Håndteres av Socket?
        //TODO: Kan ikke være mulig for hvem som helst å lage via et API call
    }

    handleChange (event, index, value) {
        console.log('Menu index: ' + index + ', value: ' + value)
        this.setState({
            menuValue: (index + 1)
        })
        if (index > 0) {
            this.setState({disable: false})
        } else {
            this.setState({disable: true})
        }
    }

    handleOnTouchTap () {
        // TODO: Funksjonalitet ved knappetrykk
        this.connectToLecture()

        // Only connect once -> disable button
        this.setState({disable: true})
    }

    render () {
        var menuItems = this.state.lectureList.map((lecture, i) => {
            return (
                <MenuItem
                    value={i+2}
                    key={i+2} /* Denne trengs, vet ikke hvorfor */
                    primaryText={lecture}
                />
            )
        })

        return (
            <Paper zDepth={3} style={styles.container}>
                <Subheader style={{width: 'auto'}}>
                    FORELESNING:
                </Subheader>
                <DropDownMenu value={this.state.menuValue} onChange={this.handleChange}>
                    <MenuItem value={1} primaryText="-Velg her-" />
                    {menuItems}
                </DropDownMenu>
                <RaisedButton
                    primary={true}
                    label="Koble til"
                    disabled={this.state.disable}
                    onTouchTap={this.handleOnTouchTap}
                />
            </Paper>
        )
    }
}