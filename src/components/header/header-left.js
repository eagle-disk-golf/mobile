/*
  KIDE
  File created: 30.11.2017
  Made by: Jenni
  History:
  
*/

import React, {Component} from 'react';
import {View} from 'react-native';
import {Text, Container, Content, List, ListItem, Body, Right, Center, Thumbnail, Item} from 'native-base';
import {Col, Row, Grid} from "react-native-easy-grid";

export default class HeaderLeft extends Component {
  render() {
    return (
      <Item>
        <Thumbnail source={require('../../res/images/newgame_card.png')} />
           <Text>Eagle{"\n"}Disc{"\n"}Golf</Text>
    </Item>
    );
  }
}
