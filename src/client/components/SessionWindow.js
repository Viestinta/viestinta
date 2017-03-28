import React, { Component } from 'react'
import socket from '../socket'
import axios from 'axios'

// Theme
import {orange800} from 'material-ui/styles/colors'
import {blue500} from 'material-ui/styles/colors'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

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