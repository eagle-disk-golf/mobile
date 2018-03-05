import React, {Component} from 'react';
import {View} from 'react-native';
import SummaryDetail from '../components/summary-detail';
import time from '../helpers/time';
import {globalStyles} from '../res/styles/index';

/** List with date and time formatted, and address beelow that. */
export default class SummaryDetailScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    title: `${time.getFormattedDate(navigation.state.params.startLocation.timestamp)} ${navigation.state.params.address ? navigation.state.params.address.formatted_address : 'Unnamed game'}`,
  });

  /** Returns a view and navigation props. */
  render() {
    return (
      <View style={[globalStyles.bgDefault, {flex: 1}]}>
        <SummaryDetail navigation={this.props.navigation} />
      </View>
    );
  }
}
