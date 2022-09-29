import {
  Card,
  Title,
  Paragraph,
  Button,
  IconButton,
  Chip,
  TouchableRipple,
  withTheme,
  useTheme,
  Snackbar,
} from 'react-native-paper';
import {View, StyleSheet} from 'react-native';
import React, {useContext, useState} from 'react';
import {ToggleEnabledContext} from './App';
import axios from 'axios';
import PushNotification from 'react-native-push-notification';

const OrderCard = props => {
  const {colors} = useTheme();

  const {setCurrentlyTracking, setAddressesArrayState} =
    useContext(ToggleEnabledContext);

  const [error, setError] = useState('');

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarContent, setSnackbarContent] = useState('');
  const onDismissSnackBar = () => setSnackbarVisible(false);
  const onToggleSnackBar = () => setSnackbarVisible(!snackbarVisible);

  const removeThisOrder = () => {
    setAddressesArrayState(current => {
      if (current.length === 1) {
        setCurrentlyTracking(false);
        PushNotification.cancelLocalNotification('3');
      }
      return current.filter(order => order.key !== props.id);
    });
  };

  const setTipData = async rating => {
    try {
      const res = await axios.post(
        'https://wildlyle.dev:8020/setTipData',
        null,
        {
          params: {
            address: props.address,
            tipRating: rating,
          },
        },
      );

      if (res.data === 'updated') {
        setSnackbarContent('Existing tip data updated!');
      } else if (res.data === 'saved') {
        setSnackbarContent('New tip data stored!');
      } else {
        setSnackbarContent('Error sending tip data.');
      }
    } catch (error) {
      console.log(error);
      setSnackbarContent('Error sending tip data.');
    }

    setAddressesArrayState(current => {
      return current.filter(order => order.key !== props.id);
    });

    onToggleSnackBar();
  };

  return (
    <>
      <View style={styles.cardContainer}>
        <Card style={styles.card} elevation={2} mode="outlined">
          <Card.Title title="Current Order" />
          <Card.Content>
            <Title>{props.restaurant}</Title>
            <View style={styles.iconContainer}>
              <Button
                style={styles.iconButton}
                containerColor="black"
                icon="thumb-down"
                size={15}
                onPress={() => {
                  setTipData('Bad Tipper');
                }}
              />
              <Button
                style={styles.iconButton}
                containerColor="black"
                icon="hand-wave"
                size={15}
                onPress={() => {
                  setTipData('Okay Tipper');
                }}
              />
              <Button
                style={styles.iconButton}
                containerColor="black"
                icon="thumb-up"
                size={15}
                onPress={() => {
                  setTipData('Great Tipper');
                }}
              />
              <Chip compact={true} onPress={removeThisOrder}>
                Cancel
              </Chip>
            </View>
          </Card.Content>
        </Card>
      </View>
      <View style={styles.snackbarContainer}>
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
    </>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    padding: 20,
    marginStart: 50,
    marginEnd: 50,
    flexDirection: 'column',
    flexGrow: 1,
    flexBasis: 'auto',
    width: 'auto',
  },
  snackbarContainer: {
    flex: 1,
    // padding: 30,
    marginStart: 80,
    marginEnd: 80,
  },
  card: {
    borderWidth: 20,
  },
  iconContainer: {
    marginLeft: 100,
    alignSelf: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  iconButton: {
    border: 5,
  },
});

export default withTheme(OrderCard);
