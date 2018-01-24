import React, {Component} from 'react';
import {View} from 'react-native';
import {Container, Content} from 'native-base';
import Summary from '../components/summary';

export default class SummaryScreen extends Component {
  render() {
    return (
      <View style={{flex: 1}}>
        <Summary navigation={this.props.navigation} />
      </View>
    );
  }

}
