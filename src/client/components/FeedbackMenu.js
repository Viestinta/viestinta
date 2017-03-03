import React, { Component } from 'react'
import socket from '../../server/socket'

import RaisedButton from 'material-ui/RaisedButton'

import {deepOrange500} from 'material-ui/styles/colors'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import injectTapEventPlugin from 'react-tap-event-plugin'

const style = {
  margin: 12
}

const muiTheme = getMuiTheme({
  palette: {
    accent1Color: deepOrange500
  }
})

export default class FeedbackMenu extends Component {

  constructor (props) {
    super(props)
    this.state = {
      disabled: false
    }

    this.slowClick = this.slowClick.bind(this)
    this.fastClick = this.fastClick.bind(this)
    this.activateButtons = this.activateButtons.bind(this)
  }

  componentDidMount () {
    // Activate button every x min
    this.interval = setInterval(activateButtons(), 100)
  }

  activateButtons () {
    this.setState({
      disabled: false
    })
  }

  slowClick () {
    socket.emit('new-feedback', -1)
    this.setState({
      disabled: true
    })

  }

  fastClick () {
    socket.emit('new-feedback', 1)
    this.setState({
      disabled: true
    })
  }

  render () {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div id='feedbackMenuBar'>
          <RaisedButton style={style} disabled={this.state.disabled} onTouchTap={this.slowClick} label='For tregt' />
          <RaisedButton style={style} disabled={this.state.disabled} onTouchTap={this.fastClick} label='For fort' />
        </div>
      </MuiThemeProvider>
    )
  }
}
