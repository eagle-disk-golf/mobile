import React, {Component} from 'react';
import { StyleSheet } from 'react-native';
/** https://nativebase.io/docs/v0.5.0/components#thumbnail */
import {Text, Thumbnail, Item} from 'native-base';
import {COLORS} from '../../res/styles/constants';

export default class HeaderLeft extends Component {
    /**
     * Render function that renders the logo image and Eagle Disc Golf text.
     * @render
     * @Item
     * @Thumbnail
     * @Text
     */
  render() {
    return (
      <Item onPress={() => this.props.navigation.navigate('Test')} style={styles.container}>
        <Thumbnail style={styles.headerImage} source={require('../../res/images/eagle_logo.png')} />
        <Text style={styles.title}>Eagle{'\n'}Disc{'\n'}Golf</Text>
      </Item>
    );
  }
}

/**
 * Stylesheet.
 */
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
