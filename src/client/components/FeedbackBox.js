import React, { Component } from 'react'
import socket from '../socket'
import Paper from 'material-ui/Paper'

import FeedbackMenu from './FeedbackMenu'
import FeedbackWindow from './FeedbackWindow'

const styles = {
  container: { 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'flex-start', 
    justifyContent: 'flex-start', 

    maxWidth: '300px',
    width: '100%',

    marginTop: '10px',
    padding: '20px'
  }
}

export default class FeedbackBox extends Component {

  constructor (props) {
    super(props)
    this.state = {
			// [slow, fast]
      feedback: [0, 0],
      open: false
    }

    this.onClick = this.onClick.bind(this)
    this.updateFeedback = this.updateFeedback.bind(this)
    this.openFeedbackMenu = this.openFeedbackMenu.bind(this)
  }

	// Receiving updated feedback values
  updateFeedback (feedback) {
    console.log('[FeedbackBox] In updateFeedback:', feedback)

    this.state.feedback = feedback
  }

  updateFeedbackInterval () {
    console.log('[FeedbackBox] In updateFeedbackInterval')
  }

  onClick (feedback) {
    console.log('[FeedbackBox] In onClick')
    if (feedback.type === 'slow') {
      feedbackList[0] = feedbackList[0] + 1
    } else if (feedback.type === 'fast') {
      feedbackList[1] = feedbackList[1] + 1
    } else {
      console.log('[FeedbackBox] No valid type for buttonClick')
    }
    this.setState({feedback: feedbackList})
    this.props.sendFeedback(feedback)
  }

  openFeedbackMenu () {
    this.setState({open: !this.state.open})
  }

  render () {
    return (
      <Paper style={styles.container}>
        {this.props.isAdmin ? 
          <FeedbackWindow 
            slow={this.state.feedback[0]} 
            fast={this.state.feedback[1]} 
            updateFeedbackInterval={this.updateFeedbackInterval}
            lecture={this.props.lecture} 
          /> 
          : <FeedbackMenu onClick={this.onClick} lecture={this.props.lecture}/> 
        }
      </Paper>
    )
  }
}
