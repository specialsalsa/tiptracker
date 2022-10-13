/**
 * @format
 */

import {AppRegistry, PermissionsAndroid} from 'react-native';
import React, {useEffect, createContext, useContext} from 'react';
import 'react-native-get-random-values';
import AsyncStorage from '@react-native-async-storage/async-storage';

import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
