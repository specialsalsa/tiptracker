import React, {useState, createContext, useRef, useEffect} from 'react';
import {AppRegistry, useColorScheme} from 'react-native';
import {View, Text, StyleSheet} from 'react-native';
import {RNAndroidNotificationListenerHeadlessJsName} from 'react-native-android-notification-listener';
import {
  LocalNotification,
  TipLogNotification,
  TrackingNotification,
  UnlabeledTipLogNotification,
} from './LocalPushController';
import PushNotification from 'react-native-push-notification';
import axios from 'axios';
import Geolocation from 'react-native-geolocation-service';
import {
  getUserKey,
  isWithin50Meters,
  replaceWithAbbreviation,
} from './HelperFunctions';
import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import {GetStatus} from './components/GetStatus';
import {
  Provider as PaperProvider,
  MD3LightTheme as DefaultTheme,
  MD3DarkTheme as DarkTheme,
  Card,
  Title,
  Paragraph,
} from 'react-native-paper';

import CodePush from 'react-native-code-push';

import MyTabs from './Tabs';

export const ToggleEnabledContext = createContext();

const theme = {
  ...DarkTheme,
  dark: true,
  version: 3,
  mode: 'adaptive',
  colors: {
    ...DefaultTheme.colors,
    surface: 'black',
  },
};

let addressesArray = [];

