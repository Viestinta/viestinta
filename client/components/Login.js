import React from 'react'

export default class Login extends React.Component {
	render () {
		return (
			<div id='login'>
				<form action='/login'>
					<button type='btn btn-submit' value='Log In'/>
				</form>		
			</div>
		)
	}
}