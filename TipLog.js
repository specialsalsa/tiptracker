import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {StyleSheet, View, PermissionsAndroid, BackHandler} from 'react-native';
import {Text, Button} from 'react-native-paper';

const TipLog = () => {
  const [orders, setOrders] = useState({});

  const getTenOrders = async page => {
    axios.get(
      '/getTenOrders',
      {
        params: {
          page: page,
        },
      },
      (req, res) => {
        setOrders({...orders, ...res.data});
      },
    );
    console.log(orders);
  };

  return (
    <View style={styles.container}>
      <Text>This is where the tip log will go</Text>
      {/* <Button
        mode="contained"
        onPress={() => {
          getTenOrders(1);
        }}>
        Load More Orders
      </Button> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  buttonContainer: {
    marginTop: 20,
  },
  button: {
    marginTop: 50,
  },
  titleText: {
    fontSize: 20,
  },
});

export default TipLog;
