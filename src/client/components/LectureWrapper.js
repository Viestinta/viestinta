
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
                <MessageList />
                {/* Sidebar with feedback-options */}
                <FeedbackBox lecture={this.props.lecture}/>
                {/* Inputfield for user */}
                <ChatBox lecture={this.props.lecture}/>
            </div>
        )
    }
}
