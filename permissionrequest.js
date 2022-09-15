import {PermissionsAndroid} from 'react-native';

//request the permission before starting the service.
const backgroundgranted = await PermissionsAndroid.request(
  PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
  {
    title: 'Background Location Permission',
    message:
      'We need access to your location ' +
      'so you can get live quality updates.',
    buttonNeutral: 'Ask Me Later',
    buttonNegative: 'Cancel',
    buttonPositive: 'OK',
  },
);
if (backgroundgranted === PermissionsAndroid.RESULTS.GRANTED) {
  //do your thing!
}
