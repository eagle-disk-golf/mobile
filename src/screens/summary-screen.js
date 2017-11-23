import React, {Component} from 'react';
import {Container, Content} from 'native-base';
import Summary from '../components/summary';

export default class SummaryScreen extends Component {
  render() {
    return (
      <Container>
        <Content>
          <Summary navigation={this.props.navigation} />
        </Content>
      </Container>
    );
  }

}
