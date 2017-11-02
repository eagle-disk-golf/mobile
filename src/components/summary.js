import React, {Component} from 'react';
import {Text} from 'native-base';
import Container from './container';

export default class Summary extends Component {
  render() {
    console.log(this.props, 'summary');
    return (
      <Container>
        <Text>summary</Text>
      </Container>
    ); 
  }
}