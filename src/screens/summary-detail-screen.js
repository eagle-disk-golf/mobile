import React, {Component} from 'react';
import {View} from 'react-native';
import SummaryDetail from '../components/summary-detail';

export default class SummaryDetailScreen extends Component {
  render() {
    return (
      <View>
        <SummaryDetail navigation={this.props.navigation} />
      </View>
    );
  }
}
