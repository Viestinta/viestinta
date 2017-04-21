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

// TODO: not working
// renderLogin must be made to a component
describe('ChatApp', () => {
  it('should render Header, Login, MessageList, ChatBox and FeedbackBox', () => {
    const wrapper = shallow(<ChatApp />)
    
    expect(wrapper.containsAllMatchingElements([
      <Header />,
      <Login />,
      <MessageList />,
      <ChatBox />,
      <FeedbackBox />
    ])).to.equal(true)
  })
})


describe('MessageList', () => {
  it('should start with an empty list', () => {
    const wrapper = shallow(<MessageList />)
    expect(wrapper.state('messages')).to.eql([])
  })

  // TODO: not working, need to create a message object?
  /*
  it('adds items to the list', () => {
    const wrapper = shallow(<MessageList />)
    const messageWrapper = shallow(<Message text='Hello world' />)
    wrapper.instance().receiveMessage(messageWrapper)
    expect(wrapper.state('messages')).to.equal([messageWrapper])
  })
  */
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

  /*
  it('should accept input', () => {
    const wrapper = mount(<ChatBox />, {
      context: {muiTheme},
      childContextTypes: {muiTheme: React.PropTypes.object}
      }
    )
    const textField = wrapper.find(TextField)
    
    assert.isDefined(textField, 'textField is defined')
    assert.isNotNull(textField, 'textField is not null')
    textField.simulate('change', {target: { value: 'Changes in text' }})
    console.log("Wrapper:", wrapper.node)
    console.log("TextField:", textField.node)
    expect(wrapper.state('text')).to.equal('Changes in text')
    expect(textField.prop('value')).to.equal('Changes in text')
  })
  */

  it('should call sendMessage when Send is clicked', () => {
    const addItemSpy = spy()
    const wrapper = shallow(<ChatBox onTouchTap={addItemSpy} />, {muiTheme: getMuiTheme()})
    wrapper.setState({text: 'Octoberfest'})
    const sendButton = wrapper.find('RaisedButton')

    sendButton.simulate('click')

    expect(addItemSpy.calledOnce).to.equal(true)
    expect(addItemSpy.calledWith('Octoberfest')).to.equal(true)
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
/*
describe('FeedbackMenu', () => {
  it('should contain two buttons', () => {
    const wrapper = shallow(<FeedbackMenu />, {muiTheme: getMuiTheme()})
    console.log("Wrapper: ", wrapper)
    expect(wrapper.containsAllMatchingElements([
        shallow(<RaisedButton />, {muiTheme: getMuiTheme()}),
        shallow(<RaisedButton />, {muiTheme: getMuiTheme()})
    ])).to.equal(true)
  })
})
*/
/*
describe('FeedbackWindow', () => {
  it('should contain to p-tags to show feedback', () => {
    const wrapper = shallow(<FeedbackWindow />)
    const feedbackBox = shallow(<FeedbackBox />)
    expect(wrapper.containsAllMatchingElements([
      <p>0</p>,
      <p>0</p>
    ])).to.equal(true)
  })
})
*/