import React, { Component } from 'react';
import Main from '../components/main';

/* 
 * Render returning main screen and making it as navigation's props.
 **/
export default class MainScreen extends Component {
    render() {
    return (
        <Main navigation={this.props.navigation} />
    );
  }
}
