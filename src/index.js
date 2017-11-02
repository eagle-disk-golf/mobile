import React, { Component } from 'react';

import {Root} from 'native-base';

// navigator (routes)
import {RootNavigator} from './navigators';

export default class App extends Component {
  render() {
    return (
      <Root>
          <RootNavigator />
      </Root>
    );
  }
}