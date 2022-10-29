import {View, StyleSheet} from 'react-native';
import {Card, Title, IconButton, useTheme} from 'react-native-paper';

import React, {useState} from 'react';
import useHighlight from './hooks/useHighlight';
import axios from 'axios';

const TipLogCard = props => {
  const theme = useTheme();

  const [highlight, setHighlight, addressesArrayState, onSetTipData] = useState(
    useHighlight(props.tipRating),
  );

  const setTipData = async (address, tipRating) => {
    try {
      const res = await axios.post(
        'https://wildlyle.dev:8020/setTipData',
        null,
        {
          params: {
            address: address,
            tipRating: tipRating,
          },
        },
      );

      setHighlight(useHighlight(tipRating));
      // onSetTipData(addressesArrayState, tipRating);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <View style={styles.cardContainer}>
        <Card style={styles.card} elevation={2} mode="outlined">
          <Card.Title style={{marginBottom: -10}} title="Logged Order" />
          <Card.Content>
            <Title>{props.address}</Title>
            <View style={styles.iconContainer}>
              <IconButton
                theme={{
                  colors: {primary: 'indianred'},
                }}
                icon="thumb-down"
                mode={highlight.bad}
                onPress={() => {
                  setTipData(props.address, 'Bad Tipper');
                }}
              />
              <IconButton
                theme={{
                  colors: {primary: 'orange'},
                }}
                style={styles.iconButton}
                icon="hand-wave"
                mode={highlight.okay}
                onPress={() => {
                  setTipData(props.address, 'Okay Tipper');
                }}
              />
              <IconButton
                theme={{
                  colors: {primary: 'lightgreen'},
                }}
                style={styles.iconButton}
                icon="thumb-up"
                mode={highlight.great}
                onPress={() => {
                  setTipData(props.address, 'Great Tipper');
                }}
              />
            </View>
          </Card.Content>
        </Card>
      </View>
    </>
  );
};

export default TipLogCard;

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    // padding: 20,
    // marginStart: 50,
    // marginEnd: 10,
    marginBottom: 10,
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
