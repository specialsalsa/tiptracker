import React, {useEffect} from 'react';
import {
  Text,
  View,
  Button,
  StyleSheet,
  PermissionsAndroid,
  BackHandler,
} from 'react-native';

const TipLog = () => {
  return (
    <View style={styles.container}>
      <Text>This is where the tip log will go</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
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

export default TipLog;
