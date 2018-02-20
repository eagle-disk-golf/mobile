import React, {Component} from 'react';
import {Container} from 'native-base';
import {globalStyles} from '../res/styles';
import {stylesToArray} from '../helpers/components';

export default class ContainerComponent extends Component {
/**
 * Not used anywhere (CHECK!).
 * This should be deleted with caution.
 */
  render() {
    const {style} = this.props;
    const styles = stylesToArray(style);

    return (
      <Container style={[globalStyles.bgDefault, ...styles]}>{this.props.children}</Container>
    );
  }
}
