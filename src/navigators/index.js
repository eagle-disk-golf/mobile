import React, {Component} from 'react';
import { View } from 'react-native';
/** https://reactnavigation.org/ */
import {StackNavigator, TabNavigator} from 'react-navigation';
import Icon from '../components/icon';
import Color from 'color';
import {COLORS} from '../res/styles/constants';
import MainScreen from '../screens/main-screen';
import TrackingScreen from '../screens/tracking-screen';
import SummaryScreen from '../screens/summary-screen';
import HeaderLeft from '../components/header/header-left';
import SummaryDetailScreen from '../screens/summary-detail-screen';
import SummaryDetailLaneScreen from '../screens/summary-detail-lane-screen';
import {isIos} from '../helpers/platform';

import gpsdemo from '../components/gps-demo';

// Higher header on ios
const getHeaderHeight = () => isIos ? 100 : 85;
const defaultNavigationOptions = {
  headerStyle: {
    backgroundColor: COLORS.primary,
    borderBottomColor: 'transparent',
    height: getHeaderHeight(),
    paddingLeft: 20,
    paddingRight: 20,
  },
  headerTintColor: COLORS.textPrimary
};

//** https://reactnavigation.org/docs/stack-navigator.html */
export const RootNavigator = StackNavigator({
  MainNavigation: {
    screen: gpsdemo,
    navigationOptions: {
      ...defaultNavigationOptions
    }
  }
});
