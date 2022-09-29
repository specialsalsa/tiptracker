import React, {useContext, useState} from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  Text,
  PermissionsAndroid,
} from 'react-native';
import {Button, Switch} from 'react-native-paper';
import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import {ToggleEnabledContext} from './App';
import OrderCard from './OrderCard';

const Home = () => {
  const [serviceIsStarted, setserviceIsStarted] = useState(true);

  const {
    toggleEnabled,
    setToggleEnabled,
    currentlyTracking,
    addressesArrayState,
  } = useContext(ToggleEnabledContext);

  if (serviceIsStarted) {
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
  }

  const handleNotiSwitch = () => {
    setToggleEnabled(!toggleEnabled);
  };
  const ToggleNotisSwitch = () => {
    return (
      <Switch
        style={{flex: 1}}
        value={toggleEnabled}
        onValueChange={handleNotiSwitch}
      />
    );
  };

  const StartButton = () => {
    return (
      <Button
        icon="play"
        mode="outlined"
        onPress={() => {
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
          setserviceIsStarted(false);
          ReactNativeForegroundService.remove_task('taskid');
          ReactNativeForegroundService.stop();
        }}>
        Stop Foreground Service
      </Button>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text} variant="headlineMedium">
        Welcome to Tip Tracker!
      </Text>
      {serviceIsStarted ? <StopButton /> : <StartButton />}
      <View style={styles.toggleContainer}>
        <Text style={styles.smallText}>Unlabeled Offer Notifications</Text>
        <ToggleNotisSwitch />
      </View>
      <View style={styles.cardContainer}>
        {addressesArrayState?.map?.(order => (
          <OrderCard
            key={order.key}
            id={order.key}
            restaurant={order.restaurant}
            address={order.address}
          />
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // flexShrink: 1,
    // height: 20,
    alignItems: 'center',
    // justifyContent: 'center',
    padding: 15,
    backgroundColor: 'black',
  },
  cardContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  toggleContainer: {
    // flex: 1,
    padding: 10,
    paddingTop: 50,
    flexDirection: 'row',
    // flexShrink: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: 'black',
  },
  buttonContainer: {
    // marginTop: 20,
  },
  button: {
    // marginTop: 50,
  },
  text: {
    fontSize: 25,
    color: 'white',
    paddingBottom: 15,
  },
  smallText: {
    fontSize: 15,
  },
  switch: {
    color: 'white',
  },
});

export default Home;
