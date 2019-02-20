import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MainComponent from './src/components/MainComponent';
import firebase from 'firebase';
import {config} from './src/utils/firebase.config';
export default class App extends React.Component {
  componentWillMount(){
    firebase.initializeApp(config);
  }
  render() {
    return (
      <MainComponent />
    );
  }
}
