/*
  KIDE
  File created: 30.11.2017
  Made by: Jenni
  History:
  12.12.2017 Riku: Transparent borderBottom for item

*/

import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {Text, Thumbnail, Item} from 'native-base';

export default class HeaderLeft extends Component {
  render() {
    console.log(this, 'mooro:');
    return (
      <Item onPress={() => this.props.navigation.navigate('Test')} style={styles.container}>
        <Thumbnail style={styles.headerImage} source={require('../../res/images/newgame_card.png')} />
        <Text style={styles.title}>Eagle{'\n'}Disc{'\n'}Golf</Text>
      </Item>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderBottomColor: 'transparent',
    // marginBottom: 5
    // height: 30,
    // marginTop: 10,
    // marginBottom: 50
  },
  header: {
    backgroundColor: 'pink',
  },
  headerImage: {
    height: 60,
    width: 60,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 20,
  },
});
