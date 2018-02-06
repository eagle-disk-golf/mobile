/*
  KIDE
  File created: beginning
  Made by: Riku
  History: Topi - 30.11.2017 - Added StackNavigation for SummaryScreen
  History: Riku - 12.12.2017 - Use custom icon, formatting
  History: Oskari - 29.1.2018 - Styling
*/

import React, {Component} from 'react';
import {} from 'native-base';
import {Platform, View} from 'react-native';
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

import SummaryDetailScreen from '../screens/summary-detail-screen';
import SummaryDetail from '../components/summary-detail';
import SummaryDetailLaneScreen from '../screens/summary-detail-lane-screen';
import {isIos} from '../helpers/platform';

const TabIcon = ({name, isFocused}) => {
  const iconColor = isFocused ? null : 'lightgray';
  return <Icon size={20} name={name} style={{color: iconColor}} />;
};

// Nesting StackNavigator for Summary details
// const SummaryNavigator = StackNavigator({
//   Summary: {screen: SummaryScreen},
//   SummaryDetail: {
//     screen: SummaryDetailScreen,
//   }
// }, {headerMode: 'none'});

const TabBarOptions = {
  showIcon: true,
  activeTintColor: '#003337',
  inactiveTintColor: 'lightgray',
  style: {
    backgroundColor: '#F8FDFF',
    elevation: 0,
    borderBottomWidth: 0.5,
    borderTopWidth: 0.0,
    borderColor: '#c1bfbf'
  },
  labelStyle: {
    margin: 0,
    padding: 0
  },
  indicatorStyle: {
    backgroundColor: 'transparent'
  }
};

const MainTabNavigator = TabNavigator({
  Main: {
    screen: MainScreen,
    navigationOptions: {
      tabBarIcon: ({focused}) => {
        return <TabIcon isFocused={focused} name='ios-home' />;
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
    screen: SummaryScreen,
    navigationOptions: {
      tabBarIcon: ({focused}) => <TabIcon isFocused={focused} name="ios-analytics" />,
    }
  },
}, {
    swipeEnabled: true,
    tabBarPosition: 'top',
    tabBarOptions: TabBarOptions,
  });
// Nesting tabnavigator inside of stacknavi to make the header appear

// const MainNavigation = StackNavigator({
//   MainTabs: {
//     screen: MainTabNavigator,
//   },
// }, {headerMode: 'none'});


// Wrap main navigator inside screen element so header can receive navigation props
class MainNavigationScreen extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      headerLeft: <HeaderLeft navigation={navigation} />,
      // headerRight: <HeaderRight navigation={navigation} />
    };
  }
  render() {
    return (
      <View style={{flex: 1}}>
        <MainTabNavigator navigation={this.props.navigation} />
      </View>
    );
  }
}

MainNavigationScreen.router = MainTabNavigator.router;

// higher header on ios
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

export const RootNavigator = StackNavigator({
  MainNavigation: {
    screen: MainNavigationScreen,
    navigationOptions: {
      ...defaultNavigationOptions
    }
  },
  Test: {
    screen: TestScreen,
    navigationOptions: {
      ...defaultNavigationOptions
    }
  },
  SummaryDetail: {
    screen: SummaryDetailScreen,
    navigationOptions: {
      ...defaultNavigationOptions
    }
  },
    SummaryDetailLane: {
    screen: SummaryDetailLaneScreen,
    navigationOptions: {
      ...defaultNavigationOptions
    }
  }
});
