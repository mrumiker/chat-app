import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { View, Platform, KeyboardAvoidingView, Alert } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';

const firebase = require('firebase');
require('firebase/firestore');

export default class Chat extends Component {
  constructor() {
    super();
    this.state = {
      uid: 0,
      messages: [],
      user: {
        _id: '',
        name: '',
        avatar: '',
      },
      isConnected: false,
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
    this.referenceChatMessages = firebase.firestore().collection('messages'); //create reference to access messages collection
  }

  componentDidMount() {
    let { name } = this.props.route.params; //This is in cDM() to prevent warning message
    this.props.navigation.setOptions({ title: name }); //This sets the screen title to the user's name
    this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        firebase.auth().signInAnonymously();
      }
      this.setState({
        user: {
          _id: user.uid,
          name,
          avatar: 'https://placeimg.com/140/140/any',
        },                  //Set up initial state
        messages: [],
      });
      this.unsubscribe = this.referenceChatMessages
        .orderBy("createdAt", "desc")
        .onSnapshot(this.onCollectionUpdate);
    });

    NetInfo.fetch().then(connection => {
      if (connection.isConnected) {
        console.log('online');
        this.setState({
          isConnected: true,
        });
      } else {
        console.log('offline'); //if offline, get messages from async storage
        this.getMessages();
        Alert.alert('You are offline  You may read your messages but cannot send new ones');
      }
    });
    //this.deleteMessages();
  }

  componentWillUnmount() {
    this.authUnsubscribe(); //stop listening for changes
    this.unsubscribe();
  }

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    //go through each doc
    querySnapshot.forEach((doc) => {
      //get the QuerySnapshot's data
      let data = doc.data();
      messages.push({     //get the messages from the database and send them to state
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: {
          _id: data.user._id,
          name: data.user.name,
          avatar: data.user.avatar,
        },
      });
    });
    this.setState({
      messages,
    });
  };

  addMessage = () => { //add new message to database
    const message = this.state.messages[0];
    this.referenceChatMessages.add({
      _id: message._id,
      text: message.text,
      createdAt: message.createdAt,
      user: message.user,
    });
  }

  async getMessages() {
    let messages = '';
    try {
      messages = await AsyncStorage.getItem('messages').then(((res) => console.log(res))) || [];
      this.setState({
        messages: JSON.parse(messages),
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  async saveMessages() {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch (error) {
      console.log(error.message);
    }
  };

  async deleteMessages() {
    try {
      await AsyncStorage.removeItem('messages');
      this.setState({
        messages: []
      })
    } catch (error) {
      console.log(error.message);
    }
  }

  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages), //set new message to state
    }),
      () => this.addMessage(), //new message added to database
      () => {
        this.saveMessages(); //save messages in async storahe
      });
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

  renderInputToolbar(props) {
    if (!this.state.isConnected) {
    } else {
      return (
        <InputToolbar
          {...props}
        />
      )
    }
  }

  render() {
    let { color } = this.props.route.params; //Selected color from previous screen assigned to variable
    return (
      <View style={{ flex: 1, backgroundColor: color, }} /* Background color is applied here */>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={this.state.user}
          renderUsernameOnMessage={true}
        />
        { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /*Avoids keyboard glitch on Android*/ /> : null}
      </View>
    );
  }
}
