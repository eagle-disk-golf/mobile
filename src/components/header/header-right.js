/*
  KIDE
  File created: 30.11.2017
  Made by: Jenni
  History:
  12.12.2017 Riku: Use custom icon component

*/

import React, {Component} from 'react';
import {View} from 'react-native';
import {Text, Container, Content, List, ListItem, Body, Right, Center} from 'native-base';
import Icon from '../icon';
import {Col, Row, Grid} from "react-native-easy-grid";
//App colors
import {COLORS} from '../../res/styles/constants';

export default class HeaderRight extends Component {
  render() {
    return (
      <Icon size={30} name='ios-settings' style={{color: COLORS.default}} />
    );
  }
}
