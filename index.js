/**
 * @format
 */

import {Alert, AppRegistry, Linking, PermissionsAndroid} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import RNAndroidNotificationListener, {
  RNAndroidNotificationListenerHeadlessJsName,
} from 'react-native-android-notification-listener';
import {LocalNotification, TipLogNotification} from './LocalPushController';
import PushNotification from 'react-native-push-notification';
import axios from 'axios';
import Geolocation from 'react-native-geolocation-service';
import {isWithin100Meters, askBackgroundPermission} from './HelperFunctions';
import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import RNLocation from 'react-native-location';

let addressLocation = {};

let address = '';
let addressRecorded = false;

// askBackgroundPermission();

// Linking.openSettings();

PushNotification.configure({
  // (required) Called when a remote or local notification is opened or received
  onNotification: function (notification) {
    console.log('LOCAL NOTIFICATION ==>', notification);
  },

  onAction: notification => {
    let rating = '';
    switch (notification.action) {
      case 'Bad':
        rating = 'Bad Tipper';
        break;

      case 'Okay':
        rating = 'Okay Tipper';
        break;

      case 'Great':
        rating = 'Great Tipper';
        break;
    }

    if (notification.action) {
      axios.post('http://70.179.46.162:8020/setTipData', null, {
        params: {
          address: address,
          tipRating: rating,
        },
      });
    }

    address = '';
  },

  popInitialNotification: true,
  requestPermissions: true,
});

// LocalNotification('hi', 'hi');

// home coords: 32.74909824023569, -117.01460004260822

// let notiSent = false;

RNLocation.configure({
  distanceFilter: 0, // Meters
  desiredAccuracy: {
    ios: 'best',
    android: 'balancedPowerAccuracy',
  },
  // Android only
  androidProvider: 'auto',
  interval: 5000, // Milliseconds
  fastestInterval: 10000, // Milliseconds
  maxWaitTime: 5000, // Milliseconds
  // iOS Only
  activityType: 'other',
  allowsBackgroundLocationUpdates: false,
  headingFilter: 1, // Degrees
  headingOrientation: 'portrait',
  pausesLocationUpdatesAutomatically: false,
  showsBackgroundLocationIndicator: false,
});
let locationSubscription = null;
let locationTimeout = null;

ReactNativeForegroundService.add_task(
  () => {
    RNLocation.requestPermission({
      ios: 'whenInUse',
      android: {
        detail: 'fine',
      },
    }).then(granted => {
      console.log('Location Permissions: ', granted);
      // if has permissions try to obtain location with RN location
      if (granted) {
        locationSubscription && locationSubscription();

        locationSubscription = RNLocation.subscribeToLocationUpdates(
          ([locations]) => {
            locationSubscription();
            locationTimeout && clearTimeout(locationTimeout);
            console.log(locations);
          },
        );
      } else {
        locationSubscription && locationSubscription();
        locationTimeout && clearTimeout(locationTimeout);
        console.log('no permissions to obtain location');
      }
    });
  },
  {
    delay: 1000,
    onLoop: true,
    taskId: 'taskid',
    onError: e => console.log('Error logging:', e),
  },
);

let notiSent = false;

let locationId = Geolocation.watchPosition(
  position => {
    // const current = JSON.parse(position);
    // console.log(position.coords.latitude);

    if (
      !notiSent &&
      isWithin100Meters(
        position.coords.latitude,
        32.7492457,
        // addressLocation.addressLatitude,
        position.coords.longitude,
        -117.01460062979753,
        // addressLocation.addressLongitude,
      )
    ) {
      Geolocation.clearWatch(locationId);
      console.log('Welcome home');
      TipLogNotification();
      notiSent = true;
      addressRecorded = false;

      if (
        !isWithin100Meters(
          position.coords.latitude,
          // 32.74909824,
          addressLocation.addressLatitude,
          position.coords.longitude,
          // -117.01449932979753,
          addressLocation.addressLongitude,
        )
      ) {
        notiSent = false;
        address = '';
      }
    }

    console.log(position.coords.latitude);
  },
  null,
  {
    distanceFilter: 0,
  },
);

ReactNativeForegroundService.register();
AppRegistry.registerComponent(appName, () => App);

const countdown = () => {
  setInterval(() => {
    let counter = 0;
    counter++;
    console.log(counter);
  }, 10000);
};

ReactNativeForegroundService.add_task(() => '', {
  delay: 10000,
  onLoop: true,
  taskId: 144,
  onError: e => console.log(`Error logging:`, e),
});

ReactNativeForegroundService.update(() => '', {
  delay: 10000,
  onLoop: true,
  taskId: 144,
  onError: e => console.log(`Error logging:`, e),
});

ReactNativeForegroundService.start({
  id: 144,
  title: 'Foreground Service',
  message: 'Tracking location',
});

const headlessNotificationListener = async ({notification}) => {
  if (notification) {
    const parsedNoti = JSON.parse(notification);
    if (parsedNoti.title == 'New Delivery!' && !addressRecorded) {
      addressRecorded = true;

      const regex = /(.*$)/;
      address = parsedNoti.bigText.match(regex)[0];

      axios
        .get('https://nominatim.openstreetmap.org/search', {
          params: {
            q: address,
            format: 'json',
          },
        })
        .then(res => {
          addressLocation.addressLatitude = res.data[0].lat;
          addressLocation.addressLongitude = res.data[0].lon;
        });

      axios
        .get('http://70.179.46.162:8020/getTipData', {
          params: {
            address: address,
          },
        })
        .then(response => {
          if (response.data !== 'no match found') {
            LocalNotification('Tip Alert!', response.data);
          }
        });
    }
    // if (parsedNoti.title === 'hi') {
    //   if (notification.action === 'Yes') {
    //     console.log('it worked');
    //   }
    // }
  }
  // address = '8465 Broadway, Lemon Grove, CA 91945, USA';
};

AppRegistry.registerHeadlessTask(
  RNAndroidNotificationListenerHeadlessJsName,
  () => headlessNotificationListener,
);

AppRegistry.registerComponent(appName, () => App);
