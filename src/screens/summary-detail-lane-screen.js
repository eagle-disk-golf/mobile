import React, {Component} from 'react';
import {View} from 'react-native';
import SummaryDetailLane from '../components/summary-detail-lane';
import time from '../services/time';

export default class SummaryDetailLaneScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    title: 'testiii'
  });

  render() {
    return (
      <View>
        <SummaryDetailLane navigation={this.props.navigation} />
      </View>
    );
  }
}
