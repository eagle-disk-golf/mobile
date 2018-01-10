/*
  KIDE
  File created: 30.11.2017
  Made by: Jenni
  History:
  12.12.2017 Riku: Use custom icon component

*/

import React, {Component} from 'react';
import Icon from '../icon';

//App colors
import {COLORS} from '../../res/styles/constants';

export default class HeaderRight extends Component {
  render() {
    return (
      <Icon size={30} name='ios-settings' style={{color: COLORS.default}} />
    );
  }
}
