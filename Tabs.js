import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import Home from './Home';
import TipLog from './TipLog';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createMaterialBottomTabNavigator();

export default function MyTabs() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarIcon: 'home',
          }}
        />
        <Tab.Screen
          name="Tip Log"
          component={TipLog}
          options={{
            tabBarIcon: 'currency-usd',
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
