/*
  KIDE
  File created: beginning
  Made by: Riku
  History: Topi - 30.11.2017 - Added StackNavigation for SummaryScreen
  History: Riku - 12.12.2017 - Use custom icon, formatting
  History: Oskari - 29.1.2018 - Styling
*/

import React, {Component} from 'react';
import {View} from 'react-native';
import {StackNavigator, TabNavigator} from 'react-navigation';
import Icon from '../components/icon';
import Color from 'color';

//App colors
import {COLORS} from '../res/styles/constants';

import MainScreen from '../screens/main-screen';
import TrackingScreen from '../screens/tracking-screen';
import SummaryScreen from '../screens/summary-screen';

import HeaderLeft from '../components/header/header-left';

import SummaryDetailScreen from '../screens/summary-detail-screen';
import SummaryDetailLaneScreen from '../screens/summary-detail-lane-screen';
import {isIos} from '../helpers/platform';

const TabIcon = ({name, isFocused}) => {
  const iconColor = isFocused ? null : 'lightgray';
  return <Icon size={20} name={name} style={{color: iconColor}} />;
};

const TabBarOptions = {
  showIcon: true,
  activeTintColor: COLORS.textPrimary,
  // inactiveTintColor: 'lightgray',
  inactiveTintColor: Color(COLORS.textPrimary).fade(0.8),
  style: {
    backgroundColor: COLORS.white,
    elevation: 0,
    borderBottomWidth: 0.5,
    borderTopWidth: 0.0,
    borderColor: Color(COLORS.textPrimary).fade(0.8)

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
