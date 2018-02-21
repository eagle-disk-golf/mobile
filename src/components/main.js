import React, {Component} from 'react';
import { TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
/** https://docs.nativebase.io/Components.html#card-def-headref */
import { Text, Card } from 'native-base';
/** https://github.com/GeekyAnts/react-native-easy-grid */
import {Row, Grid} from 'react-native-easy-grid';
import {globalStyles} from '../res/styles';
import {COLORS} from '../res/styles/constants';

// Other way to import components/variables/etc
// import styles from '../res/styles'

export default class MainButton extends Component {
    /**
     * Render function that makes the home screen with cards and navigation.
     */
  render() {
    return (
      <Grid style={[globalStyles.bgDefault]}>
        <Row size={50}>
        <Card style={style.card}>
            <TouchableOpacity style={[style.touch]} onPress={() => this.props.navigation.navigate('Tracking')}>
              <ImageBackground source={require('../res/images/new_game_card.png')} style={[style.image]} resizeMode='stretch'/>
              <Text style={[globalStyles.textDark, style.text]}>NEW GAME</Text>
            </TouchableOpacity>
        </Card>
        </Row>
        <Row size={50}>
        <Card style={style.card}>
            <TouchableOpacity style={[style.touch]} onPress={() => this.props.navigation.navigate('Summary')}>
                    <ImageBackground source={require('../res/images/summary_card.png')} style={[style.image]} resizeMode='stretch' />
              <Text style={[globalStyles.textDark, style.text]}>SUMMARY</Text>
            </TouchableOpacity>
        </Card>
        </Row>
      </Grid>
    );
  }
}

/**
 * Style settings
 */
const style = StyleSheet.create({
  touch: {
    flex: 1,
  },
  card: {
    marginLeft: 5,
    marginRight: 5,
    borderWidth: 2,
    borderColor: COLORS.textPrimary,
    margin: 0,
    padding: 2
  },
  image: {
    margin: 0,
    padding: 0,
    height: '100%'
  },
  row: {
    marginTop: 0,
    marginBottom: 0
  },
  text: {
    position: 'absolute',
    fontSize: 30,
    alignSelf: 'center',
    marginTop: '3%',
    backgroundColor: 'transparent'
  }
});
