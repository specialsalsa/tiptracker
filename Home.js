import React, {useContext, useState, useEffect, useCallback} from 'react';
import {View, StyleSheet, PermissionsAndroid, ScrollView} from 'react-native';
import {Button, Switch, Text, Card} from 'react-native-paper';
import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import {ToggleEnabledContext} from './App.js';
import OrderCard from './OrderCard';
import UpdateBanner from './UpdateBanner';
import UpdateSnackbar from './UpdateSnackbar';
import CodePush from 'react-native-code-push';
import OnlineChip from './OnlineChip';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import * as rssParser from 'react-native-rss-parser';
import RSSCard from './RSSCard';

const Home = props => {
  const [serviceIsStarted, setServiceIsStarted] = useState(true);

  const [updateText, setUpdateText] = useState('');

  const [isConnected, setIsConnected] = useState(false);

  const [snackbarContent, setSnackbarContent] = useState(
    "Nothing else matters when I'm with you",
  );

  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const [RSSOn, setRSSOn] = useState(true);

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
    rssOn,
    setRssOn,
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
      importance: 4,
    });
  }

  const handleNotiSwitch = () => {
    setToggleEnabled(!toggleEnabled);
  };

  let doTheThing = false;

  const handleRSSSwitch = () => {
    setRssOn(!rssOn);
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

  const RSSOnSwitch = () => {
    return (
      <Switch style={{flex: 1}} value={rssOn} onValueChange={handleRSSSwitch} />
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

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.textContainer}>
          <Text variant="headlineMedium" style={styles.text}>
            Welcome to Tip Tracker!
          </Text>
        </View>

        <View style={styles.chipContainer}>
          <OnlineChip
            isConnected={isConnected}
            setIsConnected={setIsConnected}
          />
        </View>
        {serviceIsStarted ? <StopButton /> : <StartButton />}
        <RSSCard rssOn={rssOn} />
        <View style={styles.toggleContainer}>
          <Text style={styles.smallText}>Unlabeled Offer Notifications</Text>
          <ToggleNotisSwitch />
        </View>

        <View style={styles.toggleContainer}>
          <Text style={styles.smallText}>RSS Notifications</Text>
          <RSSOnSwitch />
        </View>

        <View style={styles.cardContainer}>
          {addressesArrayState &&
            addressesArrayState.map(order => (
              <OrderCard
                key={order.key}
                id={order.key}
                restaurant={order.restaurant}
                itemCount={order.itemCount}
                address={order.address}
              />
            ))}
        </View>
        <View style={styles.snackbarContainer}>
          <UpdateSnackbar
            visible={snackbarVisible}
            setSnackbarVisible={setSnackbarVisible}
            snackbarContent={snackbarContent}
          />
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 15,
    // backgroundColor: 'black',
  },
  cardContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  toggleContainer: {
    padding: 10,
    paddingTop: 50,
    flexDirection: 'row',
    // backgroundColor: 'black',
  },
  chipContainer: {
    padding: 10,
    flexDirection: 'row',
    // backgroundColor: 'black',
  },
  snackbarContainer: {
    alignItems: 'center',
  },
  buttonContainer: {
    // marginTop: 20,
  },
  button: {
    // marginTop: 50,
  },
  text: {
    fontSize: 25,
    // color: 'white',
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
    // color: 'white',
  },
});

export default Home;
