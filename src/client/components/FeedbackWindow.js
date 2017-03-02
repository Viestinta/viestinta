import React, { Component } from 'react'
import socket from '../../server/socket'


export default class FeedbackWindow extends Component {

  constructor (props) {
    super(props)
    this.state = {
      minsElapsed: 0,
      feedback: [0,0]
    }
  }

  tick () {
    this.setState({
      minsElapsed: this.state.minsElapsed + 1
    })
    if (this.state.minsElapsed == 5) {
      this.state.updateFeedbackInterval()
    }
  }

  componentDidMount() {
    // Increase every min
    this.interval = setInterval(this.tick, 6000)  
    socket.on('receive-feedback', this.receiveFeedback)  
  }

  receiveFeedback (feedback) {
    console.log("Setting feedback")
    this.setState({feedback: feedback})
  }

  updateFeedbackInterval () {

  }


  render () {
    return (
      <div id='feedbackWindow'>
        <p>Antall som synes det går for tregt: {this.state.feedback[0]}</p>
        <p>Antall som synes det går for fort: {this.state.feedback[1]}</p>
      </div>
    )
  }
}
