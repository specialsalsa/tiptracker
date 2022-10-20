import React, {useState, useReducer, useContext} from 'react';
import {View, StyleSheet} from 'react-native';
import {getStateAbbreviation} from './HelperFunctions';

import Geolocation from 'react-native-geolocation-service';

import axios from 'axios';

import {
  TextInput,
  List,
  Button,
  Menu,
  Text,
  RadioButton,
  Paragraph,
  Dialog,
  Portal,
  Snackbar,
} from 'react-native-paper';

import {ToggleEnabledContext} from './App';

const AddNewTipper = () => {
  const {userKeyState} = useContext(ToggleEnabledContext);

  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  const [locationIsLoading, setLocationIsLoading] = useState('');

  const handleGetLocation = () => {
    Geolocation.getCurrentPosition(position => {
      setLocationIsLoading(true);
      axios
        .get(`https://nominatim.openstreetmap.org/reverse`, {
          params: {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
            format: 'geojson',
          },
        })
        .then(result => {
          setLocationIsLoading(false);
          setAddress(
            `${result.data.features[0].properties.address.house_number} ${result.data.features[0].properties.address.road}`,
          );
          setCity(
            result.data.features[0].properties.address.city ||
              result.data.features[0].properties.address.town,
          );
          setState(
            getStateAbbreviation(
              result.data.features[0].properties.address.state,
            ),
          );
        });
    });
  };

  const [submitIsLoading, setSubmitIsLoading] = useState('');

  const [tipRating, setTipRating] = useState('');

  const [dialogVisible, setDialogVisible] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const onToggleSnackBar = () => setSnackbarVisible(!snackbarVisible);

  const [snackbarContent, setSnackbarContent] = useState('');

  const onDismissSnackBar = () => setSnackbarVisible(false);

  const showDialog = () => setDialogVisible(true);

  const hideDialog = () => setDialogVisible(false);

  const postToDatabase = async (address, city, state) => {
    const addressString = `${address}, ${city}, ${getStateAbbreviation(state)}`;

    if (!address || !city || !state) {
      showDialog();
      return;
    }

    try {
      const res = await axios.post(
        'https://wildlyle.dev:8020/setTipDataManual',
        null,
        {
          params: {
            address: addressString,
            tipRating: tipRating,
            userKey: userKeyState,
          },
        },
      );

      if (res.data === 'updated') {
        setSnackbarContent('Existing tip data updated!');
      } else if (res.data === 'saved') {
        setSnackbarContent('New tip data stored!');
      } else {
        setSnackbarContent('Error setting tip data.');
      }
    } catch (error) {
      console.log(error);
    }

    onToggleSnackBar();
  };

  const handlePost = () => {
    setSubmitIsLoading(true);
    postToDatabase(address.trim(), city.trim(), state.trim()).then(res => {
      setSubmitIsLoading(false);
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.addressContainer}>
        <View style={styles.textContainer}>
          <Text variant="headlineMedium">Add New Tipper</Text>
        </View>
        <Button
          style={styles.button}
          icon="map-marker"
          mode="contained"
          loading={locationIsLoading}
          onPress={handleGetLocation}>
          Use current location
        </Button>
        <TextInput
          style={styles.addressInput}
          mode="outlined"
          label="Address"
          value={address}
          onChangeText={address => setAddress(address)}></TextInput>
        <TextInput
          style={styles.addressInput}
          mode="outlined"
          label="City"
          value={city}
          onChangeText={city => setCity(city)}></TextInput>
        <TextInput
          style={styles.addressInput}
          mode="outlined"
          label="State"
          value={state}
          onChangeText={state => setState(state)}></TextInput>
      </View>
      <RadioButton.Group
        onValueChange={tipRating => setTipRating(tipRating)}
        value={tipRating}>
        <View>
          <RadioButton.Item label="Bad Tipper" value="Bad Tipper" />
        </View>
        <View>
          <RadioButton.Item label="Okay Tipper" value="Okay Tipper" />
        </View>
        <View>
          <RadioButton.Item label="Great Tipper" value="Great Tipper" />
        </View>
      </RadioButton.Group>
      <View>
        <Button
          style={styles.button}
          icon="check-bold"
          mode="contained"
          loading={submitIsLoading}
          onPress={handlePost}>
          Add New Tipper
        </Button>
        <Portal>
          <Dialog visible={dialogVisible} onDismiss={hideDialog}>
            <Dialog.Title>Alert</Dialog.Title>
            <Dialog.Content>
              <Paragraph>
                Please fill out all fields before submitting
              </Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideDialog}>OK</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>

      <View style={styles.container}>
        <Snackbar
          visible={snackbarVisible}
          onDismiss={onDismissSnackBar}
          action={{
            label: 'OK',
            onPress: () => {
              onDismissSnackBar();
            },
          }}>
          {snackbarContent}
        </Snackbar>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    // backgroundColor: 'black',
  },
  buttonContainer: {
    marginTop: 20,
  },

  textContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 25,
  },
});

export default AddNewTipper;
