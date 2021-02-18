import React, { Component } from 'react';
import { View, Text } from 'react-native';

export default class Chat extends Component {

  componentDidMount() {
    let { name } = this.props.route.params; //This is in cDM() to prevent error message
    this.props.navigation.setOptions({ title: name }); //This sets the screen title to the user's name
  }

  render() {

    let { color } = this.props.route.params; //Selected color from previous screen assigned to variable

    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: color }} /* background color is appied here */>
        <Text style={{ color: '#fff', fontSize: 50, fontWeight: '600', letterSpacing: 3 }} /* TODO: Chat functionality */>Chat</Text>
      </View>
    );
  }
}
