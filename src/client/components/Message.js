import React from 'react';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import ActionSchedule from 'material-ui/svg-icons/action/schedule';
import {ListItem} from 'material-ui/List';

import {grey400} from 'material-ui/styles/colors';
import {orange800} from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import ActionThumbsUpDown from 'material-ui/svg-icons/action/thumbs-up-down';
import ActionThumbUp from 'material-ui/svg-icons/action/thumb-up';
import ActionThumbDown from 'material-ui/svg-icons/action/thumb-down';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import Snackbar from 'material-ui/Snackbar';

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
  },
  footer: {
    display: 'flex', 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',

    height: '24px',
    marginTop: '20px',
  },
}

const iconButtonMore = (
  <IconButton
    touch={true}
    tooltip="mer"
    tooltipPosition="bottom-left"
  >
    <MoreVertIcon color={grey400} />
  </IconButton>
);

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
  }

  handleVoteUp () {
    console.log('Voted: up')
    /* TODO: Send vote up to database*/
    this.setState({
      voteEnabled: false,
      open: true,
      actionInfo: 'Stemte melding opp.'
    })
  }

  handleVoteDown () {
    console.log('Voted: down')
    /* TODO: Send vote up to database*/
    this.setState({
      voteEnabled: false,
      voteUp: false,
      open: true,
      actionInfo: 'Stemte melding ned.'
    })
  }

  handleRequestClose () {
    this.setState({
      open: false
    })
  }

  render () {
    const rightIconMenu = (
      <IconMenu iconButtonElement={iconButtonMore}>
        <MenuItem>Lagre</MenuItem>
        <MenuItem>Slett</MenuItem>
      </IconMenu>
    )
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
    return (
    	<Paper zDepth={3} style={styles.container}>
    		<ListItem
          style={styles.listItem}
          primaryText={this.props.text}
          secondaryText={footer}
          rightIconButton={rightIconMenu}
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

Message.propTypes = {
  text: React.PropTypes.string
}
