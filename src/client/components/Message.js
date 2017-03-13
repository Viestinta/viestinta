import React from 'react';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import ActionSchedule from 'material-ui/svg-icons/action/schedule';

const styles = {
	child: {
		minHeight: 'auto',
		width: '100%',

		padding: 10,
		margin: 5,
		textAlign: 'left',
	},
  time: {
    fontSize: '13px',
    lineHeight: '13px',
    height: '18px',
    textAlign: 'left',
  },
}

export default class Message extends React.Component {
  render () {
    return (
    	<Paper zDepth={3} style={styles.child}>
    		<h4>{this.props.text}</h4>
        <FlatButton 
          style={styles.time}
          label={<span style={{fontSize: '12px'}}>{this.props.time}</span>}
          disabled={true}
          icon={<ActionSchedule style={{width: '18px', height: '18px', margin: '0px'}}/>}
        />
    	</Paper>
    )
  }
}

Message.propTypes = {
  text: React.PropTypes.string
}
