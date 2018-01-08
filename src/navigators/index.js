/*
  KIDE
  File created: beginning
  Made by: Riku
  History: Topi - 30.11.2017 - Added StackNavigation for SummaryScreen
  History: Riku - 12.12.2017 - Use custom icon, formatting
*/

import React, {Component} from 'react';
import {Button, Text, Thumbnail, Item} from 'native-base';
import {View, TouchableOpacity, StyleSheet, Platform} from 'react-native';
import {DrawerNavigator, StackNavigator, TabNavigator} from 'react-navigation';
import Icon from '../components/icon';

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

const TabIcon = ({name, isFocused}) => {
  const iconColor = isFocused ? null : 'lightgray';
  return <Icon size={20} name={name} style={{color: iconColor}} />;
}

const contentOptions = {
  initialRouteName: 'Home',
  drawerPosition: 'left'

};

// Nesting StackNavigator for Summary details
const SummaryNavigator = StackNavigator({
  Summary: {screen: SummaryScreen},
  SummaryDetail: {screen: SummaryDetailScreen}
});

const TabBarOptions = {
  showIcon: true,
  activeTintColor: COLORS.primary,
  inactiveTintColor: 'lightgray',
  style: {
    backgroundColor: '#fff'
  },
  labelStyle: {
    margin: 0,
    padding: 0
  },
  indicatorStyle: {
    backgroundColor: 'transparent'
  }
}

const MainNavigator = TabNavigator({
  Main: {
    screen: MainScreen,
    navigationOptions: {
      tabBarIcon: ({focused}) => {
        return <TabIcon isFocused={focused} name="ios-home" />
      }
    }
  },
  Tracking: {
    screen: TrackingScreen,
    navigationOptions: {
      tabBarIcon: ({focused}) => <TabIcon isFocused={focused} name="ios-basket" />
    }
  },
  Summary: {
    screen: SummaryNavigator,
    navigationOptions: {
      tabBarIcon: ({focused}) => <TabIcon isFocused={focused} name="ios-analytics" />
    }
  },
}, {
    swipeEnabled: true,
    tabBarPosition: 'top',
    tabBarOptions: TabBarOptions,
  });
// Nesting tabnavigator inside of stacknavi to make the header appear

// higher header on ios
const getHeaderHeight = () => Platform.OS === 'ios' ? 90 : 85;

const MainNavigatorContainer = StackNavigator({
  Home: {
    screen: MainNavigator,
    navigationOptions: {
      headerStyle: {
        backgroundColor: COLORS.primary,
        borderBottomColor: 'transparent',
        height: getHeaderHeight(),
        paddingLeft: 20,
        paddingRight: 20,
      },
      headerLeft: <HeaderLeft />,
      headerRight: <HeaderRight />
    }
  }
});

export const RootNavigator = DrawerNavigator({
  Home: {
    screen: MainNavigatorContainer,
    navigationOptions: {
      drawerIcon: <Icon name="ios-menu" style={{color: '#fff'}} />
    }
  },
  Test: {
    screen: TestScreen
  }
},
  contentOptions
);
