import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import {StyleSheet, View, PermissionsAndroid, BackHandler} from 'react-native';
import {Text, Button, ActivityIndicator, Portal} from 'react-native-paper';
import {ToggleEnabledContext} from './App';
import TipLogCard from './TipLogCard';
import {FlatList, ScrollView} from 'react-native';

let requestCount = 0;

const TipLog = () => {
  const {userKeyState, completedOrders} = useContext(ToggleEnabledContext);
  const [orders, setOrders] = useState([]);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    setOrders(completedOrders);
  }, [completedOrders]);

  const getTenOrders = async () => {
    setAnimating(true);
    const res = await axios.get('https://wildlyle.dev:8020/getUserOrders', {
      params: {
        userKey: userKeyState,
        page: requestCount + 1,
      },
    });

    let keyedOrders = res.data
      .map((order, index) => {
        return {
          ...order,
          key: index + requestCount * 10 + 1,
        };
      })
      .reverse();

    // filter out keyed orders that match an address in the completed order array to avoid duplicates
    keyedOrders = keyedOrders.filter(
      order => !completedOrders.some(ord => ord.address === order.address),
    );

    keyedOrders = keyedOrders.filter(
      order => !orders.some(ord => ord.address === order.address),
    );

    requestCount++;

    setOrders([...keyedOrders, ...orders]);
    setAnimating(false);
  };

  return (
    <View style={styles.container}>
      <Button
        mode="contained"
        onPress={() => {
          getTenOrders();
        }}>
        Load More Orders
      </Button>
      <ActivityIndicator
        size="large"
        hidesWhenStopped={true}
        animating={animating}
      />
      <ScrollView>
        <View style={styles.cardContainer}>
          {orders &&
            orders.map(order => (
              <TipLogCard
                address={order.address}
                key={order.key}
                tipRating={order.tipRating}
              />
            ))}
        </View>
      </ScrollView>
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
