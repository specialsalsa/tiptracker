import {Alert} from 'react-native';

import RNAndroidNotificationListener from 'react-native-android-notification-listener';

const AsyncAlert = async () =>
  new Promise((resolve, reject) => {
    Alert.alert(
      'info',
      'Tip Tracker needs your permission to access DoorDash notifications so it can get the tip data. Please allow access on the next screen.',
      [
        {
          text: 'cancel',
          onPress: () => {
            reject('NO');
          },
        },
        {
          text: 'ok',
          onPress: () => {
            resolve('YES');
          },
        },
      ],
      {cancelable: false},
    );
  });

export const GetStatus = async () => {
  const status = await RNAndroidNotificationListener.getPermissionStatus();
  console.log(status);
  if (status == 'denied' || status == 'unknown') {
    try {
      await AsyncAlert();
      RNAndroidNotificationListener.requestPermission();
    } catch (err) {
      console.log(err);
    }
  }
  return status;
};
