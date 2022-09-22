/**
 * @format
 */

import {AppRegistry, PermissionsAndroid} from 'react-native';
import React, {useEffect, createContext, useContext} from 'react';
import App from './App';
import {name as appName} from './app.json';
import {RNAndroidNotificationListenerHeadlessJsName} from 'react-native-android-notification-listener';
import {
  LocalNotification,
  TipLogNotification,
  TrackingNotification,
} from './LocalPushController';
import PushNotification from 'react-native-push-notification';
import axios from 'axios';
import Geolocation from 'react-native-geolocation-service';
import {isWithin50Meters} from './HelperFunctions';
import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import {GetStatus} from './components/GetStatus';

let addressLocation = {};

let address = '';
let addressRecorded = false;

PushNotification.configure({
  // (required) Called when a remote or local notification is opened or received
  onNotification: function (notification) {
    console.log('LOCAL NOTIFICATION ==>', notification);

    if (notification.id === '3') {
      PushNotification.cancelLocalNotification('3');
      addressRecorded = false;
    }
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
      case 'Cancel':
        addressRecorded = false;
        break;
    }

    if (notification.action !== 'Cancel') {
      axios.post('http://149.28.70.215:8020/setTipData', null, {
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

const watchPosition = () => {
  let locationId = Geolocation.watchPosition(
    position => {
      // const current = JSON.parse(position);
      // console.log(position.coords.latitude);

      if (
        isWithin50Meters(
          position.coords.latitude,
          // 32.7492457,
          addressLocation.addressLatitude,
          position.coords.longitude,
          // -117.01460062979753,
          addressLocation.addressLongitude,
        ) &&
        addressRecorded
      ) {
        addressRecorded = false;
        Geolocation.clearWatch(locationId);
        PushNotification.cancelLocalNotification('3');
        console.log('Welcome home');
        TipLogNotification(
          'How did this customer tip?',
          'Record this tip rating to see it again the next time you get an order for this address.',
        );
      }

      console.log(position.coords.latitude);
    },
    null,
    {
      distanceFilter: 5,
    },
  );
};

ReactNativeForegroundService.register();

GetStatus();

// ReactNativeForegroundService.update(() => '', {
//   delay: 10000,
//   onLoop: true,
//   taskId: '144',
//   onError: e => console.log(`Error logging:`, e),
// });

// Use these to stop and start the foreground service

// ReactNativeForegroundService.start({
//   id: 144,
//   title: 'Foreground Service',
//   message: 'Tracking location',
// });

// ReactNativeForegroundService.remove_task('144');
// ReactNativeForegroundService.stop();

// const headlessNotificationListener = async ({notification}) => {
//   if (notification) {
//     const parsedNoti = JSON.parse(notification);
//     if (parsedNoti.title == 'New Delivery!' && !addressRecorded) {
//       const regex = /(.*$)/;
//       address = parsedNoti.bigText.match(regex)[0];
//       // address = '8465 Broadway, Lemon Grove, CA 91945, USA';
//       console.log('made it');

//       axios
//         .get('http://149.28.70.215:8020/getTipData', {
//           params: {
//             address: address,
//           },
//         })
//         .then(response => {
//           if (response.data !== 'no match found') {
//             LocalNotification('Tip Alert!', response.data);
//           } else {
//             TipLogNotification(
//               'No Tip Data Found!',
//               'Rate the offer below. You can update it at drop-off if it surprises or disappoints!',
//             );
//           }
//         });
//     }
//     // if (parsedNoti.title === 'hi') {
//     //   if (notification.action === 'Yes') {
//     //     console.log('it worked');
//     //   }
//     // }
//     if (
//       parsedNoti.title == 'Delivery Update' &&
//       parsedNoti.text.match('Pickup from')
//     ) {
//       addressRecorded = true;
//       TrackingNotification();
//       console.log(addressRecorded);

//       axios
//         .get('https://nominatim.openstreetmap.org/search', {
//           params: {
//             q: address,
//             format: 'json',
//           },
//         })
//         .then(res => {
//           addressLocation.addressLatitude = res.data[0].lat;
//           addressLocation.addressLongitude = res.data[0].lon;
//           watchPosition();
//         });
//     }

//     if (
//       parsedNoti.title == 'Delivery Update' &&
//       parsedNoti.text.match('Drop off')
//     ) {
//       addressRecorded = false;
//     }
//   }

//   // address = '8465 Broadway, Lemon Grove, CA 91945, USA';
// };

import state from './state';
import {subscribeKey} from 'valtio/utils';

const headlessNotificationListener = async ({notification}) => {
  if (notification) {
    const parsedNoti = JSON.parse(notification);
    if (parsedNoti.title == 'New Delivery!' && !addressRecorded) {
      const regex = /(.*$)/;
      address = parsedNoti.bigText.match(regex)[0];
      // address = '8465 Broadway, Lemon Grove, CA 91945, USA';
      console.log('made it');

      axios
        .get('http://149.28.70.215:8020/getTipData', {
          params: {
            address: address,
          },
        })
        .then(response => {
          if (response.data !== 'no match found') {
            LocalNotification('Tip Alert!', response.data);
          } else {
            TipLogNotification(
              'No Tip Data Found!',
              'Rate the offer below. You can update it at drop-off if it surprises or disappoints!',
            );
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
      parsedNoti.text.match('Pickup from')
    ) {
      addressRecorded = true;
      TrackingNotification();
      console.log(addressRecorded);

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
          watchPosition();
        });
    }

    if (
      parsedNoti.title == 'Delivery Update' &&
      parsedNoti.text.match('Drop off')
    ) {
      addressRecorded = false;
    }
  }

  // address = '8465 Broadway, Lemon Grove, CA 91945, USA';
};

AppRegistry.registerHeadlessTask(
  RNAndroidNotificationListenerHeadlessJsName,
  () => headlessNotificationListener,
);

AppRegistry.registerComponent(appName, () => App);
