import React, { Component } from 'react'
import socket from '../socket'

import FeedbackMenu from './FeedbackMenu'
import FeedbackWindow from './FeedbackWindow'

export default class FeedbackBox extends Component {

  constructor (props) {
    super(props)
    this.state = {
			// [slow, fast]
      feedback: [0, 0]
    }

    this.onClick = this.onClick.bind(this)
    this.updateFeedback = this.updateFeedback.bind(this)
  }

	// Receiving updated feedback values
  updateFeedback (feedback) {
    console.log('In updateFeedback:', feedback)

    this.state.feedback = feedback
  }

  updateFeedbackInterval () {
    console.log('In updateFeedbackInterval')
  }

  onClick (feedback) {
    console.log('In onClick')
    if (feedback.type === 'slow') {
      feedbackList[0] = feedbackList[0] + 1
    } else if (feedback.type === 'fast') {
      feedbackList[1] = feedbackList[1] + 1
    } else {
      console.log('No valid type for buttonClick')
    }
    this.setState({feedback: feedbackList})
    this.props.sendFeedback(feedback)
  }

  render () {
    return (
      <div id='feedback'>
        <FeedbackMenu onClick={this.onClick} />
        <FeedbackWindow
          slow={this.state.feedback[0]}
          fast={this.state.feedback[1]}
          updateFeedbackInterval={this.updateFeedbackInterval}
        />
      </div>
    )
  }
}
