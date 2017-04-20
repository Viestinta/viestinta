
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
    alignItems: 'stretch',
    flexWrap: 'wrap',

    maxWidth: '960px',
    width: '100%',
    height: '100%',
  },
  chat: {
    maxWidth: '550px',
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
                <div style={styles.chat}>
                    {/* List of messages */}
                    <MessageList isAdmin={this.props.isAdmin}/>
                    {/* Inputfield for user */}
                    { !this.props.isAdmin ? <ChatBox lecture={this.props.lecture}/> : undefined }
                </div>
                <FeedbackBox lecture={this.props.lecture} isAdmin={this.props.isAdmin}/>
            </div>
        )
    }
}
