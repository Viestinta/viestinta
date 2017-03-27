import React from 'react'

import AppBar from 'material-ui/AppBar'
import IconButton from 'material-ui/IconButton'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import NavigationMenu from 'material-ui/svg-icons/navigation/menu'

const styles = {
	img: {
		maxHeight: '40px'
	},
	appBar: {
		backgroundColor: '#1565C0'
	}
};

const logo = (
	<div>
		<img src="images/logo_shadow.png" alt="Viestintä Logo" style={styles.img}/>
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
		<MenuItem primaryText="Hjelp" />
		<MenuItem primaryText="Logg ut" rightIcon={<img src="images/feide_32px.png" style={{width: '24px', height: 'auto'}}/>}/>
	</IconMenu>
)

export default class Header extends React.Component {
	render () {
	    return (
	    	<AppBar 
	    		style={styles.appBar}
				iconElementLeft={logo}
				iconElementRight={rightMenu}
			/>
	    )
	}
}
