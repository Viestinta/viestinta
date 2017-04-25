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
      feedback: [0, 0], // [numSlow, numFast]
      intervalId: undefined
    }

    this.getAllFeedback = this.getAllFeedback.bind(this)
    this.receiveFeedback = this.receiveFeedback.bind(this)
    this.updateLineChartData = this.updateLineChartData.bind(this)
  }

  componentDidMount () {
    // Increase every min
    var interval = setInterval(this.updateLineChartData, 5000)
    this.setState({intervalId: interval})
    socket.on('receive-feedback', this.receiveFeedback)
    socket.on('all-feedback', this.getAllFeedback)

    console.log("[FeedbackWindow] Component did mount.")
    
    
  }

  componentWillUnmount () {
    clearInterval(this.state.intervalId)
    console.log("[FeedbackWindow] Component will unmount.")

  }

  getAllFeedback (list) {
    console.log('[FeedbackWindow] getAllFeedback(), list:', list)
    var chartData = [{x: (new Date()).getTime(), y: 0}]

    if (list.length > 0){
      chartData = this.makeFeedbackIntervals(list)
    }

    this.refs.lineChart.setData(chartData)
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

  getAllVotesData () {
    var data = []
    var time = (new Date()).getTime()
    var i

    for (i = -5; i <= 0; i += 1) {
      data.push({
        x: time + i * 5000,
        y: Math.random() * 20 - 10
      })
    }
    console.log('[FeedbackWindow] getLineChartData()')
    return data
  }

  updateLineChartData () {
    var data = this.state.lineChartData
    var time = (new Date()).getTime()
    data.push({
      x: (new Date()).getTime(),
      y: Math.random() * 20 - 10
    })
    this.setState({lineChartData: data})
  }

  render () {
    return (
      <div style={styles.container}>
        <LineChart container={'chart'} data={this.state.lineChartData}/>
        <p>Antall som synes det går for tregt: {this.state.feedback[0]}</p>
        <p>Antall som synes det går for fort: {this.state.feedback[1]}</p>
      </div>
    )
  }
}
