import React, { Component } from 'react'
import socket from '../socket'

import RaisedButton from 'material-ui/RaisedButton'

const style = {
  margin: '12px',
  minWidth: '105px'
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
    // TODO: set to 5 x 6000 after testing
    this.interval = setInterval(this.activateButtons, 3000)
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
        <RaisedButton style={style} primary={true} disabled={this.state.disabled} onTouchTap={this.slowClick} label='For tregt' />
        <RaisedButton style={style} primary={true} disabled={this.state.disabled} onTouchTap={this.fastClick} label='For fort' />
      </div>
    )
  }
}

FeedbackMenu.propTypes = {
  onClick: React.PropTypes.func
}
