import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {getStateAbbreviation} from './HelperFunctions';
import {
  TextInput,
  Button,
  Text,
  Paragraph,
  Dialog,
  Portal,
  Snackbar,
  Card,
  Title,
  MD3DarkTheme as DefaultTheme,
} from 'react-native-paper';
import axios from 'axios';

const TipperLookup = () => {
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [submitIsLoading, setSubmitIsLoading] = useState('');

  const [dialogVisible, setDialogVisible] = useState(false);
  const [tipDataVisible, setTipDataVisible] = useState(false);

  const [cardTheme, setCardTheme] = useState({});

  const handleSetFillColor = color => {
    if (color === 'grey') {
      setCardTheme({colors: {surface: DefaultTheme.colors.surface}});
    } else {
      setCardTheme({colors: {surface: color}});
    }
  };

  const handleLookupTipper = () => {
    setSubmitIsLoading(true);
    postToDatabase(address.trim(), city.trim(), state.trim()).then(res => {
      if (
        res.data.tipRating?.includes('Good') ||
        res.data.tipRating?.includes('Great')
      ) {
        handleSetFillColor('darkgreen');
      } else if (
        res.data.tipRating?.includes('Bad') ||
        res.data.tipRating?.includes('Shit')
      ) {
        handleSetFillColor('darkred');
      } else {
        handleSetFillColor('grey');
      }
      setSubmitIsLoading(false);
    });
  };

  const showDialog = () => setDialogVisible(true);
  const hideDialog = () => setDialogVisible(false);

  const [tipData, setTipData] = useState('');

  const postToDatabase = async (address, city, state) => {
    const addressString = `${address}, ${city}, ${getStateAbbreviation(
      state,
    )}`.trim();

    if (!address || !city || !state) {
      showDialog();
      return;
    }

    try {
      const res = await axios.get('https://wildlyle.dev:8020/getTipData', {
        params: {
          address: addressString,
        },
      });

      if (res.data === 'no match found') {
        setTipData('No match found for this address.');
      } else {
        setTipData(res.data.tipRating);
        setTipDataVisible(true);
      }

      return res;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.addressContainer}>
        <View style={styles.textContainer}>
          <Text variant="headlineMedium">Tipper Lookup</Text>
        </View>
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
      <View style={styles.buttonContainer}>
        <Button
          style={styles.button}
          icon="check-bold"
          mode="contained"
          loading={submitIsLoading}
          onPress={handleLookupTipper}>
          Lookup Tipper
        </Button>
      </View>

      {tipDataVisible && (
        <View style={styles.cardContainer}>
          <Card theme={cardTheme} style={styles.card} mode="outlined">
            <Card.Title
              titleStyle={{color: 'white', textAlign: 'center'}}
              title="Tip Data"
            />
            <Card.Content>
              <Title style={{color: 'white', textAlign: 'center'}}>
                {tipData}
              </Title>
            </Card.Content>
          </Card>
        </View>
      )}
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={hideDialog}>
          <Dialog.Title>Alert</Dialog.Title>
          <Dialog.Content>
            <Paragraph>Please fill out all fields before submitting</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>OK</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

export default TipperLookup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  card: {
    // borderWidth: 5,
    // color: 'white',
    marginLeft: 30,
    marginRight: 30,
  },

  button: {
    marginTop: 20,
  },

  buttonContainer: {
    alignItems: 'center',
  },

  cardContainer: {
    flex: 1,
    padding: 20,
    marginStart: 50,
    marginEnd: 50,
    flexDirection: 'column',
    // flexGrow: 1,
    flexBasis: 'auto',
    width: 'auto',
  },

  addressInput: {
    marginStart: 20,
    marginEnd: 20,
  },

  textContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 25,
  },
});
