import React, {Component} from 'react';
import {Icon, Button} from 'native-base';
import {DrawerNavigator, StackNavigator, TabNavigator} from 'react-navigation';

import MainScreen from '../screens/main/main-screen';
import SummaryScreen from '../screens/summary/summary-screen';
import TestScreen from '../screens/test/test';

// const headerLeft = navigation => (
//   <Button transparent onPress={_ => navigation.navigate('DrawerOpen')}>
//       <Icon ios="ios-menu" android="md-menu" style={{color: '#fff'}} />
//   </Button>
// );

const contentOptions = {
  initialRouteName: 'Home',
  drawerPosition: 'left'

};

const MainNavigator = TabNavigator({
  Main: {
    screen: MainScreen
  },
  Summary: {
    screen: SummaryScreen
  }
}, {
  swipeEnabled: true,
  tabBarPosition: 'top'
  });

export const RootNavigator = DrawerNavigator({
  Home: {
    screen: MainNavigator,
    navigationOptions: {
      headerLeft: <Icon ios="ios-menu" android="md-menu" style={{color: '#fff'}} />
    }
  },
  Test: {
    screen: TestScreen
  }
},
  contentOptions
);