import React, {Component} from 'react';
import {View} from 'react-native';
import {Container, Content} from 'native-base';
import Summary from '../components/summary';

export default class SummaryScreen extends Component {
  render() {
    return (
      <Summary navigation={this.props.navigation} />
    );
  }

}
