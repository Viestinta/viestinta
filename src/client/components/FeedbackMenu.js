import React, { Component } from 'react'
import socket from '../socket'

import Subheader from 'material-ui/Subheader'
import RaisedButton from 'material-ui/RaisedButton'

const styles = {
  container: {
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'flex-start', 
    justifyContent: 'flex-start', 
    
    width: '100%',
    height: '100%'
  },
  button: {
    margin: '12px',
    minWidth: '105px'
  }
}

// Final variable representing a minute
var MIN = 1000*60

export default class FeedbackMenu extends Component {

  /**
   * @summary Sat state and bind functions
   * @param {props} props - onClick() and lecture given from FeedbackBox
   */
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

  /**
   * @summary Set interval for activating feedbackbuttons and set state intervalId.
   */
  componentDidMount () {
    // Activate button every x min
    var interval = setInterval(this.activateButtons, 5*MIN)
    this.setState({intervalId: interval})
  }

  /**
   * @summary Clear interval when component unmounts.
   */
  componentWillUnmount () {
    clearInterval(this.state.intervalId)
  }

  /**
   * @summary Activate buttons when interval has passed.
   */
  activateButtons () {
    this.setState({
      disabled: false
    })
  }

  /**
   * @summary Called when feedbackbutton clicked is 'slow', and then disable buttons.
   */
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

  /**
   * @summary Called when feedbackbutton clicked is 'fast', and then disable buttons.
   */
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
      <div style={styles.container}>
        <h3>Tilbakemelding til foreleser</h3> 
        <Subheader>Tempo:</Subheader>
        <div style={{alignSelf: 'center'}}>
          <RaisedButton style={styles.button} primary={true} disabled={this.state.disabled} onTouchTap={this.slowClick} label='For tregt' />
          <RaisedButton style={styles.button} primary={true} disabled={this.state.disabled} onTouchTap={this.fastClick} label='For fort' />
        </div>
      </div>
    )
  }
}
