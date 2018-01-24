import React, {Component} from 'react';
import {TouchableOpacity, StyleSheet, ImageBackground, View} from 'react-native';
import {Text } from 'native-base';
import {Col, Row, Grid} from 'react-native-easy-grid';
import {globalStyles} from '../res/styles';

// Other way to import components/variables/etc
// import styles from '../res/styles'


export default class MainButton extends Component {
  render() {
    return (
      <Grid>
        <Col>
          <Row size={50}>
            <TouchableOpacity style={[style.touch]} onPress={() => this.props.navigation.navigate('Tracking')}>
              <ImageBackground
                source={require('../res/images/new_game_card.png')}
                style={[style.image]}
              />
              <Text
                style={[style.text]}>
                NEW GAME
                </Text>
            </TouchableOpacity>
          </Row>

          <Row size={50}>
            <TouchableOpacity style={[style.touch]} onPress={() => this.props.navigation.navigate('Summary')}>
              <ImageBackground
                source={require('../res/images/statistic_card.png')}
                style={[style.image]}
              />
              <Text
                style={style.text}>
                STATISTICS
                </Text>
            </TouchableOpacity>
          </Row>
        </Col>

        <Col>
          <Row size={50}>
            <TouchableOpacity style={[style.touch]} onPress={() => this.props.navigation.navigate('Summary')}>
              <ImageBackground
                source={require('../res/images/summary_card.png')}
                style={[style.image]}
              />
              <Text
                style={style.text}>
                SUMMARY
                </Text>
            </TouchableOpacity>
          </Row>
          <Row size={50}>
            <TouchableOpacity style={[style.touch]} onPress={() => this.props.navigation.navigate('Tracking')}>
              <ImageBackground
                source={require('../res/images/new_game_card.png')}
                style={[style.image]}
              />
              <Text
                style={style.text}>
                NEW GAME
                </Text>
            </TouchableOpacity>
          </Row>
        </Col>
      </Grid>
    );
  }
}

const style = StyleSheet.create({
  touch: {
    flex: 1
  },
  image: {
    minWidth: '10%',
    flex: 1,
    alignSelf: 'auto',
    width: undefined,
    height: undefined,
    margin: 3
  },
  col: {
    width: '100%',
    height: '100%'
  },
  row: {
    borderWidth: 1
  },
  text: {
    position: 'absolute',
    fontSize: 30,
    fontFamily: 'Roboto',
    alignSelf: 'center',
    marginTop: '10%',
    backgroundColor: 'transparent'
  }
});
