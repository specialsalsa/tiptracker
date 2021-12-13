/**
 * @format
 */

import {Alert, AppRegistry, PermissionsAndroid} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import RNAndroidNotificationListener, {
  RNAndroidNotificationListenerHeadlessJsName,
} from 'react-native-android-notification-listener';
import {LocalNotification, TipLogNotification} from './LocalPushController';
import PushNotification from 'react-native-push-notification';
import axios from 'axios';
import Geolocation from 'react-native-geolocation-service';
import {isWithinAHundredMeters} from './HelperFunctions';

const askBackgroundPermission = async () => {
  await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
  );
};

let addressLocation = {};
let address = '';
let addressRecorded = false;

askBackgroundPermission();

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

      case 'Good':
        rating = 'Good Tipper';
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

let notiSent = false;

if (address) {
  Geolocation.watchPosition(
    position => {
      // const current = JSON.parse(position);
      // console.log(position.coords.latitude);

      if (
        isWithinAHundredMeters(
          position.coords.latitude,
          // 32.74909824,
          addressLocation.addressLatitude,
          position.coords.longitude,
          // -117.01449932979753,
          addressLocation.addressLongitude,
        ) &&
        !notiSent
      ) {
        // console.log('Welcome home');
        TipLogNotification();
        notiSent = true;
        addressRecorded = false;

        if (
          !isWithinAHundredMeters(
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
    },
    null,
    {
      distanceFilter: 0,
    },
  );
}

const headlessNotificationListener = async ({notification}) => {
  if (notification) {
    const parsedNoti = JSON.parse(notification);
    if (parsedNoti.title == 'New Delivery!' && !addressRecorded) {
      addressRecorded = true;
      // if (parsedNoti.title == '(303) 578-8650') {
      // arrayOfNotisText.push(parsedNoti.text);
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
};

AppRegistry.registerHeadlessTask(
  RNAndroidNotificationListenerHeadlessJsName,
  () => headlessNotificationListener,
);

AppRegistry.registerComponent(appName, () => App);
