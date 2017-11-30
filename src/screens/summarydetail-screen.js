import React, {Component} from 'react';
import {Container, Content} from 'native-base';
import SummaryDetail from '../components/summary-detail';

export default class SummaryDetailScreen extends Component {
  render() {
    return (
      <Container>
        <Content>
          <SummaryDetail navigation={this.props.navigation} />
        </Content>
      </Container>
    );
  }

}
