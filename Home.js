import React from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {withSafeAreaInsets} from 'react-native-safe-area-context';

const Home = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to Tip Tracker!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 100,
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
    color: 'white',
  },
});

export default Home;
