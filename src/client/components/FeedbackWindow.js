import React, { Component } from 'react'
import socket from '../socket'

export default class FeedbackWindow extends Component {

  /**
   * @summary Save state and bind functions
   * @param {props} event - slow, fast, updateFeedbackInterval and lecture from FeedbackBox.
   */
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

  /**
   * @summary Counting for when to update feedbackInterval, and if right time, calls the funciton.
   * @param {props} event - slow, fast, updateFeedbackInterval and lecture from FeedbackBox.
   */
  tick () {
    var minsElapsed = this.state.minsElapsed + 1
    this.setState({
      minsElapsed: minsElapsed
    })
    if (this.state.minsElapsed === 5) {
      this.state.updateFeedbackInterval()
    }
  }

  /**
   * @summary Set interval, set state intervalId and set FeedbackWindow to listen to server events.
   */
  componentDidMount () {
    // Increase every min
    var interval = setInterval(this.tick, 60000)
    this.setState({intervalId: interval})
    socket.on('receive-feedback', this.receiveFeedback)
    socket.on('update-feedback-interval', this.updateFeedbackInterval)
    console.log("[FeedbackWindow] Component did mount.")
  }

  /**
   * @summary Clear interval when  FeedbackWindow unmounts.
   */
  componentWillUnmount () {
    clearInterval(this.state.intervalId)
    console.log("[FeedbackWindow] Component will unmount.")

  }

  /**
   * @summary Receive feedback and updates state feedback.
   * @param {feedback} feedback - feedback with value 1 or -1.
   */
  receiveFeedback (feedback) {
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

  /**
   * @summary Set state feedback
   * @param {list} feedbacks - [slow, fast] where values are -1 or 1.
   */
  updateFeedbackInterval (feedbacks) {
    this.setState({
      feedback: feedbacks
    })
  }

  render () {
    return (
      <div>
        <p>Antall som synes det går for tregt: {this.state.feedback[0]}</p>
        <p>Antall som synes det går for fort: {this.state.feedback[1]}</p>
      </div>
    )
  }
}

FeedbackWindow.propTypes = {
  slow: React.PropTypes.number,
  fast: React.PropTypes.number,
  updateFeedbackInterval: React.PropTypes.func
}
