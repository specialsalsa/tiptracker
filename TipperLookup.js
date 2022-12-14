import React, {useCallback, useState, useRef} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
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
import TipLogCard from './TipLogCard';
import _debounce from 'lodash/debounce';

const TipperLookup = () => {
  const address = useRef('');
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
    console.log('hi');
    setSubmitIsLoading(true);
    postToDatabase(address.current.trim()).then(res => {
      setSubmitIsLoading(false);
    });
  };

  const showDialog = () => setDialogVisible(true);
  const hideDialog = () => setDialogVisible(false);

  const [tipData, setTipData] = useState([]);

  const postToDatabase = async address => {
    const addressString = address;

    if (!addressString) {
      setTipData([]);
      return;
    }

    try {
      const res = await axios.get('https://wildlyle.dev:8020/lookupTippers', {
        params: {
          address: addressString,
        },
      });

      if (res.data === 'no match found') {
        setTipData('No match found for this address.');
      } else {
        setTipData(res.data);

        setTipDataVisible(true);
      }

      return res;
    } catch (error) {
      console.log(error);
    }
  };

  const doTheThing = useCallback(_debounce(handleLookupTipper, 180), []);
  return (
    <ScrollView style={styles.container}>
      <View style={styles.addressContainer}>
        <View style={styles.textContainer}>
          <Text variant="headlineMedium">Tipper Lookup</Text>
        </View>
        <TextInput
          style={styles.addressInput}
          mode="outlined"
          label="Address"
          value={address}
          onChangeText={add => {
            address.current = add;
            doTheThing();
          }}></TextInput>
      </View>
      {tipData &&
        tipData.map(customer => {
          return (
            <TipLogCard
              tipRating={customer.tipRating}
              address={customer.address}
              note={customer.note}
            />
          );
        })}
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
    </ScrollView>
  );
};

export default TipperLookup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: 30,
    marginRight: 30,
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

  addressContainer: {
    marginBottom: 20,
  },

  textContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 25,
  },
});
