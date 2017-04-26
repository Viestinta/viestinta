import React from 'react'

import Paper from 'material-ui/Paper'
import IconMenu from 'material-ui/IconMenu'
import IconButton from 'material-ui/IconButton'
import MenuItem from 'material-ui/MenuItem'
import SocialPerson from 'material-ui/svg-icons/social/person'
import Toggle from 'material-ui/Toggle'

const styles = {
	header: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-end',

		height: '48px',
		width: '100%',
		padding: '0px 0px 0px 10px',
		marginBottom: '10px',

		backgroundColor: '#1565C0'
	},
	img: {
		maxHeight: '30px',
		marginBottom: '12px'
	},
	user: {
		display: 'flex',
    	flexDirection: 'row',
   		alignItems: 'flex-end',
		maxWidth: '35%'
	},
	text: {
		cursor: 'default',
		color: '#ffffff',
		fontSize: '16px',
		overflow: 'hidden',
		whiteSpace: 'nowrap',
		textOverflow: 'ellipsis',

		margin: '0px 0px 12px'
	}
};


const logo = (
	<img src="images/logo_shadow_white.png" alt="Viestintä Logo" style={styles.img}/>
)

export default class Header extends React.Component {
	render () {
		const rightMenu = (	
			<IconMenu
				iconButtonElement={<IconButton><SocialPerson color={'#ffffff'} /></IconButton>}
				anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
				targetOrigin={{horizontal: 'right', vertical: 'top'}}
			>	
				<MenuItem>
					<Toggle label="Foreleser" defaultToggled={this.props.isAdmin} onToggle={this.props.toggleAdmin}/>
				</MenuItem>
				<MenuItem
					primaryText="Logg ut"
					href="/logout"
					rightIcon={<img src="images/feide_32px.png" style={{width: '24px', height: 'auto'}}/>}
				/>
			</IconMenu>
		)
	    return (
			<Paper zDepth={0} rounded={false} style={styles.header}>
				<img src="images/logo_white_shadow.png" alt="Viestintä Logo" style={styles.img}/>
				<div style={styles.user}>
					<p style={styles.text}>{this.props.userName}</p>
					{rightMenu}
				</div>
			</Paper>
	    )
	}
}
