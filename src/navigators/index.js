import React, {Component} from 'react';
import {Icon, Button} from 'native-base';
import {DrawerNavigator, StackNavigator} from 'react-navigation';

import HomeScreen from '../screens/home/HomeScreen';
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


export const RootNavigator = DrawerNavigator({
    Home: {
      screen: HomeScreen,
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