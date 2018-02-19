import React, {Component} from 'react';
import {Container} from 'native-base';
import {globalStyles} from '../res/styles';
import {stylesToArray} from '../helpers/components';

export default class ContainerComponent extends Component {
  render() {
    const {style} = this.props;
    const styles = stylesToArray(style);

    /**
      * Returns a container with styles
      */
    return (
      <Container style={[globalStyles.bgDefault, ...styles]}>{this.props.children}</Container>
    );
  }
}
