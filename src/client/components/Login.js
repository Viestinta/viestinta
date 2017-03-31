import React, {Component } from 'react'
import socket from '../socket'
import RaisedButton from 'material-ui/RaisedButton';

export default class Login extends Component {
  
  constructor (props) {
    super(props)

    this.login = this.login.bind(this)
  }

  componentDidMount() {
    socket.on('login', this.login)
  }

  login () {
    socket.emit('login')
  }

  render () {
    return (
      <div>
        <RaisedButton
            style={{marginTop: '10px'}}
            backgroundColor="#be1527"
            labelColor="#ffffff"
            href="/login"
            label="Logg inn"
            icon={<img src="images/feide_100px_white.png" style={{width: 20, height: 'auto'}}/>}
        />
      </div>
    )
  }
}
