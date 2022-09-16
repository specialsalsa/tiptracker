import React from 'react';
import {View} from 'react-native';
import {Text, StyleSheet} from 'react-native';
import {getStatus} from './components/GetStatus';
import {askBackgroundPermission} from './HelperFunctions';
import {
  Provider as PaperProvider,
  Card,
  Title,
  Paragraph,
} from 'react-native-paper';

import MyTabs from './Tabs';

const App = () => {
  getStatus();

  askBackgroundPermission();

  //   <View style={styles.container}>
  //   <Text style={styles.titleText}>Welcome to Tip Tracker!</Text>
  // </View>

  return (
    <PaperProvider>
      <MyTabs />
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 100,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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

export default App;
