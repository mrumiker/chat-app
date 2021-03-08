import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';
import CustomActions from './CustomActions';
import { View, Platform, KeyboardAvoidingView, Alert } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import MapView from 'react-native-maps';

const firebase = require('firebase');
require('firebase/firestore');

export default class Chat extends Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      user: {
        _id: '',
        name: '',
        avatar: '',
      },
      isConnected: false,
      image: null,
      location: null,
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
  }

  componentDidMount() {
    let { name } = this.props.route.params; //This is in cDM() to prevent warning message
    this.props.navigation.setOptions({ title: name }); //This sets the screen title to the user's name

    NetInfo.fetch().then(connection => {
      if (connection.isConnected) {
        console.log('online');
        this.setState({
          isConnected: true,
        });
        this.referenceChatMessages = firebase.firestore().collection('messages'); //create reference to access messages collection

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
      } else {
        console.log('offline');
        this.setState({
          isConnected: false,
        });
        this.getMessages(); //if offline, get messages from async storage
        Alert.alert('You are offline');
      }
    });
    //this.deleteMessages();
  }

  componentWillUnmount() {
    if (!this.state.isConnected) {
    } else {
      this.authUnsubscribe(); //stop listening for changes
      this.unsubscribe();
    }
  }

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    querySnapshot.forEach((doc) => { //go through each doc
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
        image: data.image || null,
        location: data.location || null,
      });
    });
    this.setState({
      messages,
    });
  }

  addMessage = () => { //add new message to database
    const message = this.state.messages[0];
    this.referenceChatMessages.add({
      _id: message._id,
      text: message.text || '',
      createdAt: message.createdAt,
      user: message.user,
      image: message.image || '',
      location: message.location || null,
    });
  }

  async getMessages() { //get messages from async storage and save to state (offline use)
    let messages = '';
    try {
      messages = await AsyncStorage.getItem('messages') || [];
      this.setState({
        messages: JSON.parse(messages),
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  async saveMessages() { //save messages to async storage for offline viewing
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch (error) {
      console.log(error.message);
    }
  };

  async deleteMessages() { //delete messages from async storage (for dev purposes)
    try {
      await AsyncStorage.removeItem('messages');
      this.setState({
        messages: []
      })
    } catch (error) {
      console.log(error.message);
    }
  }

  onSend(messages = []) { // this is deployed whenever the user sends a new message
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages), //set new message to state
    }),
      () => {
        this.addMessage(), //new message added to database
          this.saveMessages() //save messages in async storage
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

  renderInputToolbar(props) { //text input is rendered only if connected 
    if (!this.state.isConnected) {
    } else {
      return (
        <InputToolbar
          {...props}
        />
      );
    }
  }

  renderCustomActions = (props) => { //"+" menu for special message options
    return <CustomActions {...props} />
  }

  renderCustomView = (props) => { // map view for sharing user location
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          showsUserLocation={true}
          style={{
            width: 150,
            height: 100,
            borderRadius: 13,
            margin: 3
          }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  }

  render() {
    let { color } = this.props.route.params; //Selected color from previous screen assigned to variable
    return (
      <View style={{ flex: 1, backgroundColor: color, }} /* Background color is applied here */>
        <GiftedChat
          messages={this.state.messages}
          isConnected={this.state.isConnected}
          onSend={messages => this.onSend(messages)}
          user={this.state.user}
          renderBubble={this.renderBubble.bind(this)}
          renderUsernameOnMessage={true}
          renderInputToolbar={props => this.renderInputToolbar(props)}
          renderActions={this.renderCustomActions} // handles "+" menu
          renderCustomView={this.renderCustomView} //handles map view, if there is one
        />
        { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /*Avoids keyboard glitch on Android*/ /> : null}
      </View>
    );
  }
}
