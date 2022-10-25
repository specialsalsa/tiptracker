import {
  Card,
  Title,
  Text,
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

  const {
    currentlyTracking,
    setCurrentlyTracking,
    setAddressesArrayState,
    addressesArrayState,
    userKeyState,
    onSetTipData,
    rating: tipRating,
  } = useContext(ToggleEnabledContext);

  const removeThisOrder = () => {
    setAddressesArrayState(current => {
      if (current.length === 1) {
        setCurrentlyTracking(current => false);
        PushNotification.cancelLocalNotification('3');
      }
      return current.filter(order => order.key !== props.id);
    });
  };

  const setTipData = async rating => {
    try {
      const res = await axios.post(
        'https://myapiurlgoes.heere:8020/setTipData',
        null,
        {
          params: {
            address: props.address,
            tipRating: rating,
            userKey: userKeyState,
          },
        },
      );

      onSetTipData(tipRating);

      return res;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <View style={styles.cardContainer}>
        <Card style={styles.card} elevation={2} mode="outlined">
          <Card.Title style={{marginBottom: -10}} title="Current Order" />
          <Card.Content>
            <Title>{props.restaurant}</Title>
            <Text>{props.itemCount} items</Text>
            <View style={styles.iconContainer}>
              <Button
                style={styles.iconButton}
                containerColor="black"
                icon="thumb-down"
                size={15}
                onPress={() => {
                  setTipData('Bad Tipper');
                  removeThisOrder();
                }}
              />
              <Button
                style={styles.iconButton}
                containerColor="black"
                icon="hand-wave"
                size={15}
                onPress={() => {
                  setTipData('Okay Tipper');
                  removeThisOrder();
                }}
              />
              <Button
                style={styles.iconButton}
                containerColor="black"
                icon="thumb-up"
                size={15}
                onPress={() => {
                  setTipData('Great Tipper');
                  removeThisOrder();
                }}
              />
              <Chip compact={true} onPress={removeThisOrder}>
                Cancel
              </Chip>
            </View>
          </Card.Content>
        </Card>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    // padding: 20,
    // marginStart: 50,
    // marginEnd: 50,
    flexDirection: 'column',
    flexGrow: 1,
    flexBasis: 'auto',
    width: 'auto',
  },
  snackbarContainer: {
    // flex: 1,
    // padding: 30,
    // marginStart: 80,
    // marginEnd: 80,
  },
  card: {
    // borderWidth: 20,
  },
  iconContainer: {
    // marginLeft: 100,
    alignSelf: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  iconButton: {
    border: 5,
  },
});

export default withTheme(OrderCard);
