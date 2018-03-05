import React, {Component} from 'react';
import { TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
/** https://docs.nativebase.io/Components.html#card-def-headref */
import { Text, Card } from 'native-base';
/** https://github.com/GeekyAnts/react-native-easy-grid */
import {Row, Grid} from 'react-native-easy-grid';
import {globalStyles} from '../res/styles';
import {COLORS} from '../res/styles/constants';
import FusedLocation from 'react-native-fused-location';
import MapView from 'react-native-maps';
import InfiniteListView from './infinite-list-view';

// Other way to import components/variables/etc
// import styles from '../res/styles'



 async componentDidMount() {
     const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
                        title: 'App needs to access your location',
                        message: 'App needs access to your location ' +
                        'so we can let our app be even more awesome.'
                        }
                    );
     if (granted) {
        FusedLocation.setLocationPriority(FusedLocation.Constants.HIGH_ACCURACY);
        // Get location once.
        const location = await FusedLocation.getFusedLocation();
        this.setState({lat: location.latitude, long: location.longitude});
        // Set options
        FusedLocation.setLocationPriority(FusedLocation.Constants.HIGH_ACCURACY);
        // Selfexplained
        FusedLocation.setLocationInterval(5000);
        FusedLocation.setFastestLocationInterval(3000);
        // Minimium distance between updates to actually update location.
        FusedLocation.setSmallestDisplacement(0);
        // Keep getting updated location.
        FusedLocation.startLocationUpdates();
 
        // Place listeners.
        this.subscription = FusedLocation.on('fusedLocation', location => {
           /* location = {
             latitude: 14.2323,
             longitude: -2.2323,
             speed: 0,
             altitude: 0,
             heading: 10,
             provider: 'fused',
             accuracy: 30,
             bearing: 0,
             mocked: false,
             timestamp: '1513190221416'
           }
           */
           FusedLocation.startLocationUpdates();
           console.log(location);
        });

     }
 /*
componentWillUnmount() {
 
    FusedLocation.off(this.subscription);
    // FusedLocation.off(this.errSubscription);
    FusedLocation.stopLocationUpdates();
 
}  */


export default class Test extends Component {
    /**
     * Render function that makes the gpsdemo screen with grid and navigation.
     * @Grid
     * @Row
     * @Card
     * @TouchableOpacity
     * @ImageBackground
     * @Text
     */
    
   
  render() {
    return (
      <Grid style={[globalStyles.bgDefault]}>
         <MapView
            ref={(ref) => {this.mapView = ref;}}
            style={{height: 300, width: '100%'}}
            initialRegion={{
              latitude: FusedLocation.latitude,
              longitude: FusedLocation.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
        }}>   
      </Grid>
    );
  }
}

     
      
/**
 * Style settings
 */
const style = StyleSheet.create({
  touch: {
    flex: 1,
  },
  card: {
    marginLeft: 5,
    marginRight: 5,
    borderWidth: 2,
    borderColor: COLORS.textPrimary,
    margin: 0,
    padding: 2
  },
  image: {
    margin: 0,
    padding: 0,
    height: '100%'
  },
  row: {
    marginTop: 0,
    marginBottom: 0
  },
  text: {
    position: 'absolute',
    fontSize: 30,
    alignSelf: 'center',
    marginTop: '3%',
    backgroundColor: 'transparent'
  }
});
