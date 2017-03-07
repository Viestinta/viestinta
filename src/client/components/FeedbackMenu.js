import React, { Component } from 'react'
import socket from '../../server/socket'

import RaisedButton from 'material-ui/RaisedButton'

const style = {
  margin: 12
}

export default class FeedbackMenu extends Component {

  constructor (props) {
    super(props)

    this.slowClick = this.slowClick.bind(this)
    this.fastClick = this.fastClick.bind(this)
  }

  componentDidMount () {
    socket.on('join', this.join)
    socket.on('sendFeedback', this.receiveMessage)
  }

  sendFeedback (feedback) {
    socket.emiit('new-feedback', feedback)
  }


  slowClick () {
    const feedback = {'type': 'slow'}
    this.props.onClick(feedback)
  }

  fastClick () {
    const feedback = {'type': 'fast'}
    this.props.onClick(feedback)
  }

  render () {
    return (
        <div id='feedbackMenuBar'>
            <RaisedButton style={style} onTouchTap={this.slowClick} label='For tregt' />
            <RaisedButton style={style} onTouchTap={this.fastClick} label='For fort' />
        </div>
    )
  }
}
