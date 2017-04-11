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
    height: '100%',
    
    padding: '20px'
  },
  button: {
    margin: '12px',
    minWidth: '105px'
  }
}

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
    // TODO: set to 5 x 6000 after testing
    var interval = setInterval(this.activateButtons, 3000)
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
      <div style={styles.container}>
        <h3>Tilbakemelding til foreleser</h3> 
        <p>Vennligst gi tilbakemelding på hvordan du opplever 
        forelesningen akkurat nå.</p> 
        <Subheader>Tempo:</Subheader>
        <div>
          <RaisedButton style={styles.button} primary={true} disabled={this.state.disabled} onTouchTap={this.slowClick} label='For tregt' />
          <RaisedButton style={styles.button} primary={true} disabled={this.state.disabled} onTouchTap={this.fastClick} label='For fort' />
        </div>
      </div>
    )
  }
}
