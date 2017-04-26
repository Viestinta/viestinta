import React, { Component } from 'react'
import socket from '../socket'
import Paper from 'material-ui/Paper'

import FeedbackMenu from './FeedbackMenu'
import FeedbackWindow from './FeedbackWindow'

const styles = {
  container: { 
    maxWidth: '400px',
    width: '100%',

    marginTop: '10px',
    padding: '10px'
  }
}

export default class FeedbackBox extends Component {

  render () {
    return (
      <Paper zDepth={3} style={styles.container}>
        { this.props.isAdmin ? <FeedbackWindow /> : <FeedbackMenu lecture={this.props.lecture} /> }
      </Paper>
    )
  }
}
