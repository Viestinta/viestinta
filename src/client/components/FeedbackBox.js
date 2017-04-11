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
  render () {
    return (
      <Paper zDepth={3} style={styles.container}>
        { this.props.isAdmin ? <FeedbackWindow /> : <FeedbackMenu lecture={this.props.lecture} /> }
      </Paper>
    )
  }
}
