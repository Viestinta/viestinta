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
		textAlign: 'left'
	},
  listItem: {
    paddingTop: '20px',
    paddingSide: '10px',
    paddingBottom: '10px',

    borderRadius: '2px'
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
  constructor (props) {
    super(props)
    this.state = {
      text: '',
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

  handleVoteUp () {
    console.log('Voted: up')
    /* TODO: Send vote up to database*/
    this.setState({
      voteEnabled: false,
      voteUp: true,
      open: true,
      actionInfo: 'Stemte melding opp.'
    })
    console.log("voteValue in voteUp: ", this.state.voteValue)
    console.log("state in voteUp: ", this.state)
    this.sendVote(1)
  }

  handleVoteDown () {
    console.log('Voted: down')
    /* TODO: Send vote up to database*/
    
    this.setState({
      voteEnabled: false,
      voteup: false,
      open: true,
      actionInfo: 'Stemte melding ned.'
    })
    console.log("voteValue in voteDown: ", this.state.voteValue)
    console.log("state in voteDown: ", this.state)
    this.sendVote(-1)
  }

  sendVote (value) {
    var msgId = this.props.id
    console.log("Value in Message: ", value)
    socket.emit('new-vote-on-message', msgId, value)
  }

  handleRequestClose () {
    this.setState({
      open: false
    })
  }

  render () {
    const voteMenu = (
      <IconMenu iconButtonElement={iconButtonVote}>
        <MenuItem rightIcon={<ActionThumbUp/>} onTouchTap={this.handleVoteUp}>Stem opp</MenuItem>
        <MenuItem rightIcon={<ActionThumbDown/>} onTouchTap={this.handleVoteDown}>Stem ned</MenuItem>
      </IconMenu>
    )
    const footer = (
      <div style={styles.footer}>
        <ActionSchedule color={grey400} style={{width: '18px', height: '18px', marginRight: '2px'}}/>
        <p style={{flexBasis: '82%'}}>{this.props.time}</p>
        {this.state.voteEnabled ? voteMenu : (this.state.voteUp ? iconVoteUp : iconVoteDown)}
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
          primaryText={this.props.text}
          secondaryText={footer}
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
