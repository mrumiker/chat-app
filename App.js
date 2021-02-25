import React from 'react';
import Start from './components/Start';
import Chat from './components/Chat';
import 'react-native-gesture-handler'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack';
import { LogBox } from 'react-native';
import _ from 'lodash';

LogBox.ignoreWarnings(['Setting a timer']);
const _console = _.clone(console);
console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
}; //ignore warning about timer in Android

const Stack = createStackNavigator();

export default class App extends React.Component {

  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Start"
        >
          <Stack.Screen
            name="Start"
            component={Start}
          />
          <Stack.Screen
            name="Chat"
            component={Chat} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
