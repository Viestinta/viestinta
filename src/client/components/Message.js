import React from 'react'

export default class Message extends React.Component {
  render () {
    return (
      <div id='message'>
        ( {this.props.time }) - { this.props.text }
      </div>
    )
  }
}

Message.propTypes = {
  text: React.PropTypes.string
}
