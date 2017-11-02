import React, {Component} from 'react';
import {Text} from 'native-base';
import Container from '../components/container';

export default class Test extends Component {
  render() {
    console.log(this.props.navigation, 'test');
    return (
      <Container style={{marginTop: 20}}>
        <Text>
          This is test
        </Text>
      </Container>
    )
  }
}