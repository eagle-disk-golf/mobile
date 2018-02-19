import React, {Component} from 'react';
import {View} from 'react-native';
import SummaryDetail from '../components/summary-detail';
import time from '../helpers/time';
import {globalStyles} from '../res/styles/index';

/* eslint max-len: 0 */
export default class SummaryDetailScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    title: `${time.getFormattedDate(navigation.state.params.startLocation.timestamp)} ${navigation.state.params.address ? navigation.state.params.address.formatted_address : 'Unnamed game'}`,
  });

  render() {
    return (
      <View style={[globalStyles.bgDefault, {flex: 1}]}>
        <SummaryDetail navigation={this.props.navigation} />
      </View>
    );
  }
}
