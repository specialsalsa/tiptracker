import React from 'react';
import {TouchableOpacity, Text} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {View, StyleSheet} from 'react-native';

const Home = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to Tip Tracker!</Text>
      <TouchableOpacity style={{margin: 128}} onPress={() => Actions.tiplog()}>
        <Text style={styles.text}>Tip Log</Text>
      </TouchableOpacity>
    </View>
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
  text: {
    fontSize: 20,
    color: 'black',
  },
});

export default Home;
