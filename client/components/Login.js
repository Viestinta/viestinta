import React from 'react'

const Login = React.createClass({
  getInitialState() {
    return {
      // Empty username and password fields in the beginning
      username: '',
      password: ''
    }
  },

  render () {
    return (
      <div id='login'>
        <form action='/login'>
          <button type='btn btn-submit' value='Log In'>Log In</button>
        </form>		
      </div>
    )
  }
})

export default Login

