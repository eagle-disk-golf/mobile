import React, { Component } from 'react';
import {StyleSheet} from 'react-native';
import {Root} from 'native-base';
import {globalStyles} from './res/styles';

// navigator (routes)
import {RootNavigator} from './navigators';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      test: 'string'
    };
  }
  render() {
    return (
      <Root state={this.state} style={globalStyles.defaultFont}>
          <RootNavigator state={this.state} />
      </Root>
    );
  }
}
