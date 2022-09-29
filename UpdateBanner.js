import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import CodePush from 'react-native-code-push';
const UpdateBanner = () => {
  const [updateText, setUpdateText] = useState('');

  CodePush.getUpdateMetadata().then(update => {
    if (update) {
    }
  });

  return (
    <View style={styles.container}>
      <Text>{updateText}</Text>
    </View>
  );
};

export default UpdateBanner;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
