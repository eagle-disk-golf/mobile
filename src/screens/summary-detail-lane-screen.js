import React, {Component} from 'react';
import {View} from 'react-native';
import SummaryDetailLane from '../components/summary-detail-lane';

export default class SummaryDetailLaneScreen extends Component {
  static navigationOptions = ({navigation}) => {
    console.log(navigation.state, 'navigation');
    const {index} = navigation.state.params;
    return {
      title: `Lane: ${index + 1}`
    };
  };

  render() {
    return (
      <View>
        <SummaryDetailLane navigation={this.props.navigation} />
      </View>
    );
  }
}
