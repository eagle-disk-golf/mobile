import React, {Component} from 'react';
import { StyleSheet, Platform } from 'react-native';
/** https://github.com/oblador/react-native-vector-icons */
import Icon from 'react-native-vector-icons/Ionicons';
import {stylesToArray} from '../helpers/components';

export default class CustomIcon extends Component {
    /**
     * Render function that takes styles and custom icons as variables.
     * Returns custom icons.
     * @render
     */
  render() {
    const stylesArr = stylesToArray(this.props.style);
    const styles = stylesArr.concat([styleHelper.icon]);
    return (
			<Icon {...this.props} style={styles}  />
    );
  }
}

/**
 * Custom padding for iOS devices.
 * @paddingTop
 * @icon
 */
const styleHelper = StyleSheet.create({
  icon: {
    paddingTop: Platform.OS === 'ios' ? 3 : 0
  }
});
