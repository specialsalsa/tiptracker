import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text} from 'react-native';
const UpdateBanner = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>tipTracker has been updated!</Text>
    </View>
  );
};

export default UpdateBanner;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'skyblue',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
  },
});
