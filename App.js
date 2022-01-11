import React from 'react';
import {Text, View, Button, StyleSheet, PermissionsAndroid} from 'react-native';
import {LocalNotification} from './LocalPushController';
import {getStatus} from './components/GetStatus';
import {isWithin100Meters, askBackgroundPermission} from './HelperFunctions';
import {Actions, Router, Stack, Scene, Tabs} from 'react-native-router-flux';
import CustomTabBar from './CustomTabBar';
import Routes from './Routes';

import {NativeRouter, Route, Link, BackButton} from 'react-router-native';
import TipLog from './TipLog';

const App = () => {
  getStatus();

  askBackgroundPermission();

  //   <View style={styles.container}>
  //   <Text style={styles.titleText}>Welcome to Tip Tracker!</Text>
  // </View>

  return (
    // <View style={styles.container}>
    //   <Text style={styles.titleText}>Welcome to Tip Tracker!</Text>
    // </View>
    <Routes />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    marginTop: 20,
  },
  button: {
    marginTop: 50,
  },
  titleText: {
    fontSize: 20,
  },
});

export default App;
