import React from 'react'

export default class Login extends React.Component {

	getInitialState() {
		return {
			// Empty username and password fields in the beginning
			username: '',
			password: ''
		}
	},

	// Run when submit is pushed
	logIn () {
		console.log('Login')

		var loginInfo = {
			user: this.props.username,
			password: this.props.password
		}

		// TODO: validate username and password

		// TODO: login

		// TODO: redirect to ChatBox
	},

	render () {
		return (
			<div id='login'>
				<form onSubmit={this.LogIn}>
					<input
						value={this.state.username}
					/>
					<input
						value={this.state.password}
					/>
					<button type='btn btn-submit'>
				</form>		
			</div>
		)
	}
}
