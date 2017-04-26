import React, { Component } from 'react'
import ReactDOM from'react-dom'
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

    width: '100%',
    height: '100%',
  },
  parent: {
    marginTop: 10,
    paddingRight: 20,

    maxHeight: 563,
    width: '100%',
    height: '100%',

    overflowY: 'auto',
    minHeight: 0
  },
  child: {
    minHeight: 400,
    width: '100%',

    padding: 0,
    margin: 0,
    textAlign: 'left'
  }
};

export default class MessageList extends Component {
  /**
   * @summary Save state and bind functions
   * @param {props} props - lecture from LectureWrapper.
   */
  constructor (props) {
    super(props)
    this.state = {
      messages: [],
      selectedIndex: 0,
      sortByVotes: false
    }

    this.receiveMessage = this.receiveMessage.bind(this)
    this.getAllMessages = this.getAllMessages.bind(this)
    this.sortMessageList = this.sortMessageList.bind(this)
    this.sortListByTime = this.sortListByTime.bind(this)
    this.sortListByVotes = this.sortListByVotes.bind(this)
    this.getClock = this.getClock.bind(this)
    this.scrollToLast = this.scrollToLast.bind(this)
  }

  /**
   * @summary Set MessageList to listen to server events and scroll to last message.
   */
  componentDidMount () {
    socket.on('receive-message', this.receiveMessage)
    socket.on('all-messages', this.getAllMessages)
    socket.on('update-message-order', this.sortMessageList)

    // Scroll to last message
    this.scrollToLast();
  }

  /**
   * @summary Scroll to last message when component updates.
   */
  componentDidUpdate(prevProps, prevState) {
    this.scrollToLast();
  }

  /**
   * @summary Add message to list and sort message list.
   * @param {message} msg - Received message.
   */
  receiveMessage (msg) {
    // Copies the list
    var messages = this.state.messages.slice()

    // Adds the message
    messages.push(msg)

    this.sortMessageList(messages)
  }

  /**
   * @summary Set state messages to received messagelist
   * @param {list} msgList - List of messages.
   */
  getAllMessages (msgList) {
    this.setState({
      messages: msgList
    })
  }

  /**
   * @summary Calls sortListByVotes or sortListByTime based on state sortByVotes.
   * @param {list} list - List of messages to sort.
   */
  sortMessageList (list) {
    if (this.state.sortByVotes) {
      this.sortListByVotes(list)
    }
    else {
      this.sortListByTime(list)
    }
  }

  /**
   * @summary Sort list based on time and set state selectedIndex and messages
   * @param {list} list - List of messages to sort.
   */
  sortListByTime (list) {
    list.slice().sort( (a, b) => { return (( new Date(a.time) ) - ( new Date(b.time)) ) } )
    
    this.setState({
      selectedIndex: 0,
      messages: list
    })
  }

  /**
   * @summary Sort list based on votes and set state selectedIndex and messages
   * @param {list} list - List of messages to sort.
   */
  sortListByVotes (list) {
    list.slice().sort((a, b) => {
      return ((a.votesUp - a.votesDown) - (b.votesUp - b.votesDown))
    })

    this.setState({
      selectedIndex: 1,
      messages: list
    })
  }

  /**
   * @summary Get the time from a datestring.
   * @param {string} time - Date as string.
   * @return {string} Hour and min in format HH:mm.
   */
  getClock(time) {
    if(time.length > 5) {
      return time.substring(11, 16)
    }

    return time
  }

  /**
   * @summary Scroll to last message.
   */
  scrollToLast() {
    var len = this.state.messages.length - 1;
    const node = ReactDOM.findDOMNode(this['_div' + len])
    if (node) {
      node.scrollIntoView()
    }
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
          userName={message.userName}
          isAdmin={this.props.isAdmin}
          ref={(ref) => this['_div' + i] = ref}
        />
      )
    })

    var sortMenu = (
      <Paper zDepth={3} style={{width: '100%'}}>
        <BottomNavigation selectedIndex={this.state.selectedIndex}>
          <BottomNavigationItem
            label="Siste"
            icon={<ActionSchedule />}
            onTouchTap={() => this.sortListByTime(this.state.messages)}
          />
          <BottomNavigationItem
            label="Stemmer"
            icon={<ActionThumbsUpDown />}
            onTouchTap={() => this.sortListByVotes(this.state.messages)}
          />
        </BottomNavigation>
      </Paper>
    )

    return (
      <div style={styles.container}>
        <Paper zDepth={3} style={styles.parent}>
          <List style={styles.child}>
            {this.props.isAdmin ? list.reverse() : list}
          </List>
        </Paper>
        {this.props.isAdmin ? sortMenu : undefined}
      </div>
    )
  }

}