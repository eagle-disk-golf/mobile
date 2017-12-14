import React, {Component} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';

export default class CustomIcon extends Component {
  render() {
    return (
			<Icon style={{paddingTop: 3}} {...this.props} />
    );
  }
}
