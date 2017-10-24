import React, { Component } from 'react';

import {Root} from 'native-base';
import {Provider} from 'react-redux';

// store and sagas
import store from './store/configure-store';
import rootSaga from './sagas';

// navigator (routes)
import {RootNavigator} from './navigators';

export default class App extends Component {
  componentWillMount() {
    store.runSaga(rootSaga);
  }
  render() {
    return (
      <Root>
        <Provider store={store}>
          <RootNavigator />
        </Provider>
      </Root>
    );
  }
}