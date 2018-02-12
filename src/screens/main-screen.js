import React, { Component } from 'react';
import Main from '../components/main';

// const instructions = Platform.select({
//   ios: 'Press Cmd+R to reload,\n' +
//     'Cmd+D or shake for dev menu',
//   android: 'Double tap R on your keyboard to reload,\n' +
//     'Shake or press menu button for dev menu he',
// });

export default class MainScreen extends Component {
    render() {
    return (
        <Main navigation={this.props.navigation} />
    );
  }
}
