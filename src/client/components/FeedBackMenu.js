import React, { Component } from 'react'

import RaisedButton from 'material-ui/RaisedButton'

import {deepOrange500} from 'material-ui/styles/colors'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import injectTapEventPlugin from 'react-tap-event-plugin'

const style = {
  margin: 12
}

const muiTheme = getMuiTheme({
  palette: {
    accent1Color: deepOrange500
  }
})

export default class FeedbackMenu extends Component {

  constructor (props) {
    super(props)

    this.slowClick = this.slowClick.bind(this)
    this.fastClick = this.fastClick.bind(this)
  }

  slowClick () {
    const feedback = {'type': 'slow'}
    this.props.onClick(feedback)
  }

  fastClick () {
    const feedback = {'type': 'fast'}
    this.props.onClick(feedback)
  }

  render () {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div id='feedbackMenuBar'>
          <RaisedButton style={style} onTouchTap={this.slowClick} label='For tregt' />
          <RaisedButton style={style} onTouchTap={this.fastClick} label='For fort' />
        </div>
      </MuiThemeProvider>
    )
  }
}
