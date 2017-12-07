import React, { Component } from 'react';
import {
  StyleSheet,
  View
} from 'react-native';

import {Button, Text, Container, Content} from 'native-base';
import Tracking from '../components/tracking';


// const instructions = Platform.select({
//   ios: 'Press Cmd+R to reload,\n' +
//     'Cmd+D or shake for dev menu',
//   android: 'Double tap R on your keyboard to reload,\n' +
//     'Shake or press menu button for dev menu he',
// });


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
