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
  time: {
    fontSize: '13px',
    lineHeight: '13px',
    height: '18px',
    textAlign: 'left',
    marginTop: '20px',
  },
}

const iconButtonElement = (
  <IconButton
    touch={true}
    tooltip="stem"
    tooltipPosition="bottom-left"
  >
    <ActionThumbsUpDown color={grey400} />
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
    const timestamp = (
      <FlatButton 
        style={styles.time}
        label={<span style={{fontSize: '12px'}}>{this.props.time}</span>}
        disabled={true}
        icon={<ActionSchedule style={{width: '18px', height: '18px', margin: '0px'}}/>}
      />
    )
    return (
    	<Paper zDepth={3} style={styles.container}>
    		<ListItem
          style={styles.listItem}
          primaryText={this.props.text}
          secondaryText={timestamp}
          rightIconButton={rightIconMenu}
        />
    	</Paper>
    )
  }
}

Message.propTypes = {
  text: React.PropTypes.string
}
