import React, { Component } from 'react'

export default class FeedbackWindow extends Component {

  constructor (props) {
    super(props)
  }

  render () {
    return (
      <div id='feedbackWindow'>
        <p>Antall som synes det går for tregt: {this.props.slow}</p>
        <p>Antall som synes det går for fort: {this.props.fast}</p>
      </div>
    )
  }
}
