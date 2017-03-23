import React from 'react'
import { expect } from 'chai'
import { shallow, mount } from 'enzyme'
import { spy } from 'sinon'

import { ChatApp, ChatBox, FeedbackBox, FeedbackMenu, FeedbackWindow, Header, Login, Message, MessageList } from '../client/components'

import Paper from 'material-ui/Paper'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'

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

  it('adds items to the list', () => {
    const wrapper = shallow(<MessageList />)
    const messageWrapper = shallow(<Message text='Hello world' />)
    wrapper.instance().receiveMessage(messageWrapper)
    expect(wrapper.state('messages')).to.eql([messageWrapper])
  })
})

describe('ChatBox', () => {
  it('should include a textfield and a button', () => {
    const wrapper = shallow(<ChatBox />)
    expect(wrapper.containsAllMatchingElements([
      <TextField />,
      <RaisedButton />
    ]))
  })

  it('should accept input', () => {
    const wrapper = mount(<ChatBox />)
    const textField = wrapper.find('TextField')
    textField.simulate('change', {target: { value: 'Changes in text' }})
    expect(wrapper.state('text')).to.equal('Changes in text')
    expect(textField.prop('value')).to.equal('Changes in text')
  })

  it('should call sendMessage when Send is clicked', () => {
    const addItemSpy = spy()
    const wrapper = shallow(<ChatBox onTouchTap={addItemSpy} />)
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
    ]))
  })

  it('passes onClick to FeedbackMenu', () => {
    const wrapper = shallow(<FeedbackBox />)
    const feedbackMenu = wrapper.find(FeedbackMenu)
    const onClick = wrapper.instance().onClick
    expect(feedbackMenu.prop('onClick')).to.eql(onClick)
  })

  it('passes slow, fast and updateFeedbackInterval to FeedbackWindow', () => {
    const wrapper = shallow(<FeedbackBox />)
    const feedbackWindow = wrapper.find(FeedbackWindow)

    const feedback = wrapper.instance().feedback
    expect(feedbackMenu.prop('slow')).to.eql(feedback[0])

    const feedback = wrapper.instance().feedback
    expect(feedbackMenu.prop('fast')).to.eql(feedback[1])

    const updateFeedbackInterval = wrapper.instance().updateFeedbackInterval
    expect(feedbackMenu.prop('updateFeedbackInterval')).to.eql(updateFeedbackInterval)
  })
})

describe('FeedbackMenu', () => {
	 it('should contain two buttons', () => {
   const wrapper = shallow(<FeedbackMenu />)
   expect(wrapper.containsAllMatchingElements([
     <RaisedButton />,
     <RaisedButton />
   ])).to.equal(true)
 })
})

describe('FeedbackWindow', () => {
	 it('should cointan to p-tags to show feedback', () => {
   const wrapper = shallow(<FeedbackWindow />)
   expect(wrapper.containsAllMatchingElements([
     <p />,
     <p />
   ])).to.equal(true)
 })
})
