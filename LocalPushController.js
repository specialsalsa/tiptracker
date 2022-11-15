import React, {Component} from 'react';
import PushNotification from 'react-native-push-notification';
import axios from 'axios';

// PushNotification.configure({
//   // (required) Called when a remote or local notification is opened or received
//   onNotification: function (notification) {
//     console.log('LOCAL NOTIFICATION ==>', notification);
//   },

//   onAction: notification => {
//     if (notification.action === 'Yes') {
//       console.log('its working');
//     }
//   },

//   popInitialNotification: true,
//   requestPermissions: true,
// });

PushNotification.createChannel(
  {
    channelId: '1', // (required)
    channelName: 'Tip notifications', // (required)
    channelDescription: 'Receive notifications from the tip server', // (optional) default: undefined.
    playSound: true, // (optional) default: true
    soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
    importance: 5, // (optional) default: Importance.HIGH. Int value of the Android notification importance
    vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
  },
  created => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
);

PushNotification.createChannel(
  {
    channelId: '2', // (required)
    channelName: 'Foreground service', // (required)
    channelDescription: 'Keeps location on in the background', // (optional) default: undefined.
    playSound: true, // (optional) default: true
    soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
    importance: 2, // (optional) default: Importance.HIGH. Int value of the Android notification importance
    vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
  },
  created => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
);

export const LocalNotification = (title, message) => {
  PushNotification.localNotification({
    // onlyAlertOnce: true,
    channelId: '1',
    // bigText:
    //   'This is local notification demo in React Native app. Only shown, when expanded.',
    // subText: 'Local Notification Demo',
    title: title,
    message: message,
    vibrate: true,
    vibration: 300,
    playSound: true,
    priority: 'max',
    soundName: 'default',
    invokeApp: false,
    id: '1',
  });
};

export const RSSNotification = (title, message) => {
  PushNotification.localNotification({
    // onlyAlertOnce: true,
    channelId: '1',
    // bigText:
    //   'This is local notification demo in React Native app. Only shown, when expanded.',
    // subText: 'Local Notification Demo',
    title: title,
    message: message,
    vibrate: true,
    vibration: 300,
    playSound: true,
    priority: 'max',
    soundName: 'default',
    invokeApp: true,
    id: '6',
  });
};
LocalNotification;
export const TipLogNotification = () => {
  PushNotification.localNotification({
    autoCancel: true,
    channelId: '1',
    // bigText:
    //   'This is local notification demo in React Native app. Only shown, when expanded.',
    // subText: 'Local Notification Demo',
    title: 'How did this customer tip?',
    message:
      'Record this tip rating to see it again the next time you get an order for this address.',
    vibrate: true,
    vibration: 300,
    playSound: true,
    soundName: 'default',
    actions: '["Bad", "Okay", "Great"]',
    invokeApp: false,
    id: '5',
  });
};

export const UnlabeledTipLogNotification = () => {
  PushNotification.localNotification({
    autoCancel: true,
    channelId: '1',
    // bigText:
    //   'This is local notification demo in React Native app. Only shown, when expanded.',
    // subText: 'Local Notification Demo',
    title: 'No Tip Data Found!',
    message:
      'Rate the offer below. You can update it at drop-off if it surprises or disappoints!',
    vibrate: true,
    vibration: 300,
    playSound: true,
    soundName: 'default',
    actions: '["Bad", "Okay", "Great"]',
    invokeApp: false,
    id: '4',
  });
};

export const TrackingNotification = userInfo => {
  PushNotification.localNotification({
    autoCancel: true,
    channelId: '1',
    // bigText:
    //   'This is local notification demo in React Native app. Only shown, when expanded.',
    // subText: 'Local Notification Demo',
    title: 'Tracking Delivery',
    message: 'Click on this notification to review your orders.',
    vibrate: true,
    vibration: 300,
    playSound: false,
    ongoing: true,
    soundName: 'default',
    invokeApp: false,
    userInfo: userInfo,
    id: '3',
  });
};
