/*
  KIDE
  File created: 30.11.2017
  Made by: Jenni
  History:
  
*/

import React, {Component} from 'react';
import {View} from 'react-native';
import {Text, Container, Content, List, ListItem, Body, Right, Center, Icon} from 'native-base';
import {Col, Row, Grid} from "react-native-easy-grid";


export default class HeaderRight extends Component {
  render() {
    return (
<Icon ios='settings' android="md-settings" style={{color: '#fff'}} />
    );
  }
}
