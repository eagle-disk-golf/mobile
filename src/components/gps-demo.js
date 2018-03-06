import React, {Component} from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import {Button, Text} from 'native-base';
import MapView, {PROVIDER_GOOGLE, Marker, Polyline, Polygon, Circle} from 'react-native-maps';
import geolocation from '../services/geolocation';
import {getDistanceInMetersBetweenCoordinates} from '../helpers/geolocation';
import BackgroundGeolocation from 'react-native-mauron85-background-geolocation';

const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = 0.01;

export default class GpsDemo extends Component {
  componentDidMount() {
    BackgroundGeolocation.configure({
      desiredAccuracy: 5,
      stationaryRadius: 1,
      distanceFilter: 1,
      notificationTitle: 'Background tracking',
      notificationText: 'enabled',
      debug: true,
      startOnBoot: false,
      stopOnTerminate: false,
      locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
      interval: 2000,
      fastestInterval: 1000,
      activitiesInterval: 2000,
      stopOnStillActivity: false,
      url: 'http://192.168.81.15:3000/location',
      httpHeaders: {
        'X-FOO': 'bar'
      },
      // customize post properties
      postTemplate: {
        lat: '@latitude',
        lon: '@longitude',
        foo: 'bar' // you can also add your own properties
      }
    });

    BackgroundGeolocation.on('location', (location) => {
      console.log(location, 'on location change');
      const position = {
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
        ...location
      };
      this.setState({position, markers: [...this.state.markers, position], locationInitialized: true});

      // handle your locations here
      // to perform long running operation on iOS
      // you need to create background task
      BackgroundGeolocation.startTask(taskKey => {
        // execute long running task
        // eg. ajax post location
        // IMPORTANT: task has to be ended by endTask
        BackgroundGeolocation.endTask(taskKey);
      });
    });

    BackgroundGeolocation.on('stationary', (stationaryLocation) => {
      // handle stationary locations here
      Actions.sendLocation(stationaryLocation);
    });

    BackgroundGeolocation.on('error', (error) => {
      console.log('[ERROR] BackgroundGeolocation error:', error);
    });

    BackgroundGeolocation.on('start', () => {
      console.log('[INFO] BackgroundGeolocation service has been started');
    });

    BackgroundGeolocation.on('stop', () => {
      console.log('[INFO] BackgroundGeolocation service has been stopped');
    });

    BackgroundGeolocation.on('authorization', (status) => {
      console.log('[INFO] BackgroundGeolocation authorization status: ' + status);
      if (status !== BackgroundGeolocation.AUTHORIZED) {
        Alert.alert('Location services are disabled', 'Would you like to open location settings?', [
          {text: 'Yes', onPress: () => BackgroundGeolocation.showLocationSettings()},
          {text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel'}
        ]);
      }
    });

    BackgroundGeolocation.on('background', () => {
      console.log('[INFO] App is in background');
    });

    BackgroundGeolocation.on('foreground', () => {
      console.log('[INFO] App is in foreground');
    });

    BackgroundGeolocation.checkStatus(status => {
      console.log('[INFO] BackgroundGeolocation service is running', status.isRunning);
      console.log('[INFO] BackgroundGeolocation service has permissions', status.hasPermissions);
      console.log('[INFO] BackgroundGeolocation auth status: ' + status.authorization);

      // you don't need to check status before start (this is just the example)
      if (!status.isRunning) {
        BackgroundGeolocation.start(); //triggers start on start event
        BackgroundGeolocation.getLocations((locations) => {
            console.log(locations, 'locations');
          }
        );
      }
    });

    // you can also just start without checking for status
    // BackgroundGeolocation.start();
  }

  componentWillUnmount() {
    // unregister all event listeners
    BackgroundGeolocation.events.forEach(event => BackgroundGeolocation.removeAllListeners(event));
  }
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
