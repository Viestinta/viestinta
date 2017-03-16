import React from 'react';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import ActionSchedule from 'material-ui/svg-icons/action/schedule';
import {ListItem} from 'material-ui/List';

import {grey400} from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import ActionThumbsUpDown from 'material-ui/svg-icons/action/thumbs-up-down';
import ActionThumbUp from 'material-ui/svg-icons/action/thumb-up';
import ActionThumbDown from 'material-ui/svg-icons/action/thumb-down';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';

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
    justifyContent: 'flex-start', 
    alignItems: 'center',

    height: '24px',
    marginTop: '20px',
  },
}

const iconButtonElement = (
const iconButtonVote = (
  <IconButton
    touch={true}
    tooltip="stem"
    tooltipPosition="bottom-left"
  >
    <ActionThumbsUpDown/>
  </IconButton>
);


export default class Message extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      text: '',
      voteEnabled: true
    }

    this.voteUp = this.voteUp.bind(this)
    this.voteDown = this.voteDown.bind(this)
  }

  voteUp () {
    console.log('Voted: up')
    this.setState({
      voteEnabled: false
    })
  }

  voteDown () {
    console.log('Voted: down')
    this.setState({
      voteEnabled: false
    })
  }

  render () {
    const rightIconMenu = (
      <IconMenu iconButtonElement={iconButtonElement}>
        <MenuItem rightIcon={<ActionThumbUp/>} onTouchTap={this.voteUp}>Stem opp</MenuItem>
        <MenuItem rightIcon={<ActionThumbDown/>} onTouchTap={this.voteDown}>Stem ned</MenuItem>
      </IconMenu>
    )
    const voteMenu = (
      <IconMenu iconButtonElement={iconButtonVote} style={{selfAlign: 'flex-end'}}>
        <MenuItem rightIcon={<ActionThumbUp/>} onTouchTap={this.handleVoteUp}>Stem opp</MenuItem>
        <MenuItem rightIcon={<ActionThumbDown/>} onTouchTap={this.handleVoteDown}>Stem ned</MenuItem>
      </IconMenu>
    )
    const footer = (
      <div style={styles.footer}>
        <ActionSchedule color={grey400} style={{width: '18px', height: '18px', marginRight: '2px'}}/>
        <p>{this.props.time}</p>
        {voteMenu}
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
    	</Paper>
    )
  }
}

Message.propTypes = {
  text: React.PropTypes.string
}
