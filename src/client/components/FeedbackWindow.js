import React, { Component } from 'react'
import socket from '../../server/socket'

export default class FeedbackWindow extends Component {

  constructor (props) {
    super(props)

    this.state = {
      // minsElapsed: 0,
      feedback: [0, 0]
    }

    this.tick = this.tick.bind(this)
    this.receiveFeedback = this.receiveFeedback.bind(this)
    this.updateFeedbackInterval = this.updateFeedbackInterval.bind(this)
  }

  tick () {
    console.log('[FeedbackWindow] In tick')
    /*
    var minsElapsed = this.state.minsElapsed + 1
    this.setState({
      minsElapsed: minsElapsed
    })
    //if (this.state.minsElapsed == 5) {
    //  this.state.updateFeedbackInterval()
    //}
    */
  }

  componentDidMount () {
    // Increase every min
    this.interval = setInterval(this.tick, 60000)
    socket.on('receive-feedback', this.receiveFeedback)
    socket.on('update-feedback-interval', this.updateFeedbackInterval)
  }

  receiveFeedback (feedback) {
    console.log('Setting feedback')
    var feedbackList = this.state.feedback
    if (feedback === -1) {
      feedbackList[0] = feedbackList[0] - 1
    } else {
      feedbackList[1] = feedbackList[1] + 1
    }
    this.setState({
      feedback: feedbackList
    })
  }

  updateFeedbackInterval (feedbacks) {
    console.log('[FeedbackWindow] updateFeedbackInterval: ', feedbacks)

    this.setState({
      feedback: feedbacks
    })
    console.log('Feedback: ', this.state.feedback)
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
