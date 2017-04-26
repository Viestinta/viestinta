import React from 'react'
import socket from '../socket'

import Paper from 'material-ui/Paper'
import FlatButton from 'material-ui/FlatButton'
import ActionSchedule from 'material-ui/svg-icons/action/schedule'
import {ListItem} from 'material-ui/List'

import {grey400} from 'material-ui/styles/colors'
import {orange800} from 'material-ui/styles/colors'
import IconButton from 'material-ui/IconButton'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import ActionThumbsUpDown from 'material-ui/svg-icons/action/thumbs-up-down'
import ActionThumbUp from 'material-ui/svg-icons/action/thumb-up'
import ActionThumbDown from 'material-ui/svg-icons/action/thumb-down'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import Snackbar from 'material-ui/Snackbar'

const styles = {
	container: {
		minHeight: 'auto',
		width: '100%',

		padding: '0px',
		margin: '10px',
		textAlign: 'left',
	},
  listItem: {
    paddingTop: '20px',
    paddingSide: '10px',
    paddingBottom: '10px',

    borderRadius: '2px',
    overflowWrap: 'break-word',
    whiteSpace: 'pre-wrap'
  },
  timestamp: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  footer: {
    display: 'flex', 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',

    height: '24px',
    marginTop: '20px'
  }
}

const iconButtonVote = (
  <IconButton
    touch={true}
    tooltip="stem"
    tooltipPosition="bottom-left"
  >
    <ActionThumbsUpDown/>
  </IconButton>
);

const iconVoteUp = (
  <ActionThumbUp color={orange800} style={{margin: '12px'}}/>
);

const iconVoteDown = (
  <ActionThumbDown color={orange800} style={{margin: '12px'}}/> 
);

/* This icon is not yet in use */
// TODO: remove?
const iconButtonMore = (
  <IconButton
    touch={true}
    tooltip="mer"
    tooltipPosition="bottom-left"
  >
    <MoreVertIcon color={grey400} />
  </IconButton>
);

export default class Message extends React.Component {
  /**
   * @summary Save state and bind functions
   * @param {props} props - key, time, text, id, isAdmin and ref from MessageList.
   */
  constructor (props) {
    super(props)
    this.state = {
      voteEnabled: true,
      voteUp: true,
      open: false,
      actionInfo: '',
    }

    this.handleVoteUp = this.handleVoteUp.bind(this)
    this.handleVoteDown = this.handleVoteDown.bind(this)
    this.handleRequestClose = this.handleRequestClose.bind(this)
    this.sendVote = this.sendVote.bind(this)
  }

  /**
   * @summary Set state voteEnabled, voteUp, open and actionInfo and then calls sendVote.
   */
  handleVoteUp () {
    this.setState({
      voteEnabled: false,
      voteUp: true,
      open: true,
      actionInfo: 'Stemte melding opp.'
    })
    this.sendVote(1)
  }

  /**
   * @summary Set state voteEnabled, voteUp, open and actionInfo and then calls sendVote.
   */
  handleVoteDown () {
    this.setState({
      voteEnabled: false,
      voteUp: false,
      open: true,
      actionInfo: 'Stemte melding ned.'
    })
    this.sendVote(-1)
  }

  /**
   * @summary Emit id to message and value.
   * @param {value} value - -1 or 1
   */
  sendVote (value) {
    var msgId = this.props.id
    socket.emit('new-vote-on-message', msgId, value)
  }

  /**
   * @summary Set state open.
   */
  handleRequestClose () {
    this.setState({
      open: false
    })
  }

  render () {
    const timestamp = (
      <div style={styles.timestamp}>
        <ActionSchedule color={grey400} style={{width: '18px', height: '18px', marginRight: '2px'}}/>
        <p>{this.props.time}</p>
      </div>
    )
    const voteMenu = (
      <IconMenu iconButtonElement={iconButtonVote}>
        <MenuItem primaryText="Stem opp" rightIcon={<ActionThumbUp/>} onTouchTap={this.handleVoteUp} />
        <MenuItem primaryText="Stem ned" rightIcon={<ActionThumbDown/>} onTouchTap={this.handleVoteDown} />
      </IconMenu>
    )
    const footer = (
      <div style={styles.footer}>
        {timestamp}
        {this.state.voteEnabled ? voteMenu : (this.state.voteUp ? iconVoteUp : iconVoteDown)}
      </div>
    )
    const footerAdmin = (
      <div style={styles.footer}>
        {timestamp}
        <p>{this.props.userName}</p>
      </div>
    )
    /* This menu is not yet in use */
    const rightIconMenu = (
      <IconMenu iconButtonElement={iconButtonMore}>
        <MenuItem>Lagre</MenuItem>
        <MenuItem>Slett</MenuItem>
      </IconMenu>
    )
    return (
    	<Paper zDepth={3} style={styles.container}>
    		<ListItem
          style={styles.listItem}
          disabled={true}
          primaryText={this.props.text}
          secondaryText={this.props.isAdmin ? footerAdmin : footer}
        />
        <Snackbar
          style={{textAlign: 'center'}}
          open={this.state.open}
          message={this.state.actionInfo}
          autoHideDuration={2000}
          onRequestClose={this.handleRequestClose}
        />

      </Paper>
    )
  }
}

// Defines the proptypes it needs
Message.propTypes = {
  text: React.PropTypes.string
}
