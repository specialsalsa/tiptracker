import React, {useContext, useState, useEffect, useCallback} from 'react';
import {View, SafeAreaView, StyleSheet, PermissionsAndroid} from 'react-native';
import {Button, Switch, Text} from 'react-native-paper';
import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import {ToggleEnabledContext} from './App';
import OrderCard from './OrderCard';
import UpdateBanner from './UpdateBanner';
import CodePush from 'react-native-code-push';
import OnlineChip from './OnlineChip';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';

const Home = props => {
  const [serviceIsStarted, setServiceIsStarted] = useState(true);

  const [updateText, setUpdateText] = useState('');

  const [isConnected, setIsConnected] = useState(false);

  const [isChecking, setIsChecking] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    CodePush.getUpdateMetadata().then(update => {
      if (update.isFirstRun) {
        setUpdateText('tipTracker has been updated!');
      } else {
        setUpdateText('');
      }
    });
    setTimeout(() => {
      setUpdateText('');
    }, 10000);
  }, []);

  const handleDatabaseConnection = useCallback(async () => {
    try {
      const res = await fetch(
        'https://wildlyle.dev:8020/checkDatabaseConnection',
      );

      if (!res.ok) {
        throw new Error('Something went wrong');
      }

      const data = await res.json();

      if (data) {
        setIsConnected(data.isConnected);
      } else {
        setIsConnected(false);
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    navigation.addListener('focus', () => {
      handleDatabaseConnection();
    });
  }, [handleDatabaseConnection]);

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
      importance: 2,
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
          setServiceIsStarted(true);
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
          setServiceIsStarted(false);
          ReactNativeForegroundService.remove_task('taskid');
          ReactNativeForegroundService.stop();
        }}>
        Stop Foreground Service
      </Button>
    );
  };

  return (
    <>
      {Boolean(updateText) && <UpdateBanner />}

      <SafeAreaView style={styles.container}>
        <View style={styles.textContainer}>
          <Text variant="headlineMedium" style={styles.text}>
            Welcome to Tip Tracker!
          </Text>
        </View>

        <View style={styles.chipContainer}>
          <OnlineChip
            isConnected={isConnected}
            setIsConnected={setIsConnected}
            isChecking={isChecking}
          />
        </View>
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
              itemCount={order.itemCount}
              address={order.address}
            />
          ))}
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: 'black',
  },
  cardContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  toggleContainer: {
    padding: 10,
    paddingTop: 50,
    flexDirection: 'row',
    backgroundColor: 'black',
  },
  chipContainer: {
    padding: 10,
    flexDirection: 'row',
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
  textContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  smallText: {
    fontSize: 15,
  },
  switch: {
    color: 'white',
  },
});

export default Home;
