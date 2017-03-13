import React from 'react';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import ActionSchedule from 'material-ui/svg-icons/action/schedule';
import {ListItem} from 'material-ui/List';

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

export default class Message extends React.Component {
  render () {
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
        />
    	</Paper>
    )
  }
}

Message.propTypes = {
  text: React.PropTypes.string
}
