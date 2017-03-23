import React, { Component } from 'react'
import socket from '../socket'
import Drawer from 'material-ui/Drawer'
import RaisedButton from 'material-ui/RaisedButton'

import FeedbackMenu from './FeedbackMenu'
import FeedbackWindow from './FeedbackWindow'

const styles = {
  container: {
    width: '100%',
    maxWidth: '500px',

    marginTop: '10px'
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

  openFeedbackMenu () {
    this.setState({open: !this.state.open})
  }

  render () {
    return (
      <div style={styles.container}>
        <RaisedButton
          primary={true}
          label="Tilbakemelding"
          fullWidth={true}
          onTouchTap={this.openFeedbackMenu}
        />
        <Drawer
          docked={false}
          width={300}
          openSecondary={true}
          open={this.state.open}
          onRequestChange={(open) => this.setState({open})}
        >
          <FeedbackMenu onClick={this.onClick} />
          <FeedbackWindow
            slow={this.state.feedback[0]}
            fast={this.state.feedback[1]}
            updateFeedbackInterval={this.updateFeedbackInterval}
          />
        </Drawer>
      </div>
    )
  }
}
