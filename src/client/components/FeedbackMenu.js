import React, { Component } from 'react'
import socket from '../../server/socket'

import RaisedButton from 'material-ui/RaisedButton'

const style = {
  margin: 12
}

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
    this.interval = setInterval(this.activateButtons, 5 * 6000)
  }

  activateButtons () {
    console.log('[FeedbackMenu] activateButtons')
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
        <div id='feedbackMenuBar'>
          <RaisedButton style={style} disabled={this.state.disabled} onTouchTap={this.slowClick} label='For tregt' />
          <RaisedButton style={style} disabled={this.state.disabled} onTouchTap={this.fastClick} label='For fort' />
        </div>
    )
  }
}
