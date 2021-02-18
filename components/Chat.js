import React, { Component } from 'react';
import { View, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';

export default class Chat extends Component {
  constructor() {
    super();
    this.state = {
      messages: [],
    }
  }
  componentDidMount() {
    let { name } = this.props.route.params; //This is in cDM() to prevent error message
    this.props.navigation.setOptions({ title: name }); //This sets the screen title to the user's name
    this.setState({                   //Set up initial message state
      messages: [
        {
          _id: 1,
          text: 'Hey you',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
        {
          _id: 2,                         //System Message
          text: 'This is a system message',
          createdAt: new Date(),
          system: true,
        },
      ]
    })
  }

  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages), //custom function to add new messages
    }));
  }

  render() {

    let { color } = this.props.route.params; //Selected color from previous screen assigned to variable

    return (
      <View style={{ flex: 1, backgroundColor: color, }} /* Background color is applied here */>
        <GiftedChat
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: 1,
          }}
        />
        { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /*Avoids keyboard glitch on Android*/ /> : null}
      </View>
    );
  }
}
