import React, {Component} from 'react';
import {Button, Icon} from 'native-base';
import {DrawerNavigator, StackNavigator, TabNavigator} from 'react-navigation';

import MainScreen from '../screens/main-screen';
import SummaryScreen from '../screens/summary-screen';
import TestScreen from '../screens/test';



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
    screen: MainScreen,
    navigationOptions: {
      tabBarIcon: <Icon name="basket" />
    }
  },
  Summary: {
    screen: SummaryScreen,
    navigationOptions: {
      tabBarIcon: <Icon name="analytics" />
    }
  }
}, {
    swipeEnabled: true,
    tabBarPosition: 'top'
  });

export const RootNavigator = DrawerNavigator({
  Home: {
    screen: MainNavigator,
    navigationOptions: {
      drawerIcon: <Icon name="menu" style={{color: '#fff'}} />
    }
  },
  Test: {
    screen: TestScreen
  }
},
  contentOptions
);
