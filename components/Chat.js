import React, { Component } from 'react';
import { View, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';

const firebase = require('firebase');
require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyC2LpmwWkeTS6Y5E0VPeChD4eWJEl-Bbc8",
  authDomain: "chat-app-8588d.firebaseapp.com",
  projectId: "chat-app-8588d",
  storageBucket: "chat-app-8588d.appspot.com",
  messagingSenderId: "921934364251",
  appId: "1:921934364251:web:89eae9e5e7b4e5c32a897e",
  measurementId: "G-2ZQBNYQ6G9",
}

export default class Chat extends Component {
  constructor() {
    super();
    this.state = {
      messages: [],
    }
    const firebaseConfig = {
      apiKey: "AIzaSyC2LpmwWkeTS6Y5E0VPeChD4eWJEl-Bbc8",
      authDomain: "chat-app-8588d.firebaseapp.com",
      projectId: "chat-app-8588d",
      storageBucket: "chat-app-8588d.appspot.com",
      messagingSenderId: "921934364251",
      appId: "1:921934364251:web:89eae9e5e7b4e5c32a897e",
      measurementId: "G-2ZQBNYQ6G9",
    }
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    this.referenceChatMessages = firebase.firestore().collection('messages');

  }
  componentDidMount() {
    let { name } = this.props.route.params; //This is in cDM() to prevent warning message
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
          _id: 2,                         //System Message announcing user has entered the chat
          text: `${name} has entered the chat`,
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

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#8a95a5', //set user's bubble color here
          }
        }}
      />
    )
  }

  render() {

    let { color } = this.props.route.params; //Selected color from previous screen assigned to variable

    return (
      <View style={{ flex: 1, backgroundColor: color, }} /* Background color is applied here */>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
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
