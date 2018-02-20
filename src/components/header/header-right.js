import React, {Component} from 'react';
import Icon from '../icon';

//App colors
import {COLORS} from '../../res/styles/constants';

export default class HeaderRight extends Component {
  render() {
    return (
        <Icon size={0} name='ios-settings' style={{color: COLORS.white}} />
    );
  }
}
