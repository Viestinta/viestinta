import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';

const Login = React.createClass({
  getInitialState () {
    return {
      // Empty username and password fields in the beginning
      username: '',
      password: ''
    }
  },

  render () {
    return (
      <div>
        <RaisedButton
            backgroundColor="#be1527"
            labelColor="#ffffff"
            href="/login"
            label="Logg inn"
            icon={<img src="images/feide_100px_white.png" style={{width: 20, height: 'auto'}}/>}
        />
      </div>
    )
  }
})

export default Login
