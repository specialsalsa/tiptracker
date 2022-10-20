// import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {createMaterialBottomTabNavigator} from '@juliushuck/react-native-navigation-material-bottom-tabs';
import {
  NavigationContainer,
  useLinkProps,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import {
  MD3DarkTheme as PaperDarkTheme,
  MD3LightTheme as PaperDefaultTheme,
} from 'react-native-paper';
import {useColorScheme} from 'react-native';
import React from 'react';
import Home from './Home';
import TipLog from './TipLog';
import AddNewTipper from './AddNewTipper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import TipperLookup from './TipperLookup';

const Tab = createMaterialBottomTabNavigator();

const MyTabs = () => {
  const CombinedDefaultTheme = {
    ...PaperDefaultTheme,
    ...NavigationDefaultTheme,
    colors: {
      ...PaperDefaultTheme.colors,
      ...NavigationDefaultTheme.colors,
    },
  };
  const CombinedDarkTheme = {
    ...PaperDarkTheme,
    ...NavigationDarkTheme,
    colors: {
      ...PaperDarkTheme.colors,
      ...NavigationDarkTheme.colors,
    },
  };
  const currentTheme = useColorScheme();

  return (
    <NavigationContainer
      theme={
        currentTheme === 'light' ? CombinedDefaultTheme : CombinedDarkTheme
      }>
      <Tab.Navigator>
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
        <Tab.Screen
          name="Tip Log"
          component={TipLog}
          options={{
            tabBarIcon: 'book-open-page-variant',
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default MyTabs;
