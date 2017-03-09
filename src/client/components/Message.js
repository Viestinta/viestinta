import React from 'react';
import Paper from 'material-ui/Paper';

const styles = {
	child: {
		minHeight: 'auto',
		width: '100%',

		padding: 10,
		margin: 5,
		textAlign: 'left',
	},
}

export default class Message extends React.Component {
  render () {
    return (
    	<Paper zDepth={3} style={styles.child}>
    		<h4>( {this.props.time }) - { this.props.text }</h4>
    	</Paper>
    )
  }
}

Message.propTypes = {
  text: React.PropTypes.string
}
