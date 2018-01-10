/*
  KIDE
  File created: 30.11.2017
  Made by: Topi
  History:

*/

import React, {Component} from 'react';
import {View} from 'react-native';
import {Text, Col, Row, Grid} from 'native-base';
import {globalStyles} from '../res/styles';

export default class SummaryDetail extends Component {
  render() {
    console.log(this.props, 'summary');
    return (
      <View>
          <Text>Summary Detail</Text>
          <Text note>Date here with location</Text>
        <Grid>
            <Row>
            <Col style={{backgroundColor: '#7F1B4B', height: 50}}>
            <Text>Lane</Text>
            </Col>
            <Col style={{backgroundColor: '#7F1B4B', height: 50}}>
            <Text>Throws</Text>
            </Col>
            <Col style={{backgroundColor: '#7F1B4B', height: 50}}>
            <Text>Par</Text>
            </Col>
            <Col style={{backgroundColor: '#7F1B4B', height: 50}}>
            <Text>Score</Text>
            </Col>
            </Row>
            <Row>
            <Col style={{height: 50}}>
            <Text>1</Text>
            </Col>
            <Col style={{height: 50}}>
            <Text>4</Text>
            </Col>
            <Col style={{height: 50}}>
            <Text>3</Text>
            </Col>
            <Col style={{height: 50}}>
            <Text>+1</Text>
            </Col>
            </Row>
            <Row>
            <Col style={{backgroundColor: '#7F1B4B', height: 50}}>
            <Text>Total</Text>
            </Col>
            <Col style={{backgroundColor: '#7F1B4B', height: 50}}>
            <Text>00</Text>
            </Col>
            <Col style={{backgroundColor: '#7F1B4B', height: 50}}>
            <Text>00</Text>
            </Col>
            <Col style={{backgroundColor: '#7F1B4B', height: 50}}>
            <Text>+1</Text>
            </Col>
            </Row>
         </Grid>
      </View>
    );
  }
}
