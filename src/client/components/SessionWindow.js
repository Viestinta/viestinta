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

    connectToSession () {
        
    }

    getAvailableSessions () {

    }

    createNewSession () {

    }

    render () {
        return (
            <div>

            </div>
        )
    }

}