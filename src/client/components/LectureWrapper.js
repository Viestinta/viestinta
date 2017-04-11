
import React, { Component } from 'react'

// Components
import ChatBox from './ChatBox'
import MessageList from './MessageList'
import FeedbackBox from './FeedbackBox'

const styles = {

  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',

    maxWidth: '910px',
    width: '100%',
    height: '100%',
  },
  chat: {
    maxWidth: '600px',
    width: '100%',
    height: '100%'
  }
};

export default class LectureWrapper extends Component {

    constructor (props) {
        super (props)

        this.state = {
            courseCode: ''
        }
    }

    render() {
        return (
            <div style={styles.container}>
                {/* List of messages */}
                <MessageList isAdmin={this.props.isAdmin}/>
                {/* Sidebar with feedback-options */}
                { !this.props.isAdmin ? <FeedbackBox lecture={this.props.lecture}/> : undefined }
                {/* Inputfield for user */}
                { !this.props.isAdmin ? <ChatBox lecture={this.props.lecture}/> : undefined }
            </div>
        )
    }
}
