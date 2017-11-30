import React, {Component} from 'react';
import {Button, Icon, Text, Thumbnail, Item} from 'native-base';
import {View, TouchableOpacity} from 'react-native';
import {DrawerNavigator, StackNavigator, TabNavigator} from 'react-navigation';

import MainScreen from '../screens/main-screen';
import TrackingScreen from '../screens/tracking-screen';
import SummaryScreen from '../screens/summary-screen';
import TestScreen from '../screens/test';
import HeaderLeft from '../components/header/header-left'; 
import HeaderRight from '../components/header/header-right';



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
  Tracking: {
    screen: TrackingScreen
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
  })
;
//Nesting tabnavigator inside of stacknavigator to make the header appear
const MainNavigatorContainer = StackNavigator({
    Home: { screen: MainNavigator, 
        navigationOptions: {
           /*title: "Eagle Disc Golf"*/
            
            headerStyle: { backgroundColor: 'red' },
            headerTitleStyle: { color: 'green' },
            headerTintColor: { },
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
