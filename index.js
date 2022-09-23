/**
 * @format
 */

import {AppRegistry, PermissionsAndroid} from 'react-native';
import React, {useEffect, createContext, useContext} from 'react';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