const App = () => {
  const colorScheme = useColorScheme();

  // useEffect(() => {
  //   CodePush.sync({
  //     updateDialog: false,
  //     installMode: CodePush.InstallMode.IMMEDIATE,
  //   });
  // }, []);

  const [userKeyState, setUserKeyState] = useState('');

  useEffect(() => {
    const setKeyState = async () => {
      const userKey = await getUserKey();
      setUserKeyState(userKey);
    };

    setKeyState();
  }, []);

  const [toggleEnabled, setToggleEnabled] = useState(true);

  const [currentlyTracking, setCurrentlyTracking] = useState(false);

  let rating;

  const [address, setAddress] = useState('');

  const [addressesArrayState, setAddressesArrayState] = useState([]);

  const [completedOrders, setCompletedOrders] = useState([]);

  const onSetTipData = (addressesArray, tipRating) => {
    addressesArray.forEach(address => {
      addressRef.current = address.address;

      address.tipRating = tipRating;

      setCompletedOrders(addressesArray);

      addressesArray = addressesArray?.filter?.(
        order => order.key !== address.key,
      );
      setAddressesArrayState(addressesArray);
      if (!addressesArray) setCurrentlyTracking(false);
    });
  };

  const addressRef = useRef('');
  let restaurant;
  let itemCount;

  const state = {
    toggleEnabled,
    setToggleEnabled,
    rating,
    address,
    addressesArrayState,
    setAddressesArrayState,
    currentlyTracking,
    setCurrentlyTracking,
    userKeyState,
    completedOrders,
    onSetTipData,
  };

  let addressLocation = {};

  let notiSent = false;

  PushNotification.configure({
    // (required) Called when a remote or local notification is opened or received
    onNotification: function (notification) {
      console.log('LOCAL NOTIFICATION ==>', notification);

      if (notification.id === '3') {
        PushNotification.cancelLocalNotification('3');
      }
      if (notification.id === '4') {
        // PushNotification.cancelLocalNotification('4');
        notiSent = true;
      }
    },

    onAction: notification => {
      setCurrentlyTracking(false);

      switch (notification.action) {
        case 'Bad':
          rating = 'Bad Tipper';

          // onSetTipData(addressesArray, 'Bad Tipper');
          break;

        case 'Okay':
          rating = 'Okay Tipper';
          // onSetTipData(addressesArray, 'Okay Tipper');
          break;

        case 'Great':
          rating = 'Great Tipper';
          // onSetTipData(addressesArray, 'Great Tipper');
          break;
      }

      if (notification.action !== 'Cancel') {
        try {
          axios.post('https://wildlyle.dev:8020/setTipData', null, {
            params: {
              address: addressRef.current,
              tipRating: rating,
              userKey: userKeyState,
            },
          });
        } catch (error) {
          console.log(error);
        }
      }

      setAddress('');
    },

    popInitialNotification: true,
    requestPermissions: true,
  });

  setInterval(() => {
    PushNotification.getDeliveredNotifications(notifications => {
      if (notifications.some(noti => noti.identifier === '4')) {
        notiSent = true;
      } else {
        notiSent = false;
      }
    });
  }, 2000);

  const watchPosition = () => {
    addressesArray.forEach(address => {
      let locationId = Geolocation.watchPosition(
        position => {
          // const current = JSON.parse(position);

          if (
            isWithin50Meters(
              position.coords.latitude,
              // 32.7490512,
              address.addressLatitude,
              // 32.7490512,
              position.coords.longitude,
              // -117.01459,
              address.addressLongitude,
              // -117.0145966,
            )
          ) {
            Geolocation.clearWatch(locationId);
            // addressRef.current = address.address;

            // setCompletedOrders(addressesArray);

            // addressesArray = addressesArray?.filter?.(
            //   order => order.key !== address.key,
            // );
            // setAddressesArrayState(addressesArray);
            // if (!addressesArray) setCurrentlyTracking(false);
            PushNotification.cancelLocalNotification('3');
            console.log('Welcome home');
            TipLogNotification({key: address.key});
          }
        },
        null,
        {
          distanceFilter: 0,
        },
      );
    });
  };

  ReactNativeForegroundService.register();

  const notificationStatus = GetStatus();

  useEffect(() => {
    GetStatus();
  }, [notificationStatus]);

  useEffect(() => {
    const headlessNotificationListener = async ({notification}) => {
      if (notification) {
        const parsedNoti = JSON.parse(notification);
        if (parsedNoti.title == 'New Delivery!' && !currentlyTracking) {
          // PushNotification.cancelLocalNotification('4');
          const regex = /(.*$)/;
          // setAddress(() => parsedNoti.bigText.match(regex)[0]);
          addressRef.current = parsedNoti.bigText.match(regex)[0];

          addressRef.current = replaceWithAbbreviation(addressRef.current);

          restaurant = parsedNoti.bigText.replace('New Order: Go to ', '');
          restaurant = restaurant.match(/^(.*)$/m)[0];

          const itemRegex = /\d+(?= items?)/;

          itemCount = restaurant.match(itemRegex)[0];

          restaurant = restaurant.match(/(.+?)(?=·)/g)[0];

          console.log(restaurant);

          const addAddress = () => {
            addressesArray.unshift({
              key: Math.random().toString(),
              timestamp: Date.now(),
              active: false,
              itemCount: itemCount,
              restaurant: restaurant,
              address: addressRef.current,
              tipRating: rating || '',
            });

            if (addressesArray.length > 2) {
              addressesArray.pop();
            }

            if (addressesArray.length === 2) {
              if (
                addressesArray[0].timestamp - addressesArray[1].timestamp >
                  2000 ||
                addressesArray[0].address == addressesArray[1].address
              ) {
                addressesArray.pop();
              }
            }
            console.log(addressesArray);
          };

          addAddress();

          // address = '8465 Broadway, Lemon Grove, CA 91945, USA';

          axios
            .get('https://wildlyle.dev:8020/getTipData', {
              params: {
                address: addressRef.current,
              },
            })
            .then(response => {
              if (response.data !== 'no match found') {
                LocalNotification(
                  `${response.data.tipRating} Alert!`,
                  `${response.data.tipRating}\n${response.data.address}`,
                );
                PushNotification.getDeliveredNotifications(notifications => {
                  if (
                    notifications.filter(notification =>
                      notification.body?.match(`${response.data.address}`),
                    ).length > 1
                  ) {
                    PushNotification.cancelLocalNotification(
                      notifications.find(notification =>
                        notification.body?.match(`${response.data.address}`),
                      ).identifier,
                    );
                    console.log('made it');
                  }
                });
              } else if (toggleEnabled && !notiSent) {
                UnlabeledTipLogNotification();
                notiSent = true;
              }
            });
        }
        // if (parsedNoti.title === 'hi') {
        //   if (notification.action === 'Yes') {
        //     console.log('it worked');
        //   }
        // }
        if (
          parsedNoti.title == 'Delivery Update' &&
          parsedNoti.text.match('Pickup from') &&
          !currentlyTracking
        ) {
          TrackingNotification();
          setCurrentlyTracking(true);
          watchPosition();

          addressesArray.forEach(order => {
            axios
              .get('https://nominatim.openstreetmap.org/search', {
                params: {
                  q: order.address,
                  format: 'json',
                },
              })
              .then(res => {
                order.addressLatitude = res.data[0].lat;
                order.addressLongitude = res.data[0].lon;
              });
          });

          setAddressesArrayState(addressesArray);

          // axios
          //   .get('https://nominatim.openstreetmap.org/search', {
          //     params: {
          //       q: addressRef.current,
          //       format: 'json',
          //     },
          //   })
          //   .then(res => {
          //     addressLocation.addressLatitude = res.data[0].lat;
          //     addressLocation.addressLongitude = res.data[0].lon;
          //     console.log(addressLocation.addressLatitude);
          //   });
        }

        // if (
        //   parsedNoti.title == 'Delivery Update' &&
        //   parsedNoti.text.match('Drop off')
        // ) {
        // }
      }

      // address = '8465 Broadway, Lemon Grove, CA 91945, USA';
    };

    AppRegistry.registerHeadlessTask(
      RNAndroidNotificationListenerHeadlessJsName,
      () => headlessNotificationListener,
    );
  }, [
    addressRef.current,
    addressesArray,
    rating,
    restaurant,
    currentlyTracking,
    setCurrentlyTracking,
  ]);

  // askBackgroundPermission();

  //   <View style={styles.container}>
  //   <Text style={styles.titleText}>Welcome to Tip Tracker!</Text>
  // </View>

  return (
    <ToggleEnabledContext.Provider value={state}>
      <PaperProvider>
        <MyTabs onSetTipData={onSetTipData} />
      </PaperProvider>
    </ToggleEnabledContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 100,
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
  text: {
    // color: 'white',
  },
});

export default CodePush({
  checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,
  installMode: CodePush.InstallMode.IMMEDIATE,
})(App);
