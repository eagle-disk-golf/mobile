import React, {Component} from 'react';
import {View} from 'react-native';
import {Text, Container} from 'native-base';

export default class Summary extends Component {
  render() {
    console.log(this.props, 'summary');
    return (
      <View>
        <Text>summary</Text>
      </View>
    );
  }
}
