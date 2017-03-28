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
            currentSessionID: undefined
        }
    }

    connectToLecture () {
        //TODO: Håndteres av Socket? Som del av Rooms
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

    createNewLecture () {
        //TODO: Håndteres av Socket?
        //TODO: Kan ikke være mulig for hvem som helst å lage via et API call
    }

    render () {
        return (
            <div>

            </div>
        )
    }

}