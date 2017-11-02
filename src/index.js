import React, { Component } from 'react';

import {Root} from 'native-base';

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
      <Root state={this.state}>
          <RootNavigator state={this.state} />
      </Root>
    );
  }
}