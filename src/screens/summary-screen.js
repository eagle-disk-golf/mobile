import React, {Component} from 'react';
import {View} from 'react-native';
import Summary from '../components/summary';
import {globalStyles} from '../res/styles/index';

/** Returning a view with styles and navigation props. */
export default class SummaryScreen extends Component {
  render() {
    return (
      <View style={[globalStyles.bgDefault, {flex: 1}]}>
        <Summary navigation={this.props.navigation} />
      </View>
    );
  }

}
