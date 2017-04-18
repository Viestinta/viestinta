import React from 'react'

import AppBar from 'material-ui/AppBar'
import IconButton from 'material-ui/IconButton'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import NavigationMenu from 'material-ui/svg-icons/navigation/menu'
import Toggle from 'material-ui/Toggle'

const styles = {
	img: {
		maxHeight: '26px'
	},
	text: {
		color: '#f8b133',
		margin: '2px'
	},
	appBar: {
		backgroundColor: '#1565C0'
	}
};



export default class Header extends React.Component {
	render () {
		const logoAndUser = (
			<div>
				<img src="images/logo_shadow.png" alt="Viestintä Logo" style={styles.img}/>
				<p style={styles.text}>{this.props.userName}</p>
			</div>
		)
		const rightMenu = (
			<IconMenu
				iconButtonElement={
				<IconButton iconStyle={{fill: '#F8B133'}}><NavigationMenu/></IconButton>
				}
				targetOrigin={{horizontal: 'right', vertical: 'top'}}
				anchorOrigin={{horizontal: 'right', vertical: 'top'}}
			>
				<MenuItem>
					<Toggle label="Foreleser" defaultToggled={this.props.isAdmin} onToggle={this.props.toggleAdmin}/>
				</MenuItem>
				<MenuItem primaryText="Logg ut"
					href="/logout"
					rightIcon={<img src="images/feide_32px.png"
									style={{width: '24px', height: 'auto'}}/>}/>

			</IconMenu>
		)
	    return (
	    	<AppBar 
	    		style={styles.appBar}
				iconElementLeft={logoAndUser}
				iconElementRight={rightMenu}
			/>
	    )
	}
}
