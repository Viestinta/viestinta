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

const UPDATE_INTERVAL = 5000*60 // 5 min

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
    this.makeFeedbackIntervals = this.makeFeedbackIntervals.bind(this)
  }

  componentDidMount () {
    var interval = setInterval(this.updateLineChartData, UPDATE_INTERVAL)
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

  updateLineChartData () {
    console.log('[FeedbackWindow] updateLineChartData()')
    var time = (new Date()).getTime()
    var value = (this.state.feedback[1] - this.state.feedback[0])
    var point = {
      x: (new Date()).getTime(),
      y: value
    }

    this.setState({
      feedback: [0, 0] 
    }, function(){
    })

    this.refs.lineChart.addPoint(point)
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

  /* 
    Group feedback elements in intervals
    of size = UPDATE_INTERVAL
  */
  makeFeedbackIntervals (feedbackList) {
    console.log('[FeedbackWindow] In makeF..Intervals()')
    var timeStep = UPDATE_INTERVAL,
        index = 0,
        timeIndex = (new Date(feedbackList[index].createdAt)).getTime(),
        timeLimit = (timeIndex + timeStep),
        dataset = [{x: timeIndex, y: 0}],
        feedbackTime

    for (var i = 0; i < feedbackList.length; i++){
      feedbackTime = (new Date(feedbackList[i].createdAt)).getTime()
      
      if ( feedbackTime < timeLimit){
        dataset[index].y += feedbackList[i].value
      } else {      
        do {
          timeIndex += timeStep
          timeLimit += timeStep
          index++
          dataset.push({x: timeIndex, y: 0})
        } while ( feedbackTime > timeLimit )
        
        dataset[index].y += feedbackList[i].value
      }
    }
    // Fill rest, until current time, with zero
    var now = (new Date()).getTime()
    timeLimit += timeStep
    while (timeLimit < now){
      dataset.push({x: timeLimit, y: 0})
      timeLimit += timeStep
    }

    console.log('[FeedbackWindow] dataset:')
    for (var i = 0; i < dataset.length; i++){
      console.log('[time, value]:', new Date(dataset[i].x), dataset[i].y)
    }

    return dataset
  }

  render () {
    return (
      <div style={styles.container}>
        <p>Antall som synes det går for tregt: {this.state.feedback[0]}</p>
        <p>Antall som synes det går for fort: {this.state.feedback[1]}</p>
        <LineChart ref='lineChart' container={'chart'} />
      </div>
    )
  }
}
