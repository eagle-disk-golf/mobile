import React, {Component} from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import {Button, Text} from 'native-base';
import MapView, {PROVIDER_GOOGLE, Marker, Polyline, Polygon, Circle} from 'react-native-maps';
import geolocation from '../services/geolocation';
import {getDistanceInMetersBetweenCoordinates} from '../helpers/geolocation';

const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = 0.01;

export default class GpsDemo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      position: {},
      markers: [],
      locationInitialized: false
    };
  }

  updatePosition = () => {
    geolocation.getCurrentPosition().then(pos => {
      const position = {
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
        ...pos
      };
      this.setState({
        position,
        locationInitialized: true,
        markers: [...this.state.markers, position]
      });
    }).catch(er => {
      Alert.alert(
        'Whoops',
        er.message,
        [
          {text: 'Okay'},
        ]);
    });
  }

  componentDidMount() {
    this.updatePosition();
  }

  render() {
    const {position, locationInitialized, markers} = this.state;
    if (locationInitialized) console.log(position, 'pos');
    return (
      <View style={{flex: 1}}>
        <View style={{width: '100%', height: '70%'}}>
          {this.state.locationInitialized &&
            <MapView
              style={styles.map}
              region={position}
              markers={[position]}>
              {markers.map((item, index) => <Marker key={index} coordinate={item} />)}
            </MapView>
          }
        </View>
        <Button onPress={this.updatePosition}>
          <Text>Click</Text>
        </Button>
        {locationInitialized && <View>
          <Text>Coordinate: {position.latitude} {position.longitude}</Text>
          {markers.length > 1 && <Text>Distane to previous: {getDistanceInMetersBetweenCoordinates(markers[markers.length - 1], markers[markers.length - 2])} </Text>}
          <Text>Clicked: {markers.length - 1}</Text>
        </View>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
