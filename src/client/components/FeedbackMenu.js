import React, { Component } from 'react'
import socket from '../socket'

import RaisedButton from 'material-ui/RaisedButton'

const style = {
  margin: '12px',
  minWidth: '105px'
}

var MIN = 1000*60

export default class FeedbackMenu extends Component {

  constructor (props) {
    super(props)
    this.state = {
      disabled: false,
      intervalId: undefined
    }

    this.slowClick = this.slowClick.bind(this)
    this.fastClick = this.fastClick.bind(this)
    this.activateButtons = this.activateButtons.bind(this)
  }

  componentDidMount () {
    // Activate button every x min
    var interval = setInterval(this.activateButtons, 5*MIN)
    this.setState({intervalId: interval})
  }

  componentWillUnmount () {
    clearInterval(this.state.intervalId)
  }

  activateButtons () {
    console.log('[FeedbackMenu] activateButtons')
    this.setState({
      disabled: false
    })
  }

  slowClick () {
    let feedback =  {
      value: -1,
      lecture: {
        id:  JSON.stringify(this.props.lecture.id),
        code: this.props.lecture.course.code,
        room: this.props.lecture.room,
      }
    }
    socket.emit('new-feedback', feedback)
    this.setState({
      disabled: true
    })
  }

  fastClick () {
    let feedback =  {
      value: 1,
      lecture: {
        id:  JSON.stringify(this.props.lecture.id),
        code: this.props.lecture.course.code,
        room: this.props.lecture.room,
      }
    }
    socket.emit('new-feedback', feedback)
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
