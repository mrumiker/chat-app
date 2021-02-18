import React, { Component } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ImageBackground } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

const image = require('../img/BackgroundImage.png');

export default class Start extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',       //establish state variables for user's name and chosen background color
      color: '',
    }
  }

  render() {
    return (
      <ImageBackground source={image} style={styles.image} /* background image */>
        <View style={styles.container}>
          <Text style={styles.title} /*App Title*/>TalkToFriends</Text>
          <View style={styles.inputContainer}>
            <TextInput                                    //User inputs name here
              style={styles.input}
              onChangeText={(name) => this.setState({ name })}
              value={this.state.name}
              placeholder='Your Name'
            />
            <Text style={styles.choose}>Choose Background Color:</Text>
            <View style={styles.colorsContainer} /*this contains the colored circles*/>
              <TouchableOpacity style={[styles.circle, styles.circ1]} onPress={() => this.setState({ color: styles.circ1.backgroundColor })} />
              <TouchableOpacity style={[styles.circle, styles.circ2]} onPress={() => this.setState({ color: styles.circ2.backgroundColor })} />
              <TouchableOpacity style={[styles.circle, styles.circ3]} onPress={() => this.setState({ color: styles.circ3.backgroundColor })} />
              <TouchableOpacity style={[styles.circle, styles.circ4]} onPress={() => this.setState({ color: styles.circ4.backgroundColor })} />
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={() => this.props.navigation.navigate('Chat', { name: this.state.name, color: this.state.color })} //Chat button takes user to next screen and passes name and color info
            >
              <Text style={styles.buttonText}>Start Chatting</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  title: {
    fontSize: 45,
    color: '#fff',
    fontWeight: '600',
    letterSpacing: 3,
  },
  inputContainer: {
    position: 'relative',
    marginHorizontal: 'auto',
    width: '88%',
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 40,
    width: '80%',
    padding: 10,
    borderColor: '#808080',
    borderWidth: 1,
    margin: 10,
  },
  choose: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    opacity: 50,
    margin: 10,
  },
  colorsContainer: {
    flexDirection: 'row',
    width: '92%',
    height: 70,
    marginVertical: 10,
    justifyContent: 'space-around',
  },
  circle: {
    flex: 1,      //dimensions for the four circles
    width: 70,
    borderRadius: 35,
  },
  circ1: {
    backgroundColor: '#090c08',
  },
  circ2: {
    backgroundColor: '#474056',
  },
  circ3: {
    backgroundColor: '#b9c6ae',
  },
  circ4: {
    backgroundColor: '#8a95a5',
  },
  button: {
    backgroundColor: '#757083',
    minWidth: '88%',
    padding: 15,
    alignItems: 'center',
    borderRadius: 35,
    marginTop: 25,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  }
});

