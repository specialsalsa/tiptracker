import React from 'react';
import {Text, View, Button, StyleSheet, PermissionsAndroid} from 'react-native';
import {LocalNotification} from './LocalPushController';
import {getStatus} from './components/GetStatus';
import {isWithinAHundredMeters} from './HelperFunctions';

const App = () => {
  getStatus();

  return (
    <View style={styles.container}>
      <Text>Welcome to Tip Tracker!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default App;
