import React, { Component } from 'react'
import socket from '../socket'
import Paper from 'material-ui/Paper'
import {List} from 'material-ui/List'
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation'
import ActionSchedule from 'material-ui/svg-icons/action/schedule'
import ActionThumbsUpDown from 'material-ui/svg-icons/action/thumbs-up-down'

import Message from './Message'

const styles = {

  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',

    maxWidth: 500,
    maxHeight: 400,
    width: '100%',
    height: '100%',
  },
  parent: {
    marginTop: 10,
    paddingRight: 20,

    width: '100%',
    height: '100%',

    overflowY: 'auto',
    minHeight: 0
  },
  child: {
    height: 500,
    width: '100%',

    padding: 0,
    margin: 0,
    textAlign: 'left'
  }
};

export default class MessageList extends Component {

  constructor (props) {
    super(props)
    this.state = {
      messages: [],
      selectedIndex: 0
    }

    this.receiveMessage = this.receiveMessage.bind(this)
    this.lastTenMessages = this.lastTenMessages.bind(this)
    this.sortTime = this.sortTime.bind(this)
    this.sortVotes = this.sortVotes.bind(this)
  }

  componentDidMount () {
    socket.on('receive-message', this.receiveMessage)
    socket.on('all-messages', this.getAllMessages)
    socket.on('update-message-order', this.sortMessageList)
  }

  receiveMessage (msg) {
    // Copies the list
    var messages = this.state.messages.slice()

    // Adds the message
    messages.push(msg)

    this.sortMessageList(messages)
    console.log("Messages in receiveMessage: ", this.state.messages)
  }

  getAllMessages (msgList) {
    this.setState({
      messages: msgList
    })
  }

  sortTime () {
    this.setState({
      selectedIndex: 0
    })
    /* TODO: Sort messages on time */
  }

  sortVotes () {
    this.setState({
      selectedIndex: 0
    })
    /* TODO: Sort messages on votes */
  }

  render () {

    var list = this.state.messages.map((message, i) => {
      var time = message.time
      time = this.getClock(time)

      return (
        <Message
          key={i}
          time={time}
          text={message.text}
          id={message.id}
        />
      )
    })

    var sortMenu = (
      <Paper zDepth={3} style={{width: '100%'}}>
        <BottomNavigation selectedIndex={this.state.selectedIndex}>
          <BottomNavigationItem
            label="Siste"
            icon={<ActionSchedule />}
            onTouchTap={this.sortTime}
          />
          <BottomNavigationItem
            label="Stemmer"
            icon={<ActionThumbsUpDown />}
            onTouchTap={this.sortVotes}
          />
        </BottomNavigation>
      </Paper>
    )

    return (
      <div style={styles.container}>
        <Paper zDepth={3} style={styles.parent}>
          <List style={styles.child}>
            {list}
          </List>
        </Paper>
        {this.props.isAdmin ? sortMenu : undefined}
      </div>
    )
  }

}