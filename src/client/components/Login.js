import React, {Component } from 'react'
import socket from '../socket'
import RaisedButton from 'material-ui/RaisedButton';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',

    maxWidth: '600px',
    width: '100%'
  },
  logo: {
    position: 'fixed',
    top: '10%',

    maxWidth: '600px',
    width: '100%',
    height: 'auto'
  },
  button: {
    position: 'fixed',
    top: '40%',

    marginTop: '10px'
  },
  img: {
    position: 'fixed',
    bottom: 0,

    maxWidth: '600px',
    width: '100%',
    height: 'auto'
  }
}

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
      <div style={styles.container}>
        <img src="images/logo_shadow.png" alt="Viestintä Logo" style={styles.logo}/>
        <RaisedButton
            style={styles.button}
            backgroundColor="#be1527"
            labelColor="#ffffff"
            href="/login"
            label="Logg inn"
            icon={<img src="images/feide_100px_white.png" style={{width: 20, height: 'auto'}}/>}
        />
        <img src="images/technologies.png" style={styles.img}/>
      </div>
    )
  }
}
