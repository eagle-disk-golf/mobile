import React, {Component} from 'react';
import {View} from 'react-native';
import SummaryDetail from '../components/summary-detail';
import time from '../services/time';

export default class SummaryDetailScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    title: `${time.getFormattedDate(navigation.state.params.startLocation.timestamp)} ${navigation.state.params.address.formatted_address}`,
  });

  render() {
    return (
      <View>
        <SummaryDetail navigation={this.props.navigation} />
      </View>
    );
  }
}
