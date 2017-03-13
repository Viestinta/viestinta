import React from 'react'

const styles = {

  	parent: {
	    display: 'flex',
	    flexDirection: 'column',
	    alignItems: 'center',

	    maxWidth:   500,
	    width:      'auto',
	    height:     'auto',
  	},

	img: {
		width: '100%',
	},
};

export default class Header extends React.Component {
	render () {
	    return (
	      	<header style={styles.parent}>
	      		<img src="images/logo_shadow.png" alt="Viestintä Logo" 
	      		style={styles.img} />
	      	</header>
	    )
	}
}
