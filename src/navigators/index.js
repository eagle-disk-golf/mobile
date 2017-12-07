/*
  KIDE
  File created: beginning
  Made by: Riku
  History: Topi - 30.11.2017 - Added StackNavigation for SummaryScreen
*/

import React, {Component} from 'react';
import {Button, Icon, Text, Thumbnail, Item} from 'native-base';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {DrawerNavigator, StackNavigator, TabNavigator} from 'react-navigation';

//App colors
import {COLORS} from '../res/styles/constants';

import MainScreen from '../screens/main-screen';
import TrackingScreen from '../screens/tracking-screen';
import SummaryScreen from '../screens/summary-screen';
import TestScreen from '../screens/test';

import HeaderLeft from '../components/header/header-left';
import HeaderRight from '../components/header/header-right';

import SummaryDetailScreen from '../screens/summarydetail-screen';
import SummaryDetail from '../components/summary-detail';




// const headerLeft = navigation => (
//   <Button transparent onPress={_ => navigation.navigate('DrawerOpen')}>
//       <Icon ios="ios-menu" android="md-menu" style={{color: '#fff'}} />
//   </Button>
// );

const contentOptions = {
  initialRouteName: 'Home',
  drawerPosition: 'left'

};

// Nesting StackNavigator for Summary details
const SummaryNavigator = StackNavigator({
  Summary: { screen: SummaryScreen },
  SummaryDetail: { screen: SummaryDetailScreen }
});

const MainNavigator = TabNavigator({
  Main: {
    screen: MainScreen,
    navigationOptions: {
      tabBarIcon: <Icon name="home" />
    }
  },
  Tracking: {
    screen: TrackingScreen,
    navigationOptions: {
      tabBarIcon: <Icon name="basket" />
    }
  },
  Summary: {
    screen: SummaryNavigator,
    navigationOptions: {
      tabBarIcon: <Icon name="analytics" />
    }
  },
}, {
    swipeEnabled: true,
    tabBarPosition: 'top'
  });
// Nesting tabnavigator inside of stacknavi to make the header appear

const MainNavigatorContainer = StackNavigator({
    Home: { screen: MainNavigator,
        navigationOptions: {
           /*title: "Eagle Disc Golf"*/

            headerStyle: {
                backgroundColor: COLORS.primary,
                height: 80,
                paddingLeft: 20,
                paddingRight: 20,
            },
            headerLeft:  <HeaderLeft />,
            headerRight: <HeaderRight/>

          }
        }
});

export const RootNavigator = DrawerNavigator({

  Home: {
    screen: MainNavigatorContainer,
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
