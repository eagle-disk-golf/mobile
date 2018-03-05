import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {Text, Thumbnail, Item} from 'native-base';
import {COLORS} from '../../res/styles/constants';

export default class HeaderLeft extends Component {
  render() {
    return (
      <Item onPress={() => this.props.navigation.navigate('Gpsdemo')} style={styles.container}>
        <Thumbnail style={styles.headerImage} source={require('../../res/images/newgame_card.png')} />
        <Text style={styles.title}>Eagle{'\n'}Disc{'\n'}Golf</Text>
      </Item>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderBottomColor: 'transparent'
  },
  header: {
  },
  headerImage: {
    height: 60,
    width: 60,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 20,
    color: COLORS.textPrimary,
    fontFamily: 'Roboto'
  },
});
