import {View, StyleSheet, Dimensions} from 'react-native';
import {
  Card,
  Title,
  IconButton,
  MD3DarkTheme,
  MD3Colors,
} from 'react-native-paper';

import React, {useState, useReducer} from 'react';
import useHighlight from './hooks/useHighlight';
import axios from 'axios';

const TipLogCard = props => {
  const [highlight, setHighlight] = useState(useHighlight(props.tipRating));

  const [selected, setIsSelected] = useState({
    red: props.tipRating === 'Bad Tipper',
    orange: props.tipRating === 'Okay Tipper',
    green: props.tipRating === 'Great Tipper',
  });

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

      if (tipRating === 'Bad Tipper')
        setIsSelected({red: true, orange: false, green: false});

      if (tipRating === 'Okay Tipper')
        setIsSelected({red: false, orange: true, green: false});
      if (tipRating === 'Great Tipper')
        setIsSelected({red: false, orange: false, green: true});

      // onSetTipData(addressesArrayState, tipRating);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <View style={styles.cardContainer}>
        <Card style={styles.card} elevation={2} mode="outlined">
          <Card.Title style={{marginBottom: -10}} title={props.address} />
          <Card.Content>
            <Title style={{fontSize: 16}}>
              {props.note ? props.note : null}
            </Title>
            <View style={styles.iconContainer}>
              <IconButton
                icon="thumb-down"
                iconColor={selected.red ? 'indianred' : MD3Colors.neutral80}
                mode={highlight.bad}
                onPress={() => {
                  setTipData(props.address, 'Bad Tipper');
                  setIsSelected({red: true, orange: false, green: false});
                }}
              />
              <IconButton
                style={styles.iconButton}
                icon="hand-wave"
                iconColor={selected.orange ? 'orange' : MD3Colors.neutral80}
                mode={highlight.okay}
                onPress={() => {
                  setTipData(props.address, 'Okay Tipper');
                  setIsSelected({red: false, orange: true, green: false});
                }}
              />
              <IconButton
                // iconColor="green"
                style={styles.iconButton}
                icon="thumb-up"
                iconColor={selected.green ? 'lightgreen' : MD3Colors.neutral80}
                mode={highlight.great}
                onPress={() => {
                  setTipData(props.address, 'Great Tipper');
                  setIsSelected({red: false, orange: false, green: true});
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
    // width: 'auto',
  },
  snackbarContainer: {
    // flex: 1,
    // padding: 30,
    // marginStart: 80,
    // marginEnd: 80,
  },
  card: {
    // borderWidth: 20,
    width: Dimensions.get('window').width / 1.2,
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
