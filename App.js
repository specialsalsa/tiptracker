import React from 'react';
import {Text, StyleSheet} from 'react-native';
import {getStatus} from './components/GetStatus';
import {isWithin100Meters, askBackgroundPermission} from './HelperFunctions';

const App = () => {
  getStatus();

  askBackgroundPermission();

  //   <View style={styles.container}>
  //   <Text style={styles.titleText}>Welcome to Tip Tracker!</Text>
  // </View>

  return <Text>Hi, I'm Paul!</Text>;
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
