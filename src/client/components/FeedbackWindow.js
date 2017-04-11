import React, { Component } from 'react'
import socket from '../socket'

import LineChart from './LineChart'

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }
}

export default class FeedbackWindow extends Component {

  constructor (props) {
    super(props)

    this.state = {
      // minsElapsed: 0,
      feedback: [0, 0],
      intervalId: undefined
    }

    this.tick = this.tick.bind(this)
    this.receiveFeedback = this.receiveFeedback.bind(this)
    this.updateFeedbackInterval = this.updateFeedbackInterval.bind(this)
  }

  tick () {
    console.log('[FeedbackWindow] In tick')

    var minsElapsed = this.state.minsElapsed + 1
    this.setState({
      minsElapsed: minsElapsed
    })
    if (this.state.minsElapsed === 5) {
      this.updateFeedbackInterval()
    }
  }

  componentDidMount () {
    // Increase every min
    var interval = setInterval(this.tick, 60000)
    this.setState({intervalId: interval})
    socket.on('receive-feedback', this.receiveFeedback)
    socket.on('update-feedback-interval', this.updateFeedbackInterval)
    console.log("[FeedbackWindow] Component did mount.")
  }

  componentWillUnmount () {
    clearInterval(this.state.intervalId)
    console.log("[FeedbackWindow] Component will unmount.")

  }

  receiveFeedback (feedback) {
    console.log('[FeedbackWindow] Setting feedback:', feedback.value)
    var feedbackList = this.state.feedback
    if (feedback.value === -1) {
      feedbackList[0] = feedbackList[0] + 1
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
  }

  render () {
    return (
      <div style={styles.container}>
        <LineChart />
        <p>Antall som synes det går for tregt: {this.state.feedback[0]}</p>
        <p>Antall som synes det går for fort: {this.state.feedback[1]}</p>
      </div>
    )
  }
}
