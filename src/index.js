import React, { Component } from 'react';
import {StyleSheet} from 'react-native';
import {Root} from 'native-base';
import {globalStyles} from './res/styles';
import {RootNavigator} from './navigators';

export default class App extends Component {
  render() {
    return (
      <Root state={this.state} style={globalStyles.defaultFont}>
          <RootNavigator state={this.state} />
      </Root>
    );
  }
}
