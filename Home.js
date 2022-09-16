import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {Button} from 'react-native-paper';
import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import {useState} from 'react';

const Home = () => {
  const [serviceIsStarted, setserviceIsStarted] = useState(false);

  const StartButton = () => {
    return (
      <Button
        icon="play"
        mode="outlined"
        onPress={() => {
          ReactNativeForegroundService.start({
            id: 144,
            title: 'Foreground Service',
            message: 'Tracking location',
          });
          setserviceIsStarted(true);
        }}>
        Start Foreground Service
      </Button>
    );
  };

  const StopButton = () => {
    return (
      <Button
        icon="stop"
        mode="outlined"
        onPress={() => {
          ReactNativeForegroundService.remove_task('144');
          ReactNativeForegroundService.stop();
          setserviceIsStarted(false);
        }}>
        Stop Foreground Service
      </Button>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to Tip Tracker!</Text>
      {serviceIsStarted ? <StopButton /> : <StartButton />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 100,
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
  text: {
    fontSize: 20,
    color: 'white',
  },
});

export default Home;
