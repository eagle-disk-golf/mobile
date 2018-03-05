import React, { Component } from 'react';
import {
  StyleSheet,
  View
} from 'react-native';

import {Button, Text, Container, Content} from 'native-base';
import Tracking from '../components/tracking';

/** Returns a view with navigation props. */
export default class TrackingScreen extends Component {
    render() {
    return (
      <View style={{flex: 1}}>

        {/* <Content style={[{height: '100%', backgroundColor: 'black'}]}> */}
          <Tracking navigation={this.props.navigation} />
        {/* </Content> */}
      </View>
    );
  }
}
