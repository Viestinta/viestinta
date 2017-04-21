import React from 'react'

import Paper from 'material-ui/Paper'
import Popover from 'material-ui/Popover'
import Menu from 'material-ui/Menu'
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
		padding: '0px 10px',
		marginBottom: '10px',

		backgroundColor: '#1565C0'
	},
	img: {
		maxHeight: '30px',
		marginBottom: '12px'
	},
	text: {
		color: '#ffffff',
		overflow: 'hidden',
		whiteSpace: 'nowrap',
		textOverflow: 'ellipsis',
	}
};

const logo = (
	<img src="images/logo_shadow_white.png" alt="Viestintä Logo" style={styles.img}/>
)

export default class Header extends React.Component {
	constructor (props) {
		super(props)
		this.state = {
			open: false
		}

		this.handleTouchTap = this.handleTouchTap.bind(this)
		this.handleRequestClose = this.handleRequestClose.bind(this)
	}

	handleTouchTap (event) {
		event.preventDefault()
		this.setState({
			open: true,
			anchorEl: event.currentTarget
		})
	}

	handleRequestClose () {
		this.setState({
			open: false
		})
	}

	render () {
		const user = (
			<MenuItem 
				style={{margin: '0 -10px', maxWidth: '200px'}}
				primaryText={<div style={styles.text}>{this.props.userName}</div>} 
				rightIcon={<SocialPerson color={'#ffffff'} />} 
				onTouchTap={this.handleTouchTap}
			/>
		)
		const rightMenu = (
			<Popover
				open={this.state.open}
				anchorEl={this.state.anchorEl}
				anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
				targetOrigin={{horizontal: 'left', vertical: 'top'}}
				onRequestClose={this.handleRequestClose}
				style={{width: 'inherit'}}
			>	
				<Menu>
					<MenuItem>
						<Toggle label="Foreleser" defaultToggled={this.props.isAdmin} onToggle={this.props.toggleAdmin}/>
					</MenuItem>
					<MenuItem
						primaryText="Logg ut"
						href="/logout"
						rightIcon={<img src="images/feide_32px.png" style={{width: '24px', height: 'auto'}}/>}
					/>
				</Menu>
			</Popover>
		)
	    return (
			<Paper zDepth={0} rounded={false} style={styles.header}>
				<img src="images/logo_white_shadow.png" alt="Viestintä Logo" style={styles.img}/>
				<MenuItem 
					style={{margin: '0 -10px', maxWidth: '200px'}}
					primaryText={<div style={styles.text}>{this.props.userName}</div>} 
					rightIcon={<SocialPerson color={'#ffffff'} />} 
					onTouchTap={this.handleTouchTap}
				/>
				{rightMenu}
			</Paper>
	    )
	}
}
