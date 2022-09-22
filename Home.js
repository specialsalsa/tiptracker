import React, {useContext, useState} from 'react';
import {View, StyleSheet, Text, PermissionsAndroid} from 'react-native';
import {Button, Switch} from 'react-native-paper';
import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import {black} from 'react-native-paper/lib/typescript/styles/themes/v2/colors';
import state from './state';

import {subscribeKey} from 'valtio/utils';

const Home = () => {
  const [serviceIsStarted, setserviceIsStarted] = useState(false);

  let enabled;

  subscribeKey(state, 'enabled', v => {
    enabled = v;
  });

  const handleNotiSwitch = () => {
    state.enabled = !state.enabled;
  };
  const ToggleNotisSwitch = () => {
    return <Switch value={enabled} onValueChange={handleNotiSwitch} />;
  };

  const StartButton = () => {
    return (
      <Button
        icon="play"
        mode="outlined"
        onPress={() => {
          ReactNativeForegroundService.add_task(
            () => {
              PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
              );
            },
            {
              delay: 1000,
              onLoop: true,
              taskId: 'taskid',
              onError: e => console.log(`Error logging:`, e),
            },
          );
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
          ReactNativeForegroundService.remove_task('taskid');
          ReactNativeForegroundService.stop();
          setserviceIsStarted(false);
        }}>
        Stop Foreground Service
      </Button>
    );
  };

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.text}>Welcome to Tip Tracker!</Text>
        {serviceIsStarted ? <StopButton /> : <StartButton />}
      </View>
      <View style={styles.toggleContainer}>
        <Text style={styles.smallText}>
          Toggle Unlabeled Offer Notifications
        </Text>
        <ToggleNotisSwitch />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexShrink: 1,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  toggleContainer: {
    flex: 1,
    flexShrink: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  smallText: {
    fontSize: 15,
  },
  switch: {
    color: 'white',
  },
});

export default Home;
