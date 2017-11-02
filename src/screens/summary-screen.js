import React, {Component} from 'react';
import Summary from '../components/summary';

export default class SummaryScreen extends Component {
  render() {
    return (
      <Summary navigation={this.props.navigation} />
    );
  }

}