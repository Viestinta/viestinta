/*
import ChatApp from '../../client/components/ChatApp'
import ChatBox from '../../client/components/ChatBox'
import FeedbackBox from '../../client/components/FeedbackBox'
import FeedbackMenu from '../../client/components/FeedbackMenu'
import FeedbackWindow from '../../client/components/FeedbackWindow'
import Header from '../../client/components/Header'
import Login from '../../client/components/Login'
import Message from '../../client/components/Message'
import MessageList from '../../client/components/MessageList'

import Paper from 'material-ui/Paper'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'

import {orange800} from 'material-ui/styles/colors'
import {blue500} from 'material-ui/styles/colors'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

// To mock up a socket
const mockServer = new Server('http://127.0.0.1:8080')

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: orange800,
    accent1Color:  blue500
  }
})

describe('MessageList', () => {
  it('should start with an empty list', () => {
    const wrapper = shallow(<MessageList />)
    expect(wrapper.state('messages')).to.eql([])
  })

})

describe('ChatBox', () => {

  it('should include a textfield and a button', () => {
    const wrapper = shallow(<ChatBox />, {muiTheme: getMuiTheme()})

    expect(wrapper.containsAllMatchingElements([
      <MuiThemeProvider muiTheme={muiTheme}>
        shallow(<TextField />),
        shallow(<RaisedButton />)
      </MuiThemeProvider>
    ]))
  })

  it('passes sendMessage to RaisedButton', () => {
    const wrapper = shallow(<ChatBox />, {muiTheme: getMuiTheme()})
    const raisedButton = wrapper.find('RaisedButton')
    const sendMessage = wrapper.instance().sendMessage
    expect(raisedButton.prop('onTouchTap')).to.eql(sendMessage)
  })

  it('passes changeHandler to TextField', () => {
    const wrapper = shallow(<ChatBox />, {muiTheme: getMuiTheme()})
    const textField = wrapper.find('TextField')
    const changeHandler = wrapper.instance().changeHandler
    expect(textField.prop('onChange')).to.eql(changeHandler)
  })

})

describe('FeedbackBox', () => {
  it('should render FeedbackBox', () => {
    const wrapper = shallow(<FeedbackBox />)
    expect(wrapper.containsAllMatchingElements([
      <FeedbackMenu />,
      <FeedbackWindow />
    ])).to.equal(true)
  })

  it('passes onClick to FeedbackMenu', () => {
    const wrapper = shallow(<FeedbackBox />)
    const feedbackMenu = wrapper.find(FeedbackMenu)
    const onClick = wrapper.instance().onClick
    expect(feedbackMenu.prop('onClick')).to.eql(onClick)
  })

  it('passes slow, fast and updateFeedbackInterval to FeedbackWindow', () => {
    const wrapper = shallow(<FeedbackBox />)
    const feedbackMenu = wrapper.find(FeedbackMenu)
    const feedbackWindow = wrapper.find(FeedbackWindow)

    const feedback = wrapper.state('feedback')
    expect(feedbackWindow.prop('slow')).to.equal(feedback[0])
    expect(feedbackWindow.prop('fast')).to.equal(feedback[1])

    const updateFeedbackInterval = wrapper.instance().updateFeedbackInterval
    expect(feedbackWindow.prop('updateFeedbackInterval')).to.equal(updateFeedbackInterval)
  })

})

*/
