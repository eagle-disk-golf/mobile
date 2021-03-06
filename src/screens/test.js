﻿import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from 'native-base';
import Container from '../components/container';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

/**
 * This component is currently not used.
 */
export default class Test extends Component {
  render() {
    return (
      <View style={styles.container}>
        <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 50,
    right: 50,
    bottom: 50,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
