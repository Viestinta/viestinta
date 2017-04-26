import React, {Component } from 'react'
import socket from '../socket'
import RaisedButton from 'material-ui/RaisedButton'
import IconButton from 'material-ui/IconButton'

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',

    width: '100%'
  },
  logo: {
    position: 'fixed',
    top: '10px',

    maxWidth: '600px',
    width: '100%',
    height: 'auto'
  },
  button: {
    position: 'fixed',
    top: '40%',

    marginTop: '10px'
  },
  footer: {
    position: 'fixed',
    bottom: '0px',
    width: '100%',

    textAlign: 'center',

    paddingTop: '12px',
    paddingRight: '24px',
    paddingBottom: '12px',
    paddingLeft: '24px',

    backgroundColor: '#212121'
  },
  text: {
    margin: 'auto', 
    color: 'rgba(255, 255, 255, 0.541176)', 
    maxWidth: '356px'
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
            icon={<img src="images/feide_100px_white.png" style={{width: 20, height: 'auto', marginBottom: '3px'}}/>}
        />
        
        <div style={styles.footer}>
          <p style={styles.text}>
            Viestintä - Making communication and feedback easy.
          </p>
          <IconButton 
            //iconClassName="muidocs-icon-custom-github"
            //iconStyle={{color: 'rgba(255, 255, 255, 0.87)'}}
            href="https://github.com/Viestinta/viestinta" 
          >
            <img src="images/GitHub-Mark-Light-32px.png" width="24px" />
          </IconButton>
          <p style={styles.text}>
            <span className="copy-left">&copy;</span> &nbsp;
            <a href="https://github.com/Viestinta/viestinta/graphs/contributors" style={{color: 'rgba(255, 255, 255, 0.870588)'}}>The Viestintä Team</a> 
            &nbsp; 2017
          </p>
        </div>
      </div>
    )
  }
}
