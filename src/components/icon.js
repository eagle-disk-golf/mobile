import React, {Component} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {stylesToArray} from '../helpers/components';
import {StyleSheet} from 'react-native';

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
    paddingTop: 3
  }
});
