import React, {Component} from 'react';
import {View} from 'react-native';
import SummaryDetailLane from '../components/summary-detail-lane';

/**
 * Header with Lane title and lane number.
 */
export default class SummaryDetailLaneScreen extends Component {
  static navigationOptions = ({navigation}) => {
    const {index} = navigation.state.params;
    return {
      title: `Lane: ${index + 1}`
    };
  };

  /**
   * Returning a view and adding it to navigation's props.
   */
  render() {
    return (
      <View>
        <SummaryDetailLane navigation={this.props.navigation} />
      </View>
    );
  }
}
