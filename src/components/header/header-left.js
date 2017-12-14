/*
  KIDE
  File created: 30.11.2017
  Made by: Jenni
  History:
  12.12.2017 Riku: Transparent borderBottom for item

*/

import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import {Text, Container, Content, List, ListItem, Body, Right, Center, Thumbnail, Item} from 'native-base';
import {Col, Row, Grid} from "react-native-easy-grid";

export default class HeaderLeft extends Component {
  render() {
    return (
      <Item style={styles.container}>
        <Thumbnail style={styles.headerImage} source={require('../../res/images/newgame_card.png')} />
        <Text style={styles.title}>Eagle{"\n"}Disc{"\n"}Golf</Text>
      </Item>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderBottomColor: 'transparent'
  },
  header: {
    backgroundColor: 'pink',
  },
  headerImage: {
    height: 60,
    width: 60,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 20,
  },
});
