import React, {Component} from 'react';
import {View} from 'react-native';
import SummaryDetail from '../components/summary-detail';

export default class SummaryDetailScreen extends Component {
  render() {
    return (
      <View style={{flex: 1}}>
        <SummaryDetail navigation={this.props.navigation} />
      </View>
    );
  }
}
