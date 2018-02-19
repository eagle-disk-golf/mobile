import React, {Component} from 'react';
import {Container} from 'native-base';
import {globalStyles} from '../res/styles';
import {stylesToArray} from '../helpers/components';

export default class ContainerComponent extends Component {
/**
 * Represents a book.
 * @constructor
 * @param {string} title - The title of the book.
 * @param {string} author - The author of the book.
 */
  render() {
    const {style} = this.props;
    const styles = stylesToArray(style);

    return (
      <Container style={[globalStyles.bgDefault, ...styles]}>{this.props.children}</Container>
    );
  }
}
