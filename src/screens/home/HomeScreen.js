import React, { Component } from 'react';
import {
  StyleSheet
} from 'react-native';

import {Button, Text} from 'native-base';
import Container from '../../components/container';

import {styles} from '../../res/styles/index';
import {connect} from '../../helpers/redux';
import {dispatch} from 'redux';

import {increment, decrement} from '../../modules/tracking/actions';
import {getCount} from '../../modules/tracking/selectors';


// const instructions = Platform.select({
//   ios: 'Press Cmd+R to reload,\n' +
//     'Cmd+D or shake for dev menu',
//   android: 'Double tap R on your keyboard to reload,\n' +
//     'Shake or press menu button for dev menu he',
// });


class HomeScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      latitude: null,
      longitude: null,
      error: null,
    };
    this.getLocation = this.getLocation.bind(this);
    this.nullLocation = this.nullLocation.bind(this);
  }

  getLocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
        });
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
  }

  nullLocation() {
    this.setState({
      latitude: null,
      longitude: null,
      error: null,
    });
  }

  render() {
    const {add, remove, currentCount} = this.props;
    return (
      <Container style={styles.centerContent}>
        <Text style={[styles.textPrimary]}>
          Current location
        </Text>
        <Text style={[styles.textPrimary]}>
          Latitude: {this.state.latitude}
        </Text>
        <Text style={[styles.textPrimary]}>
          Longitude: {this.state.longitude}
        </Text>
      <Button style={[styles.buttonRounded, styles.verticalMargin, styles.centerHorizontal, {width: 200, height: 200}]} onPress={this.getLocation}>
        <Text>Add</Text>
      </Button>

      <Button style={[styles.verticalMargin, styles.centerHorizontal]} onPress={this.nullLocation}>
        <Text>Remove</Text>
      </Button>
      </Container >
    );
  }
}


function mapStateToProps(state, ownProps) {
  return {
    currentCount: getCount(state)
  };
}

function mapDispatchToProps(dispatch, stateProps, ownProps) {
  return {
    add() {
      dispatch(increment());
    },
    remove() {
      dispatch(decrement());
    }
  };

}




export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);