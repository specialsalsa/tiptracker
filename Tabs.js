import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import Home from './Home';
import TipLog from './TipLog';
import AddNewTipper from './AddNewTipper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import TipperLookup from './TipperLookup';

const Tab = createMaterialBottomTabNavigator();

export default function MyTabs() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        activeColor="#000000"
        barStyle={{backgroundColor: 'lightgrey'}}>
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarIcon: 'home',
          }}
        />
        <Tab.Screen
          name="Add New Tipper"
          component={AddNewTipper}
          options={{
            tabBarIcon: 'account-multiple-plus',
          }}
        />
        <Tab.Screen
          name="Tipper Lookup"
          component={TipperLookup}
          options={{
            tabBarIcon: 'book-marker',
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
