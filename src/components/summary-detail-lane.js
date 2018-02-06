/*
  KIDE
  File created: 5.2.2018
  Made by: Jenni
  History:
*/

import React, {Component} from 'react';
import {View, StyleSheet, Text, ScrollView} from 'react-native';
import {Spinner} from 'native-base';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import {globalStyles} from '../res/styles';
import {COLORS} from '../res/styles/constants';
import firebase, {DB_NAMES} from '../services/firebase';
import {toArray} from '../helpers/data';
import {getDistanceInMetersBetweenCoordinates} from '../helpers/geolocation';

export default class SummaryDetailLane extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lane: {}
    };
  }

  zoomToMarkers() {
    // if called fitToElements immediatly, the map wont zoom in for some reason
    // this usually happens only on the first time map is opened
    setTimeout(() => {
      this.mapView.fitToElements(true);
    }, 100);
  }

  render() {
    console.log(this.props, 'props');
    const {loading} = this.state;
    const lane = this.props.navigation.state.params;
    return (
      <View style={{flexDirection: 'column'}}>
        <MapView
          ref={(ref) => {this.mapView = ref;}}
          onLayout={() => this.zoomToMarkers()}
          style={{height: 300, width: '100%'}}
          provider={PROVIDER_GOOGLE}
          minZoomLevel={10}
          maxZoomLevel={20}
          region={{
            latitude: lane.startLocation.latitude,
            longitude: lane.startLocation.longitude,
            latitudeDelta: 1,
            longitudeDelta: 1,
          }}>
          {lane.throws.map((item, index) => (
            <Marker
              key={index}
              coordinate={{latitude: item.latitude, longitude: item.longitude}}
              title='title'
              description='kuvaus'
            />
          ))}

        </MapView>
        <View style={styles.resultsContainer}>
          {lane.throws.map((item, index) => (
            <Text key={index} style={styles.result}>
              {index + 1}. {getDistanceInMetersBetweenCoordinates(lane.startLocation, item)}m
                      </Text>
          ))}

        </View>
      </View>
    );
  }
}


const styles = StyleSheet.create({

  resultsContainer: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap'
  },
  result: {
    // backgroundColor: 'orange',
    width: '33%',
    paddingTop: 20,
    paddingBottom: 20
  }
});
