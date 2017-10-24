import React, {Component} from 'react';
import {Container} from 'native-base';
import {styles} from '../res/styles/index';

import {stylesToArray} from '../helpers/components';

export default class ContainerComponent extends Component {
  render() {
    const {style} = this.props;
    const otherStyles = stylesToArray(style);

    return(
      <Container style={[styles.container, ...otherStyles]}>{this.props.children}</Container>
    )
  }
}