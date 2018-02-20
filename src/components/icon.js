import React, {Component} from 'react';
import {StyleSheet, Platform} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {stylesToArray} from '../helpers/components';

export default class CustomIcon extends Component {
  render() {
    const stylesArr = stylesToArray(this.props.style);
    const styles = stylesArr.concat([styleHelper.icon]);
    return (
			<Icon {...this.props} style={styles}  />
    );
  }
}

const styleHelper = StyleSheet.create({
  icon: {
    paddingTop: Platform.OS === 'ios' ? 3 : 0
  }
});
