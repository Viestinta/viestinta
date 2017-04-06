
import React, { Component } from 'react'

// Components
import ChatBox from './ChatBox'
import MessageList from './MessageList'
import FeedbackBox from './FeedbackBox'

export default class LectureWrapper extends Component {

    constructor (props) {
        super (props)

        this.state = {
            courseCode: ''
        }
    }

    render() {
        return (
            <div>
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
