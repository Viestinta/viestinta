import React, { Component } from 'react'

import FeedbackMenu from './FeedbackMenu'
import FeedbackWindow from './FeedbackWindow'

export default class FeedbackBox extends Component {

  constructor (props) {
    super(props)
    this.state = {
			// [slow, fast]
      feedback: props.feedback
    }

    this.onClick = this.onClick.bind(this)
    this.updateFeedback = this.updateFeedback.bind(this)
  }

	// Receiving updated feedback values
  updateFeedback (feedback) {
    console.log('In updateFeedback')
    console.log('Slow in updateFeedback: ', feedback[0])

    console.log('Fast in updateFeedback: ', feedback[1])

    this.state.feedback = feedback
  }

  onClick (feedback) {
    console.log('In onClick')
    const feedbackList = this.state.feedback
    console.log('This.feedbackList: ', feedbackList)
    if (feedback.type === 'slow') {
      console.log('Slower please')
      feedbackList[0] = feedbackList[0] + 1
    } else if (feedback.type === 'fast') {
      console.log('Faster please')
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
        <FeedbackWindow slow={this.state.feedback[0]} fast={this.state.feedback[1]} />
      </div>
    )
  }
}
